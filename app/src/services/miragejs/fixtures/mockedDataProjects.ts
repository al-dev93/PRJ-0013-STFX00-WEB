import fishEye from '@images/photos/FishEye.png';
import kasa from '@images/photos/kasa.png';
import lesPetitsPlats from '@images/photos/les_petits_plats.png';
import sportSee from '@images/photos/sport_see.png';

export const projects = [
  {
    id: 'P6FEYE-al-2207',
    title: 'FishEye',
    description:
      'Site web pour photographes freelances, il a été conçu en respectant les critères d’accessibilité conforment aux  WCAG. La page du photographe est générée dynamiquement grâce à JavaScript, en fonction du photographe sélectionné sur la page d’accueil. Les travaux du photographe sont affichés dans une galerie de miniatures, et peuvent être visualisés individuellement (photographie ou vidéo) dans une lightbox contenant un slider. Un système de like permet d’évaluer le cliché.',
    tags: ['HTML', 'accessibilité', 'JavaScript', 'CSS', 'GitHub'],
    picture: fishEye,
    display: 'slideshow',
    projectDeliverableIds: ['1', '2'],
  },
  {
    id: 'p7LPPA-al-2208',
    title: 'les petits plats',
    description:
      'Ce site de recettes de cuisine, devait disposer d’un algorithme de recherche performant. Un champ texte et un système de tags sont utilisés pour réaliser la recherche, les deux pouvant se combiner. Deux algorithmes différents ont été créés et comparés grâce à jsben.ch. L’affichage des fiches recettes et des listes de tags est instantanément mis à jour en fonction du critère de recherche. Le design a été réalisé avec Bootstrap et sa conception responsive assure une utilisation sur smartphone et tablette sans perte de qualité.',
    tags: ['HTML', 'JavaScript', 'CSS', 'Bootstrap', 'Responsive design', 'GitHub'],
    picture: lesPetitsPlats,
    display: 'slideshow',
    projectDeliverableIds: ['3', '4', '5'],
  },
  {
    id: 'p12ssee-al-2301',
    title: 'SportSee',
    description:
      'SportSee propose un tableau de bord graphique d’analyse de performance à des utilisateurs recourant au coaching sportif. Les données extraites du back-End via une API, sont restituées sous-formes de graphiques en utilisant React et la bibliothèque Recharts. La page utilisateur se compose de 4 graphiques,  2 d’entre eux retracent un historique et disposent de tooltips animés. 4 cartes de données clés viennent complètent les graphiques. Pour faciliter l’appropration du code, celui-ci est entièrement documenté.',
    tags: ['React', 'Recharts', 'API REST', 'Modules CSS', 'GitHub', 'JSDoc'],
    picture: sportSee,
    display: 'slideshow',
    projectDeliverableIds: ['6', '7'],
  },
  {
    id: 'p11kasa-al-2212',
    title: 'Kasa',
    description:
      'L’application web Kasa s’adresse aux particuliers désireux de louer leurs appartements. Développée avec React, elle propose des composants évolués tels que des cartes pour afficher un apperçu des locations, des collapses pour dérouler ou masquer des informations, un slider pour faire défiler les photos des appartements. Elle dispose d’une page d’accueil, d’une page appartement dont le contenu est créé dynamiquement, d’une page à propos et d’une page d’erreur. La navigation est confiée à React Router.',
    tags: ['React', 'React Router', 'modules CSS', 'Responsive design', 'GitHub'],
    picture: kasa,
    display: 'slideshow',
    projectDeliverableIds: ['8', '9'],
  },
  {
    id: 'P3OHMY-al-2205',
    title: 'ohmyfood',
    description: 'Site de réservation caractérisé par des animations réalisées avec CSS',
    tags: ['HTML', 'Animations CSS', 'Sass', 'Responsive design', 'GitHub'],
    picture: '',
    display: 'card',
    projectDeliverableIds: ['10', '11'],
  },
  {
    id: 'P4GAME-al-2206',
    title: 'GameOn',
    description: 'Validation de formulaire',
    tags: ['HTML', 'JavaScript', 'CSS', 'GitHub'],
    picture: '',
    display: 'card',
    projectDeliverableIds: ['12', '13'],
  },
  {
    id: 'P9BILD-al-2211',
    title: 'Billed',
    description: "Débogage et tests d'une application RH",
    tags: ['JavaScript', 'Jest', 'Testing Library', 'GitHub'],
    picture: '',
    display: 'card',
    projectDeliverableIds: ['14'],
  },
  {
    id: 'p13agba-al-2302',
    title: 'ARGENT BANK',
    description: ' ',
    tags: ['React', 'React Router', 'Redux', 'API Rest', 'Modules CSS', 'GitHub'],
    picture: '',
    display: 'card',
    projectDeliverableIds: ['15', '16'],
  },
  {
    id: 'p14hnet-al-2303',
    title: 'HRnet',
    description:
      "Plugin React pour créer une table de données intégrant des fonctions de tri multicritères, de filtrage, de pagination et d'affichage d'informations.",
    tags: ['React', 'plugin npm', 'Modules CSS', 'GitHub'],
    picture: '',
    display: 'card',
    projectDeliverableIds: ['17', '18', '19'],
  },
  {
    id: 'sasu-al-2307',
    title: 'Sasu',
    description: "Site vitrine de Sasu. Un lien propose l'accès à la maquette Figma.",
    tags: ['React', 'TypeScript', 'Node.js', 'Modules CSS', 'Figma', 'GitHub'],
    picture: '',
    display: 'card',
    projectDeliverableIds: ['20', '21'],
  },
];
