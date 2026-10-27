import type { DialogFormInputElement } from '@/types';

import type { FormInputName } from '../types';

interface StoredEntry {
  value: string;
  savedAt: number;
}

interface StoredAutocomplete {
  version: 1;
  entries: StoredEntry[];
}

const STORAGE_PREFIX = 'stack-flex:contact-autocomplete:v1:';
const STORAGE_VERSION = 1;
const MAX_ENTRIES = 5;
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const STORABLE_FIELDS = ['name', 'company', 'email', 'tel'] as const;

function isStorableField(name: string): name is (typeof STORABLE_FIELDS)[number] {
  return STORABLE_FIELDS.some((field) => field === name);
}

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function getKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`;
}

/**
 * Discards the old, undated storage format rather than guessing its age.
 *
 * @param storage - Browser storage.
 * @param name - Autocomplete field name.
 * @returns Nothing.
 */
function discardLegacyEntries(storage: Storage, name: string): void {
  // The previous implementation used generic field names as storage keys.
  // Remove only values matching its array-of-strings format.
  const legacy = storage.getItem(name);
  if (legacy === null) return;

  try {
    const parsed: unknown = JSON.parse(legacy);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      storage.removeItem(name);
    }
  } catch {
    // Do not delete a possibly unrelated value with the same generic key.
  }
}

/**
 * Returns valid, unexpired entries and prunes stale or malformed records.
 *
 * @param name - Autocomplete field name.
 * @returns Up to five entries, newest first.
 */
function readEntries(name: string): StoredEntry[] {
  if (!isStorableField(name)) return [];

  const storage = getStorage();
  if (!storage) return [];

  try {
    discardLegacyEntries(storage, name);

    const key = getKey(name);
    const raw = storage.getItem(key);
    if (!raw) return [];

    let stored: unknown;
    try {
      stored = JSON.parse(raw);
    } catch {
      storage.removeItem(key);
      return [];
    }

    if (
      typeof stored !== 'object' ||
      stored === null ||
      !('version' in stored) ||
      stored.version !== STORAGE_VERSION ||
      !('entries' in stored) ||
      !Array.isArray(stored.entries)
    ) {
      storage.removeItem(key);
      return [];
    }

    const now = Date.now();
    const entries: StoredEntry[] = [];
    const seen = new Set<string>();

    for (const item of stored.entries
      .filter(
        (entry: unknown): entry is StoredEntry =>
          typeof entry === 'object' &&
          entry !== null &&
          'value' in entry &&
          typeof entry.value === 'string' &&
          'savedAt' in entry &&
          typeof entry.savedAt === 'number' &&
          Number.isFinite(entry.savedAt),
      )
      .sort((a: StoredEntry, b: StoredEntry) => b.savedAt - a.savedAt)) {
      if (!item.value.trim() || item.savedAt > now || now - item.savedAt >= RETENTION_MS) continue;
      if (seen.has(item.value)) continue;

      entries.push({ value: item.value, savedAt: item.savedAt });
      seen.add(item.value);
      if (entries.length === MAX_ENTRIES) break;
    }

    const cleaned: StoredAutocomplete = { version: 1, entries };
    const nextRaw = JSON.stringify(cleaned);

    if (nextRaw !== raw) {
      if (entries.length) storage.setItem(key, nextRaw);
      else storage.removeItem(key);
    }

    return entries;
  } catch {
    // Storage might be disabled, full, or inaccessible.
    return [];
  }
}

/**
 * Persists a value for a contact field with bounded retention.
 *
 * @param value - Final validated value.
 * @param name - Field name.
 * @param replace - Whether to replace the field's existing entries.
 * @returns True when the value has been stored successfully.
 */
function writeEntry(value: string, name: FormInputName, replace: boolean): boolean {
  if (!isStorableField(name) || !value.trim()) return false;

  const storage = getStorage();
  if (!storage) return false;

  try {
    discardLegacyEntries(storage, name);
    const existing = replace ? [] : readEntries(name);
    const now = Date.now();
    const entries: StoredEntry[] = [
      { value, savedAt: now },
      ...existing.filter((entry) => entry.value !== value),
    ].slice(0, MAX_ENTRIES);

    const record: StoredAutocomplete = { version: 1, entries };
    storage.setItem(getKey(name), JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

/**
 * Replaces the stored suggestions for one field with a single value.
 *
 * @param value - Final validated value.
 * @param name - Field name.
 * @returns True if storage succeeded.
 */
export function saveToLocalStorage(value: string, name: FormInputName): boolean {
  return writeEntry(value, name, true);
}

/**
 * Adds or refreshes one suggestion while retaining at most five values.
 *
 * @param value - Final validated value.
 * @param name - Field name.
 * @returns True if storage succeeded.
 */
export function addToLocalStorage(value: string, name: FormInputName): boolean {
  return writeEntry(value, name, false);
}

/**
 * Checks whether a field has any currently retained autocomplete values.
 *
 * @param name - Field name.
 * @returns True when an unexpired suggestion exists.
 */
export function hasStoredAutocomplete(name: FormInputName): boolean {
  return readEntries(name).length > 0;
}

/**
 * Retrieves stored suggestions for the current input.
 *
 * @param input - Current form input.
 * @param isStored - Whether autocomplete storage is enabled for this field.
 * @param filter - Whether to keep suggestions matching the input prefix.
 * @returns Matching values, or undefined when none are available.
 */
export function getAutocompleteInput(
  input: DialogFormInputElement,
  isStored: boolean = false,
  filter?: boolean,
): string[] | undefined {
  if (!input || !isStored) return undefined;

  const values = readEntries(input.name).map((entry) => entry.value);
  const suggestions = filter
    ? values.filter((value) => value.toLocaleUpperCase().startsWith(input.value.toLocaleUpperCase()))
    : values;

  return suggestions.length ? suggestions : undefined;
}

/**
 * Deletes all saved contact autocomplete values, including the legacy format.
 *
 * @returns True when the deletion completed successfully.
 */
export function clearStoredAutocomplete(): boolean {
  const storage = getStorage();
  if (!storage) return false;

  try {
    for (const name of STORABLE_FIELDS) {
      storage.removeItem(getKey(name));
      // These were the keys used by the previous version of this module.
      storage.removeItem(name);
    }
    return true;
  } catch {
    return false;
  }
}
