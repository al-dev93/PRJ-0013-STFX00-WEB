/**
 * Props for the ProjectSheetLink component.
 *
 * @type {Object} ProjectSheetLinkProps
 * @property {string} [projectSheet] - The project sheet identifier or relative path (without extension).
 * @property {string} title - Project title used for the accessible label.
 * @property {string} linkLabel - Text in the link
 * @property {string} [className] - Optional CSS class to style the anchor element. Defaults to "link-pdf".
 */
export type ProjectSheetLinkProps = {
  projectSheet?: string;
  title: string;
  linkLabel: string;
  className?: string;
};
