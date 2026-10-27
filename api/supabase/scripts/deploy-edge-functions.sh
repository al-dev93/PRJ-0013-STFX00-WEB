#!/usr/bin/env bash

set -euo pipefail

# =============================================================================
# Edge Functions deployment script
#
# Deploys selected local Supabase Edge Function files to the self-hosted
# Supabase server.
#
# Safety principles:
# - dry-run by default;
# - only explicitly listed files are deployed;
# - no --delete;
# - .env files are refused;
# - main/supabase.toml is not deployed;
# - server-specific configuration lives in .env.deploy, which is not versioned.
# =============================================================================

# -----------------------------------------------------------------------------
# Paths
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(
  cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1
  pwd
)"

SUPABASE_DIR="$(
  cd -- "${SCRIPT_DIR}/.." >/dev/null 2>&1
  pwd
)"

LOCAL_DIR="${SUPABASE_DIR}/functions"
DEPLOY_ENV_FILE="${SUPABASE_DIR}/.env.deploy"

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------

usage() {
  cat <<'EOF'
Usage:
  deploy-edge-functions.sh [--dry-run|--apply] <file> [file...]

The file paths are relative to:
  api/supabase/functions/

Examples:

  Dry-run:
    ./api/supabase/scripts/deploy-edge-functions.sh contact.ts get-mailto.ts

  Apply:
    ./api/supabase/scripts/deploy-edge-functions.sh \
      --apply \
      contact.ts \
      get-mailto.ts

  Deploy a new function and the updated router:
    ./api/supabase/scripts/deploy-edge-functions.sh \
      --apply \
      newsletter.ts \
      main/index.ts

Options:
  --dry-run   Show what would be transferred without modifying the VM.
              This is the default mode.

  --apply     Actually transfer the files and restart the Edge Runtime.

  --help      Show this help.
EOF
}

die() {
  echo "Error: $*" >&2
  exit 1
}

info() {
  echo
  echo "==> $*"
}

# -----------------------------------------------------------------------------
# Required commands
# -----------------------------------------------------------------------------

for command in ssh rsync realpath; do
  command -v "${command}" >/dev/null 2>&1 ||
    die "Required command not found: ${command}"
done

# -----------------------------------------------------------------------------
# Load private deployment configuration
# -----------------------------------------------------------------------------

[[ -f "${DEPLOY_ENV_FILE}" ]] ||
  die "Deployment configuration not found: ${DEPLOY_ENV_FILE}"

set -a

# shellcheck disable=SC1090
source "${DEPLOY_ENV_FILE}"

set +a

# -----------------------------------------------------------------------------
# Validate deployment configuration
# -----------------------------------------------------------------------------

: "${DEPLOY_HOST:?DEPLOY_HOST is not defined in .env.deploy}"
: "${DEPLOY_USER:?DEPLOY_USER is not defined in .env.deploy}"
: "${DEPLOY_REMOTE_DIR:?DEPLOY_REMOTE_DIR is not defined in .env.deploy}"
: "${DEPLOY_COMPOSE_DIR:?DEPLOY_COMPOSE_DIR is not defined in .env.deploy}"

DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_USE_SUDO="${DEPLOY_USE_SUDO:-false}"

[[ "${DEPLOY_PORT}" =~ ^[0-9]+$ ]] ||
  die "DEPLOY_PORT must be a number."

[[ "${DEPLOY_USER}" =~ ^[A-Za-z0-9._-]+$ ]] ||
  die "DEPLOY_USER contains unsupported characters."

[[ "${DEPLOY_HOST}" =~ ^[A-Za-z0-9._-]+$ ]] ||
  die "DEPLOY_HOST contains unsupported characters."

[[ "${DEPLOY_REMOTE_DIR}" =~ ^/[A-Za-z0-9._/-]+$ ]] ||
  die "DEPLOY_REMOTE_DIR must be an absolute Unix path."

[[ "${DEPLOY_COMPOSE_DIR}" =~ ^/[A-Za-z0-9._/-]+$ ]] ||
  die "DEPLOY_COMPOSE_DIR must be an absolute Unix path."

case "${DEPLOY_USE_SUDO}" in
  true | false)
    ;;
  *)
    die "DEPLOY_USE_SUDO must be either true or false."
    ;;
esac

[[ -d "${LOCAL_DIR}" ]] ||
  die "Local Edge Functions directory not found: ${LOCAL_DIR}"

# -----------------------------------------------------------------------------
# Arguments
# -----------------------------------------------------------------------------

MODE="dry-run"

if [[ $# -eq 0 ]]; then
  usage
  exit 1
fi

case "${1:-}" in
  --dry-run)
    MODE="dry-run"
    shift
    ;;

  --apply)
    MODE="apply"
    shift
    ;;

  --help | -h)
    usage
    exit 0
    ;;
esac

[[ $# -gt 0 ]] ||
  die "No Edge Function file specified."

# -----------------------------------------------------------------------------
# Validate and normalize files
# -----------------------------------------------------------------------------

LOCAL_DIR_REAL="$(realpath -e -- "${LOCAL_DIR}")"

FILES=()

for requested_file in "$@"; do
  # Remove a harmless leading "./".
  requested_file="${requested_file#./}"

  [[ -n "${requested_file}" ]] ||
    die "Empty file path."

  [[ "${requested_file}" != /* ]] ||
    die "Absolute paths are not allowed: ${requested_file}"

  case "${requested_file}" in
    .env | \
    .env.* | \
    */.env | \
    */.env.*)
      die "Refusing to deploy environment file: ${requested_file}"
      ;;

    main/supabase.toml)
      die "Refusing to deploy server configuration file: ${requested_file}"
      ;;
  esac

  SOURCE_PATH="$(
    realpath -e -- "${LOCAL_DIR}/${requested_file}" 2>/dev/null
  )" ||
    die "File not found: ${LOCAL_DIR}/${requested_file}"

  [[ -f "${SOURCE_PATH}" ]] ||
    die "Not a regular file: ${requested_file}"

  # Prevent "../" traversal and symlinks pointing outside functions/.
  case "${SOURCE_PATH}" in
    "${LOCAL_DIR_REAL}"/*)
      ;;
    *)
      die "File resolves outside the Edge Functions directory: ${requested_file}"
      ;;
  esac

  RELATIVE_PATH="${SOURCE_PATH#"${LOCAL_DIR_REAL}/"}"

  FILES+=("${RELATIVE_PATH}")
done

# -----------------------------------------------------------------------------
# SSH configuration
# -----------------------------------------------------------------------------

REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

SSH_OPTIONS=(
  -p "${DEPLOY_PORT}"
)

RSYNC_REMOTE_SHELL="ssh -p ${DEPLOY_PORT}"

# -----------------------------------------------------------------------------
# Deployment summary
# -----------------------------------------------------------------------------

echo
echo "Supabase Edge Functions deployment"
echo "=================================="
echo
echo "Mode:          ${MODE}"
echo "Local source:  ${LOCAL_DIR}"
echo "Remote host:   ${DEPLOY_HOST}"
echo "Remote user:   ${DEPLOY_USER}"
echo
echo "Files:"

for file in "${FILES[@]}"; do
  echo "  - ${file}"
done

echo

# -----------------------------------------------------------------------------
# Remote preflight
# -----------------------------------------------------------------------------

info "Checking remote deployment directory"

ssh "${SSH_OPTIONS[@]}" "${REMOTE}" \
  "test -d '${DEPLOY_REMOTE_DIR}'" ||
  die "Remote deployment directory does not exist."

ssh "${SSH_OPTIONS[@]}" "${REMOTE}" \
  "test -w '${DEPLOY_REMOTE_DIR}'" ||
  die "Remote deployment directory is not writable by ${DEPLOY_USER}."

# -----------------------------------------------------------------------------
# rsync
# -----------------------------------------------------------------------------

RSYNC_OPTIONS=(
  --recursive
  --links
  --perms
  --times
  --compress
  --checksum
  --relative
  --itemize-changes
)

if [[ "${MODE}" == "dry-run" ]]; then
  RSYNC_OPTIONS+=(--dry-run)
fi

info "Running rsync"

(
  cd "${LOCAL_DIR}"

  rsync \
    "${RSYNC_OPTIONS[@]}" \
    -e "${RSYNC_REMOTE_SHELL}" \
    "${FILES[@]}" \
    "${REMOTE}:${DEPLOY_REMOTE_DIR}/"
)

# -----------------------------------------------------------------------------
# Dry-run stops here
# -----------------------------------------------------------------------------

if [[ "${MODE}" == "dry-run" ]]; then
  echo
  echo "Dry-run completed successfully."
  echo "No file was modified on the VM."
  echo
  echo "To perform this deployment, run:"
  echo

  printf "  %q --apply" "$0"

  for file in "${FILES[@]}"; do
    printf " %q" "${file}"
  done

  printf "\n\n"

  exit 0
fi

# -----------------------------------------------------------------------------
# Docker Compose command
# -----------------------------------------------------------------------------

if [[ "${DEPLOY_USE_SUDO}" == "true" ]]; then
  DOCKER_COMPOSE="sudo -n docker compose"
else
  DOCKER_COMPOSE="docker compose"
fi

# -----------------------------------------------------------------------------
# Restart Edge Runtime
# -----------------------------------------------------------------------------

info "Checking Docker Compose access"

ssh "${SSH_OPTIONS[@]}" "${REMOTE}" \
  "cd '${DEPLOY_COMPOSE_DIR}' && ${DOCKER_COMPOSE} ps functions >/dev/null" ||
  die "Unable to access the Docker Compose functions service."

info "Restarting Edge Runtime"

ssh "${SSH_OPTIONS[@]}" "${REMOTE}" \
  "cd '${DEPLOY_COMPOSE_DIR}' && ${DOCKER_COMPOSE} restart functions"

# -----------------------------------------------------------------------------
# Status
# -----------------------------------------------------------------------------

info "Checking Edge Runtime status"

ssh "${SSH_OPTIONS[@]}" "${REMOTE}" \
  "cd '${DEPLOY_COMPOSE_DIR}' && ${DOCKER_COMPOSE} ps functions"

# -----------------------------------------------------------------------------
# Logs
# -----------------------------------------------------------------------------

info "Recent Edge Runtime logs"

ssh "${SSH_OPTIONS[@]}" "${REMOTE}" \
  "cd '${DEPLOY_COMPOSE_DIR}' && ${DOCKER_COMPOSE} logs --tail=30 functions"

# -----------------------------------------------------------------------------
# Done
# -----------------------------------------------------------------------------

echo
echo "Deployment completed successfully."
