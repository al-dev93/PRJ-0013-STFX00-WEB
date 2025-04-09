import type { BelongsTo, HasMany } from 'miragejs/-types';

import type {
  ContactFormInput,
  ContactFormModal,
  Deliverable,
  DetailSection,
  ErrorMessage,
  FormInput,
  IndexPageSection,
  ProjectData,
  TooltipContent,
} from '.';

export type MockedContactFormInput = ContactFormInput & {
  contactFormModal?: BelongsTo<string>;
  formInput?: BelongsTo<string>;
  contactFormTooltips?: HasMany<string>;
};
export type MockedFormInput = FormInput & { contactFormInput?: BelongsTo<string>; errorMessage?: BelongsTo<string> };
export type MockedErrorMessage = ErrorMessage & { formInput?: BelongsTo<string> };

export type MockedIndexPageSection = IndexPageSection & { detailSections?: HasMany<string> };
export type MockedDetailsSection = DetailSection & {
  showcaseSection?: BelongsTo<string>;
  boldDetailSections?: HasMany<string>;
};
export type MockedBoldDetailsSection = DetailSection & { detailSection?: BelongsTo<string> };

export type MockedProjectData = ProjectData & { projectDeliverables?: HasMany<string> };
export type MockedDeliverable = Deliverable & { project?: BelongsTo<string>; account?: BelongsTo<string> };

export type MockedContactFormModal = ContactFormModal & { contactFormInputs?: HasMany<string> };
export type MockedContactFormTooltip = TooltipContent & { contactFormInput?: BelongsTo<string> };
