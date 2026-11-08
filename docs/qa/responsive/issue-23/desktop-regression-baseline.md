# Stack-Flex — Issue #23 / Lot 1

## Référentiel de non-régression desktop — v3 (FR)

**Livrable :** 2/2 · **Date :** 3 novembre 2026 · **Statut :** **référentiel technique documenté — lot 1 terminé / comparaison visuelle non réalisée**.
**Sources :** GitHub issues #16/#21/#23/#24/#25/#26/#31/#37, PR #33/#34/#35, commits de fusion et premiers parents vérifiés ; analyse statique de l’archive `PRJ-0013-STFX00-WEB-main(8).zip`.

> **Important :** « référentiel documenté » ne signifie pas « absence de régression démontrée ». Les trois états historiques sont retrouvés comme commits Git, mais aucune comparaison d’images réalisée dans des conditions comparables ne permet d’affirmer que le design desktop est inchangé. L’ancienne application n’a pas été reproduite avec succès. Le volet historique du critère `QA‑02` de #23 est toujours **en attente de preuve**.

## 1. Tableau des références historiques vérifiées

| Référence | Section                    | PR                                                             | SHA historique avant PR (= premier parent de fusion)                                                                                          | SHA après intégration (= fusion)                                                                                                              |
| --------- | -------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `DESK‑01` | Présentation de Stack-Flex | [#33](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/pull/33) | [`7221a285e87e356da417f824409b1600fdac6670`](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/commit/7221a285e87e356da417f824409b1600fdac6670) | [`db7d2eea61f9c0dd0f48a97a0046707ee5b263fe`](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/commit/db7d2eea61f9c0dd0f48a97a0046707ee5b263fe) |
| `DESK‑02` | Principales Réalisations   | [#34](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/pull/34) | [`db7d2eea61f9c0dd0f48a97a0046707ee5b263fe`](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/commit/db7d2eea61f9c0dd0f48a97a0046707ee5b263fe) | [`53ddc3c19b9838eb5ad3df24f1407785c0bfebf3`](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/commit/53ddc3c19b9838eb5ad3df24f1407785c0bfebf3) |
| `DESK‑03` | Autres Réalisations        | [#35](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/pull/35) | [`53ddc3c19b9838eb5ad3df24f1407785c0bfebf3`](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/commit/53ddc3c19b9838eb5ad3df24f1407785c0bfebf3) | [`dbbec5b7a07613b623c221da9350ffc010c41130`](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/commit/dbbec5b7a07613b623c221da9350ffc010c41130) |

Les SHA « avant PR » sont **des instantanés techniques de `main`** antérieurs aux changements visés, pas des captures photographiques ou des signatures d’approbation du rendu. Le site peut avoir évolué sur d’autres sections entre ces états et `main` actuel. Pour conclure sur chaque section, la comparaison doit porter sur le **même contenu et le même état d’UI**.

**État courant vérifié le 3 novembre 2026 :** `main` pointe sur `e77ba4728105fbae3d443c01b046c78c52bf4be2` (fusion #40). Relever le SHA réellement testé lors des lots suivants, car ce pointeur peut évoluer.

## 2. Tentative historique et limite constatée

- Un worktree a été créé à `7221a285` et `npm ci` a installé les dépendances de l'époque (25 alertes de sécurité signalées ; sans correction automatique afin de préserver les versions historiques).
- Le lancement local de Vite sur `127.0.0.1:5174` a abouti à une erreur `ResponseError`, HTTP `400`, sur un `GET` du composant `CollapsibleHeader`. Le diagnostic exact n’a pas été établi ; une incompatibilité de configuration/API est **une hypothèse, pas un fait confirmé**.
- Le worktree historique a ensuite été supprimé, sans modification de la branche `main`.
- Il n’existe, dans les données examinées, aucune capture **avant responsive** exploitable et comparable pour les trois sections.

**Conséquence :** aucune comparaison historique des pixels, proportions, espacements, textes ou interactions n'a été exécutée. L’analyse des diffs CSS/React peut identifier les changements mais **ne remplace pas une vérification visuelle** exigée par [#16](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/issues/16) et [#23](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/issues/23).

## 3. Exigences normatives

Le présent document définit comment établir et vérifier l'absence de régression **desktop** des trois sections de contenu qui étaient déjà validées avant la campagne responsive. Il permet de relever les résultats sans confondre **implémentation présente**, **référence historique** et **preuve d'acceptation**.

### Critères GitHub applicables

| Référence              | Exigence, reprise de l'issue #16                                                                                                            | Preuve à obtenir                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **`R16‑04`**           | `The "Présentation de Stack-Flex", "Principales Réalisations" and "Autres Réalisations" sections retain their validated desktop rendering.` | Pour chacune des trois sections, comparaison à sa référence desktop historique, à conditions d'affichage et de données égales. |
| **`R16‑14`**           | `No regression is observed at 1280 and 1440 px.`                                                                                            | Vérifications globales desktop à 1280 et 1440 px, y compris l'intégration des composants.                                      |
| **`R16‑01`**           | `No horizontal scrolling occurs at 320, 390, 768, 1024, 1280 and 1440 px.`                                                                  | Absence de débordement horizontal aux largeurs desktop 1024, 1280 et 1440 px.                                                  |
| **`R16‑02`**           | `No text, button, card or control is clipped or overlapped.`                                                                                | Contrôle de l'intégrité des contenus et des commandes aux mêmes largeurs.                                                      |
| **`R16‑12`**           | `Focus states remain visible.`                                                                                                              | Vérification au clavier des contrôles interactifs de ces sections.                                                             |
| **`QA‑02` / `FTR‑09`** | Critères de #23 et #31 imposant de conserver le rendu desktop des trois sections.                                                           | Même campagne de captures et mêmes preuves : ne pas dupliquer les tests.                                                       |

Les autres critères de #16 sont intégrés à la **matrice de traçabilité globale** (document distinct) et seront validés dans la QA transverse de l'issue #23 ; ils ne doivent pas être artificiellement assimilés à une comparaison d'images desktop.

**Largeurs :** 1280 et 1440 CSS px sont **obligatoires**. Le contrôle à 1024 CSS px est complémentaire (à la fois taille prescrite par #16 et proximité avec plusieurs transitions). Si une capture de référence historique existe à une largeur différente, la reproduire **à l'identique**, en plus de ces largeurs.

---

## 4. Registre des trois sections de référence

### DESK‑01 — Présentation de Stack-Flex

| Champ                                 | Référence de travail                                                                                                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Issues                                | #24 (implémentation responsive), #37 (correctif ciblé), #16 et #23 (validation).                                                                                                                                                     |
| Ancrage de code courant               | `src/components/ShowcaseSection/style.module.css`, sélecteur `.section[data-variant='about']` ; blocs internes dans `src/components/PresentationBlock/`.                                                                             |
| Composition actuelle observée         | Grille à **deux colonnes** (principale + secondaire) au-dessus de **992 CSS px** si `1rem = 16px` ; retour sur une colonne à `max-width: 62rem`.                                                                                     |
| Points de comparaison visuelle        | Position de l'introduction et du titre, proportions des deux colonnes, ordre des blocs, cartes de compétences et du « Socle technique », espacements, bordures, couleurs, soulignements, alignements et lisibilité des titres longs. |
| Points de non-régression particuliers | Aucun bloc tronqué/chevauché ; absence de débordement ; cohérence des colonnes à 1024/1280/1440 px. Le correctif #37 ne doit pas modifier involontairement les dispositions desktop.                                                 |
| Référence historique                  | **SHA identifié (`DESK‑01`)** ; capture approuvée non disponible ; reproduction bloquée par HTTP 400.                                                                                                                                |
| État                                  | **À comparer** ; la présence des règles CSS ne prouve pas l'identité visuelle historique.                                                                                                                                            |

### DESK‑02 — Principales Réalisations

| Champ                                 | Référence de travail                                                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issues                                | #25, #16 et #23.                                                                                                                                                                    |
| Ancrage de code courant               | `src/modules/Slideshow/index.tsx`, `src/modules/Slideshow/utils/constants.ts`, composants `SlideshowCarousel` et `FeaturedProjectsGallery`.                                         |
| Composition actuelle observée         | Le code sélectionne la **galerie horizontale** pour `max-width: 39rem` (624 CSS px si `1rem = 16px`), et le **diaporama (`SlideshowCarousel`)** au-dessus de cette limite.          |
| Points de comparaison visuelle        | Présentation des images, ratio/cadrage, légendes, tags, textes, espacements, contrôles précédent/suivant, pagination, transitions et proportions de la zone de diaporama.           |
| Points de non-régression particuliers | Le diaporama desktop doit rester présent et utilisable ; ne pas substituer la galerie mobile à la version desktop ; aucune détérioration des commandes ni des indicateurs de focus. |
| Référence historique                  | **SHA identifié (`DESK‑02`)** ; capture et état interactif historiques non disponibles.                                                                                             |
| État                                  | **À comparer** ; reproduire le même index de slide et les mêmes données.                                                                                                            |

**Note :** les défauts connus de tags dans la **galerie horizontale** relèvent de `QA‑07` / lot 2. Ils ne prouvent pas à eux seuls une régression du **diaporama desktop**.

### DESK‑03 — Autres Réalisations

| Champ                                 | Référence de travail                                                                                                                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issues                                | #26, #16 et #23.                                                                                                                                                                               |
| Ancrage de code courant               | `src/components/ShowcaseSection/style.module.css` (`.section[data-variant='more'] .more__cardsWrapper`) ; composants `Card` et `ProjectSheetLink`.                                             |
| Composition actuelle observée         | Grille à **trois colonnes** à partir de `min-width: 62rem` (992 CSS px si `1rem = 16px`) ; deux colonnes dès `min-width: 39rem` ; une colonne sous ce seuil.                                   |
| Points de comparaison visuelle        | Nombre de colonnes, largeur et hauteur des cartes, distribution des contenus, éléments graphiques, liens vers les ressources, titres, tags, intervalles, alignements et états de survol/focus. |
| Points de non-régression particuliers | Maintien de la grille desktop en trois colonnes ; aucune carte tronquée/chevauchée et aucun débordement horizontal à 1024/1280/1440 px.                                                        |
| Référence historique                  | **SHA identifié (`DESK‑03`)** ; capture de la grille auparavant validée non disponible.                                                                                                        |
| État                                  | **À comparer** ; la correction de restitution du focus sur retour de ressource est couverte séparément par `QA‑08` / lot 2.                                                                    |

---

## 5. Conditions de comparaison reproductibles

Avant toute capture, renseigner **deux environnements** : `BASE` (version historique approuvée) et `CURRENT` (code de référence après #22, puis lot 2 si applicable).

| Paramètre                  | Valeur / consigne                                                                                       | Pourquoi                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Version BASE               | SHA Git, tag, archive historique ou URL de capture **vérifiables**.                                     | Fixe le point de comparaison.                          |
| Version CURRENT            | SHA du commit `main` effectivement testé (ou identification explicite de l'archive).                    | Évite de comparer deux états inconnus.                 |
| Navigateur                 | Même navigateur + version, ou documenter toute différence.                                              | Évite d'attribuer une variation de rendu au code.      |
| Largeurs                   | **1280, 1440 CSS px** minimum ; **1024 CSS px** complémentaire.                                         | Respecte #16 et #23.                                   |
| Hauteur                    | Identique entre BASE et CURRENT pour chaque comparaison (par ex. 900 CSS px si disponible).             | Évite des différences de composition et de défilement. |
| Zoom / taille de police    | 100 % et valeur root identique ; noter tout écart.                                                      | Les seuils en `rem` varient avec la police racine.     |
| Densité pixel              | Même `deviceScaleFactor`/DPR si automatisation ; sinon noter le système.                                | Assure une capture comparable.                         |
| Thème / préférence système | Même thème, contraste forcé et réglage de mouvement.                                                    | Affecte couleurs, animations et tokens.                |
| Données affichées          | Réponse de l'API/fixture identique (titres, projets, images, ordre, tags).                              | Le site charge le contenu dynamiquement.               |
| État UI                    | Même scroll, même index du diaporama, même état hover/focus, mêmes images chargées.                     | Compare le même état fonctionnel.                      |
| Chargement                 | Attendre la police, les images et le contenu ; désactiver les variations non déterministes si possible. | Évite les faux écarts.                                 |

**Source de données à figer :** `src/routes/Index/index.tsx` charge ses sections via `VITE_API_SHOWCASES_DATA_ENDPOINT` et le diaporama peut récupérer ses projets via un autre endpoint. Si les données de production ont évolué, utiliser une fixture autorisée et reproductible plutôt que des captures faites avec deux jeux de données différents.

**Aucune référence historique ne doit être remplacée par une simple capture actuelle.** Si BASE est introuvable, consigner `NON VÉRIFIABLE — référence historique absente`, avec la justification et la source recherchée ; ne jamais cocher « conforme » à partir du seul code courant.

---

## 6. Protocole de comparaison (lot 3 — à exécuter)

1. **Reconstituer BASE** : identifier pour chaque section une capture ancienne approuvée, un commit/une branche permettant de reproduire son rendu, ou une archive datée. Référencer précisément sa provenance.
2. **Stabiliser le contenu** : contrôler les réponses API/fixtures et relever navigateur, viewport, hauteur, DPR, zoom, thème et état UI.
3. **Capturer** BASE et CURRENT pour chacun des trois domaines à **1280** et **1440** CSS px ; ajouter **1024** CSS px pour la QA globale et autant de tailles que nécessaire pour reproduire une référence existante.
4. **Comparer** : vue côte à côte, puis superposition/diff visuel si les captures sont strictement comparables ; distinguer les écarts de données, de navigateur, d'animation et de CSS.
5. **Inspecter** : titres, texte, colonnes, cartes, contrôle du carrousel, `overflow-x`, sous-sections, états de focus, effets hover et absence de superposition.
6. **Enregistrer le verdict** par section/largeur dans le registre ci-dessous, avec un lien vers la capture BASE, la capture CURRENT et, le cas échéant, une anomalie GitHub.
7. **Rejouer les vérifications ciblées** après toute correction des lots 2–4 susceptible d'affecter les trois sections ou leurs styles partagés.

L'interaction à la souris ou au clavier et l'absence de scroll horizontal demandent un **test navigateur** ; la comparaison de captures seule ne suffit pas à démontrer les critères correspondants.

### Tableau de preuves à remplir

| ID        | Largeur (px CSS) | Capture BASE | Capture CURRENT | Différence / commentaire | Verdict   |
| --------- | ---------------: | ------------ | --------------- | ------------------------ | --------- |
| `DESK‑01` |             1024 | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑01` |         **1280** | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑01` |         **1440** | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑02` |             1024 | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑02` |         **1280** | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑02` |         **1440** | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑03` |             1024 | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑03` |         **1280** | À fournir    | À produire      | À analyser               | Non testé |
| `DESK‑03` |         **1440** | À fournir    | À produire      | À analyser               | Non testé |

**Verdicts admis :** `Conforme`, `Régression confirmée`, `Non comparable` (conditions différentes), `Non vérifiable` (BASE absent), `Non testé`. Chaque régression doit être corrigée ou associée à une issue dédiée avec justification, conformément à #23.

---

## 7. Autres contraintes desktop de la campagne #16

Ces vérifications sont à coordonner avec le lot 3 plutôt qu'à remplacer par des captures :

- **1280 et 1440 px** : absence de défilement horizontal, clipping et chevauchements, navigation fonctionnelle, focus visible et absence de régression globale (`R16‑01`, `R16‑02`, `R16‑12`, `R16‑14`).
- **1024 px** : vérification des transitions de grille et des commandes, notamment autour de `62rem` et des adaptations visuelles du diaporama.
- **Footer / navigation sociale** : `Footer` et `SocialMediaNavBar` sont **indépendants**. Sur mobile, la barre sociale horizontale reste au-dessus du footer lorsqu'il devient visible, avec un contrôle de saut vers ce dernier. Le footer conserve les liens secondaires, **pas** les liens sociaux (issues #19, #31 et #23). Ce comportement mobile ne doit pas être imposé comme référence desktop.
- **Issue #37** : les contrôles défensifs sous 320 px et les changements de disposition à 352/416 px concernent les petites largeurs, pas une modification voulue du référentiel desktop.

---

## 8. Registre de preuve et décision de sortie du lot 1

| Référence | Candidat Git « avant »     | Capture historique approuvée | Exécution ancienne version   | Capture actuelle comparable | Verdict visuel                |
| --------- | -------------------------- | ---------------------------- | ---------------------------- | --------------------------- | ----------------------------- |
| `DESK‑01` | Identifié (SHA complet §1) | Absente                      | Tentative échouée (HTTP 400) | Non réalisée                | **Non vérifiable à ce stade** |
| `DESK‑02` | Identifié (SHA complet §1) | Absente                      | Non tentée                   | Non réalisée                | **Non vérifiable à ce stade** |
| `DESK‑03` | Identifié (SHA complet §1) | Absente                      | Non tentée                   | Non réalisée                | **Non vérifiable à ce stade** |

**Dossier de preuves attendu au lot 3 :** captures actuelles 1280/1440 px (1024 complémentaire), rapport de contrôle CSS et d’interactions, comparaison des PR/diffs avec les premiers parents, éventuelles captures historiques retrouvées, justification explicite des écarts et de toute limite de preuve. Les références historiques pourront être reproduites **uniquement si cela reste proportionné** et si l’accès aux données peut être stabilisé sans travail imprévu majeur.

**Décision : LOT 1 TERMINÉ (préparation et identification des limites).** La comparaison desktop est **réservée au lot 3**. On ne peut pas cocher les critères `R16‑04`, `R16‑14`, `QA‑02` ni les critères locaux correspondants comme conformes sur la base de ces deux livrables.

**Ce référentiel est versionné dans le dépôt avec la matrice de traçabilité, dans le cadre de la PR #42**. Il sera actualisé au fil des validations de l'issue #23.
