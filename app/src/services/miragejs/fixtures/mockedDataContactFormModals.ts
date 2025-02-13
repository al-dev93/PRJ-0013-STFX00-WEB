export const contactFormModals = [
  {
    id: 'contact',
    urlFormContent: 'http://localhost:5173/api/contactFormInputs',
    urlApi: 'http://localhost:5173/api/contactMessages',
    submitButtonName: 'Envoyer',
    title: 'Prenez Contact !',
    subtitle: 'une demande, un projet...',
    alertOnSubmit: ['Votre message a été envoyé', 'Il sera traité dans les plus brefs délais'],
    contactFormInputIds: ['name', 'company', 'email', 'tel', 'message', 'consent'],
  },
];
