import { createServer } from 'miragejs';

import type { EncryptedMail } from '@/types';

import { boldDetailSections } from './fixtures/mockedBoldDetailsShowcaseSections';
import { contactFormTooltips } from './fixtures/mockedContactFormTooltips';
import { accounts } from './fixtures/mockedDataAccounts';
import { contactFormInputs } from './fixtures/mockedDataContactFormInputs';
import { contactFormModals } from './fixtures/mockedDataContactFormModals';
import { errorMessages } from './fixtures/mockedDataErrorMessages';
import { formInputs } from './fixtures/mockedDataFormInputs';
import { menuItems } from './fixtures/mockedDataMenu';
import { projects } from './fixtures/mockedDataProjects';
import { showcaseSections } from './fixtures/mockedDataShowcaseSections';
import { skills } from './fixtures/mockedDataSkills';
import { detailSections } from './fixtures/mockedDetailsShowcaseSections';
import { projectDeliverables } from './fixtures/mockedProjectDeliverables';
import { models } from './models/mockedApiModels';
import { serializers } from './serializers/mockedApiSerializers';
import { generateCSRFToken } from '../secure/mockedEncryption';

/**
 *
 * @description //TODO: add comment
 * @export
 * @param {EncryptedMail} encryptedEmail
 * @param {*} [{ environment = 'development' }={}]
 * @return {*}
 * @al-dev93
 */
export function makeServer(encryptedEmail?: EncryptedMail, { environment = 'development' } = {}) {
  return createServer({
    environment,
    models,
    fixtures: {
      accounts: accounts(encryptedEmail),
      menuItems,
      showcaseSections,
      detailSections,
      boldDetailSections,
      projects,
      projectDeliverables,
      skills,
      contactFormInputs,
      formInputs,
      errorMessages,
      contactFormModals,
      contactFormTooltips,
    },
    serializers,
    seeds(server) {
      server.loadFixtures();
      server.db.loadData({
        csrfTokens: [{ id: '1', token: generateCSRFToken() }],
      });
    },
    routes() {
      this.namespace = 'api';
      this.get('/accounts', (schema) => {
        return schema.all('account');
      });
      this.get('/menuItems', (schema) => {
        return schema.all('menuItem');
      });
      this.get('/showcaseSections', (schema) => {
        return schema.all('showcaseSection');
      });
      this.get('/projects', (schema) => {
        return schema.all('project');
      });
      this.get('/skills', (schema) => {
        return schema.all('skill');
      });
      this.get('/contactFormInputs', (schema) => {
        return schema.all('contactFormInput');
      });
      this.get('/contactFormModals', (schema) => {
        return schema.all('contactFormModal');
      });
      this.get('/csrf-token', (schema) => {
        return schema.db.csrfTokens[0];
      });
      this.post('/contactMessages', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const storedToken = schema.db.csrfTokens[0].token;
        const submittedToken = attrs.csrfToken;

        if (attrs.website) {
          console.log('Bot simulé détecté');
          return { data: { success: true }, status: 200 };
        }

        if (!attrs.name || !attrs.email || !attrs.message || !attrs.consent) {
          return { errors: ['Champs requis manquants'], status: 400 };
        }

        if (submittedToken !== storedToken) {
          return { errors: ['Token CSRF invalide'], status: 403 };
        }

        schema.db.csrfTokens.update({ id: '1' }, { token: generateCSRFToken() });

        return { data: { success: true }, status: 200 };
        // return schema.create('message', attrs);
      });
    },
  });
}
