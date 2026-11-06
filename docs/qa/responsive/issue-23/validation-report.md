# Stack-Flex — Rapport de validation responsive

**Issue pilote :** [#23 — Validate the responsive version and fix regressions](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/issues/23)
**Campagne :** Lot 3 — Validation transversale
**Statut :** En cours — premier scénario validé à 320 px (`L3-RG-01`) ; campagne globale non terminée
**Démarrage :** 6 novembre 2026
**Branche documentaire :** `docs/23-responsive-qa-lot3`
**Version applicative testée (SHA complet) :** [2099697](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/commit/209969704bbad0c6819376e3c75fd8553cc2cd0d)

**Documents de référence :**

- [Matrice des critères](./acceptance-traceability.md) : identifiants, critères originaux et contrôles attendus.
- [Référentiel desktop](./desktop-regression-baseline.md) : protocole et limites des comparaisons historiques.
- [PR #43](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/pull/43) : correctifs et validations ciblées du lot 2.

> **Principe de traçabilité :** ce rapport conserve les **exécutions et leurs résultats** ; la matrice conserve les **critères et leurs états synthétiques**. Ne pas recopier les 146 critères ici. Les résultats des anciennes PR sont historiques et ne valent pas validation transversale actuelle.

## 1. Environnement et méthode

Cette section décrit les conditions techniques et méthodologiques de la campagne de validation responsive du lot 3 de l'issue #23.

La traçabilité repose sur trois niveaux complémentaires :

- **Environnement (`ENV`)** : configuration technique de référence comprenant le système, le navigateur, les technologies d'assistance et les paramètres habituels d'affichage.

- **Session (`L3-S`)** : période de tests réalisée sur une version identifiée du code applicatif, dans un environnement donné.

- **Configuration d'exécution (`CFG`)** : combinaison de paramètres particuliers, notamment les dimensions du viewport, le DPR et les préférences d'affichage.

Un environnement peut être réutilisé pour plusieurs sessions. Une session peut comporter plusieurs configurations d'exécution. Plusieurs tests peuvent partager une même configuration.

Les résultats sont consignés dans les sections thématiques du présent rapport, avec les identifiants des critères définis dans `acceptance-traceability.md`.

### 1.1. Référentiel des environnements

Ce référentiel décrit les caractéristiques relativement stables des environnements utilisés pendant la campagne.

Un nouvel environnement est enregistré lorsqu'une modification significative est susceptible d'affecter les résultats : changement de navigateur, de système, de configuration d'accessibilité ou de paramètres habituels d'affichage.

Les dimensions du viewport et le DPR ne constituent pas, à eux seuls, des environnements distincts.

#### ENV-01 — Poste de développement principal

| Paramètre                           | Valeur                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| Identifiant                         | `ENV-01`                                                                         |
| Système d'exploitation              | Fedora KDE Plasma — 6.7.5 (version déclarée, à préciser si nécessaire)           |
| Navigateur                          | Mozilla Firefox 159.0 — 64 bits                                                  |
| Lecteur d'écran                     | Orca 49.7                                                                        |
| Exécution du frontend               | Locale — React / TypeScript / Vite                                               |
| Backend                             | Supabase auto-hébergé sur une VM Hetzner                                         |
| Source des données                  | API applicative reliée à Supabase ; connexion effective à confirmer              |
| Zoom du navigateur                  | 100%                                                                             |
| Police racine calculée              | `16px`                                                                           |
| Thème applicatif                    | `light` (attribut `data-theme` de `<html>`)                                      |
| Préférence de couleur du navigateur | `dark`                                                                           |
| Réduction des animations            | Désactivée (`prefers-reduced-motion: reduce` = `false`)                          |
| Contraste forcé                     | Désactivé (`forced-colors: active` = `false`)                                    |
| Remarques                           | Environnement de référence pour les tests responsive et d'accessibilité du lot 3 |

La configuration matérielle et les versions logicielles doivent être actualisées lorsqu'elles changent. Une nouvelle ligne ou sous-section `ENV-02`, `ENV-03`, etc., sera créée uniquement si nécessaire.

**Important :** la source des données réellement utilisée doit être confirmée à partir de la configuration du frontend ou des requêtes réseau. L'existence du backend Hetzner ne suffit pas à démontrer que chaque test l'utilise.

### 1.2. Journal des sessions

Chaque session possède un identifiant unique et référence l'environnement technique utilisé.

Une nouvelle session est créée lorsqu'une campagne de tests reprend à une autre date ou lorsqu'une modification importante des conditions rend nécessaire une nouvelle exécution.

Le SHA enregistré correspond à la **version applicative réellement testée**. Un commit modifiant exclusivement la documentation QA ne nécessite pas, à lui seul, de modifier cette référence.

| Session  | Date / heure         | Environnement | SHA applicatif testé                       | Périmètre                             | État                        |
| -------- | -------------------- | ------------- | ------------------------------------------ | ------------------------------------- | --------------------------- |
| `L3-S01` | 06/11/2026<br> — 16h | `ENV-01`      | `209969704bbad0c6819376e3c75fd8553cc2cd0d` | Préparation ; R16-01 et R16-02 prévus | En  cours — `L3-RG-01` PASS |

#### Notes de la session L3-S01

- **Branche de travail documentaire :** `docs/23-responsive-qa-lot3`.

- **Origine du code applicatif :** `main` après fusion de la PR #43.

- **État Git initial :** `validation-report.md` présent et non encore suivi par Git (`??`).

- **Modifications applicatives non committées :** aucune signalée à ce stade ; à vérifier avant les tests.

- **Frontend :** exécution locale.

- **Backend :** Supabase auto-hébergé sur Hetzner ; connexion effective à confirmer.

- **Résultats :** `L3-RG-01` conforme à 320 px : R16-01 et R16-02 satisfaits pour cette largeur.

Les notes de session servent à documenter les circonstances particulières d'exécution, les changements de configuration et les difficultés rencontrées.

Elles ne remplacent pas les résultats détaillés des tests.

### 1.3. Configurations d'exécution

Les configurations d'exécution documentent les paramètres susceptibles de varier au sein d'une même session.

Chaque configuration reçoit un identifiant unique `CFG-XX`.

Les dimensions du viewport sont exprimées en pixels CSS. Le DPR correspond à la valeur retournée par `window.devicePixelRatio`.

| Configuration | Session  | Viewport (L × H) | DPR    | Zoom | Police racine | Particularités                                              |
| ------------- | -------- | ---------------- | ------ | ---- | ------------- | ----------------------------------------------------------- |
| `CFG-01`      | `L3-S01` | 2111 × 692 px    | 1.8182 | 100% | 16px          | Firefox desktop ; mesure initiale hors émulation responsive |
| `CFG-02`      | `L3-S01` | 320 x 800px      | 3      | 100% | 16px          | Firefox responsive Design Mode                              |

**Mesures complémentaires de CFG-01 :**

- Viewport de mise en page : `2111 × 692` px CSS.
- Viewport visuel : `2111.45 × 691.90` px CSS (valeurs arrondies).
- Les dimensions ont été relevées avant le réglage des largeurs nominales de la campagne responsive.
- Cette configuration constitue une mesure initiale et non un résultat de validation responsive.

Une configuration supplémentaire est créée lorsqu'un changement pertinent intervient : largeur ou hauteur du viewport, DPR, zoom, taille de police racine, thème, réduction des animations ou contraste forcé.

Il n'est pas nécessaire de dupliquer toutes les informations de l'environnement `ENV-01` dans chaque configuration.

Les tests peuvent référencer directement les identifiants `L3-S01` et `CFG-01`.

#### Conditions d'affichage complémentaires

Les paramètres ci-dessous ont été relevés pour la configuration `CFG-01`.

| Paramètre                    | Valeur                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| Thème effectivement appliqué | `light` (`document.documentElement.dataset.theme`)                                            |
| `prefers-color-scheme`       | `dark`                                                                                        |
| `prefers-reduced-motion`     | `no-preference` (`reduce` = `false`)                                                          |
| `forced-colors`              | `none` (`active` = `false`)                                                                   |
| Mode de test                 | Firefox desktop — hors émulation responsive lors du relevé                                    |
| Orientation du viewport      | Paysage (2111 × 692 px CSS)                                                                   |
| Clavier virtuel              | Non applicable à cette configuration desktop                                                  |
| Données applicatives         | Backend Supabase auto-hébergé sur Hetzner ; connexion effective et jeu de données à confirmer |

Les préférences d'affichage sont consignées lorsqu'elles diffèrent de la configuration de référence ou lorsqu'elles constituent l'objet du test.

### 1.4. Collecte des paramètres du navigateur

Les informations de viewport, de DPR, de police racine et de préférences d'affichage peuvent être récupérées dans la console de Firefox.

Sur la page Stack-Flex :

1. Ouvrir les outils de développement avec `F12`.

2. Sélectionner l'onglet **Console**.

3. Exécuter le script ci-dessous.

4. Reporter les valeurs pertinentes dans le référentiel ou la configuration d'exécution correspondante.

```JavaScript
({
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    documentWidth: document.documentElement.clientWidth,
    documentHeight: document.documentElement.clientHeight,
    visualWidth: window.visualViewport?.width ?? null,
    visualHeight: window.visualViewport?.height ?? null,
  },
  dpr: window.devicePixelRatio,
  rootFontSize: getComputedStyle(document.documentElement).fontSize,
  colorSchemePreference: matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light',
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  forcedColors: matchMedia('(forced-colors: active)').matches,
  htmlTheme: document.documentElement.getAttribute('data-theme'),
  bodyTheme: document.body.getAttribute('data-theme'),
});
```

**Précautions d'interprétation :**

- Le **zoom** est relevé dans le menu de Firefox. `Ctrl + 0` permet de revenir à 100 %.

- La **police racine** correspond à la taille calculée sur `document.documentElement`. Elle peut dépendre des styles du site et des réglages du navigateur.

- Le **DPR** ne doit pas être interprété comme une mesure directe du zoom.

- La préférence `prefers-color-scheme` n'indique pas nécessairement le thème effectivement appliqué par l'application.

- Les valeurs du **viewport visuel** peuvent différer de celles du viewport de mise en page, notamment sur mobile lorsque le clavier virtuel apparaît.

- Les valeurs doivent être relevées dans la configuration réellement utilisée pour le test.

### 1.5. Méthode d'exécution des tests

La campagne utilise la matrice `acceptance-traceability.md` comme référentiel des critères d'acceptation.

Pour chaque groupe de tests :

1. Identifier les critères concernés et leurs contrôles attendus.

2. Vérifier le SHA applicatif et la configuration d'exécution.

3. Réaliser les contrôles dans le navigateur, au clavier, au pointeur ou avec les technologies d'assistance selon les exigences.

4. Consigner les résultats dans la section thématique correspondante du présent rapport.

5. Associer les observations aux identifiants de critères, de session et de configuration.

6. Enregistrer les preuves pertinentes et les références aux anomalies découvertes.

7. Actualiser le statut synthétique des critères dans la matrice après validation.

Les tests peuvent couvrir plusieurs critères simultanément, à condition que les résultats soient explicitement traçables.

#### Statuts des résultats

| Statut           | Signification                                                                 |
| ---------------- | ----------------------------------------------------------------------------- |
| `PASS`           | Test exécuté ; résultat conforme aux attentes                                 |
| `FAIL`           | Test exécuté ; résultat non conforme                                          |
| `BLOCKED`        | Test impossible à exécuter ou à conclure en raison d'un obstacle identifié    |
| `NOT TESTED`     | Test non encore exécuté                                                       |
| `NOT APPLICABLE` | Test non applicable à la configuration considérée ; justification obligatoire |
| `WIP`            | Validation en cours                                                           |

Un contrôle non exécuté ne peut jamais être déclaré `PASS`.

Une anomalie constatée doit être documentée et soit corrigée, soit associée à une issue de suivi explicitement justifiée, conformément à QA-06.

#### Traçabilité des preuves

Selon la nature du contrôle, la preuve peut prendre la forme :

- d'une observation datée et reproductible ;

- d'une mesure issue des outils de développement ;

- d'une capture d'écran ou d'un enregistrement ;

- d'un résultat de navigation clavier ou de lecture avec Orca ;

- d'une inspection du DOM, des styles calculés ou des requêtes réseau ;

- d'une référence à une issue GitHub ou à une PR corrective.

Les preuves volumineuses peuvent être enregistrées dans un dossier dédié et référencées depuis le rapport, sans être reproduites dans la matrice.

### 1.6. Gestion des changements et reproductibilité

Lorsqu'une correction applicative est apportée pendant la campagne :

- conserver les résultats des tests déjà effectués avec leur SHA d'origine ;

- enregistrer le nouveau SHA applicatif dans une nouvelle session ou dans une exécution clairement identifiée ;

- rejouer les tests affectés par la correction et les contrôles de non-régression pertinents ;

- distinguer les résultats obtenus avant et après la correction.

Les modifications exclusivement documentaires n'imposent pas de nouvelle validation applicative.

Les références historiques déjà présentes dans `desktop-regression-baseline.md` demeurent distinctes de la version courante testée.

**Une validation du rendu actuel ne constitue pas automatiquement une comparaison historique conforme.** Lorsqu'une référence antérieure n'est pas reproductible, cette limite doit être explicitement consignée.

### 1.7. Articulation avec les autres documents

Les trois documents de l'issue #23 ont des responsabilités distinctes :

| Document                         | Responsabilité                                                            |
| -------------------------------- | ------------------------------------------------------------------------- |
| `acceptance-traceability.md`     | Référentiel des critères, contrôles attendus et statuts synthétiques      |
| `desktop-regression-baseline.md` | Références et méthode de comparaison du rendu desktop historique          |
| `validation-report.md`           | Environnements, sessions, résultats réels, preuves, anomalies et bilan QA |

Les résultats détaillés ne sont pas recopiés dans les descriptions des anciennes PR déjà fusionnées.

Les nouvelles PR correctives documentent les tests associés à leurs propres modifications et renvoient, lorsque nécessaire, au présent rapport.

Le bilan global de la campagne est publié dans l'issue #23 avant toute décision de clôture.

## 2. Responsive global — R16-01 / R16-02

**Objectif :** vérifier l'absence de débordement horizontal du document, de troncature et de chevauchement à chaque largeur nominale, sur tout le parcours de la page.

**Méthode :** dans Firefox, activer le mode adaptatif (`Ctrl + Maj + M`) ; fixer une largeur en pixels CSS, parcourir Hero, Présentation, Principales Réalisations, Autres Réalisations, footer et accès au formulaire. Contrôler visuellement les éléments, sans se fier uniquement à la mesure du document.

Pour relever le débordement global dans la console :

```js
({
  viewportWidth: document.documentElement.clientWidth,
  contentWidth: document.documentElement.scrollWidth,
  hasHorizontalOverflow:
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
});
```

| Test       | Largeur (CSS px) | Session  | R16-01 —Overflow global | R16-02 — Intégrité visuelle   | Verdict    | Preuve / remarque                                                               |
| ---------- | ---------------: | -------- | ----------------------- | ----------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `L3-RG-01` |              320 | `L3-S01` | `PASS` — 0 px<br>       | `PASS` — aucun défaut observé | `PASS`     | `CFG-02`;<br>scrollWidth=320, clientWidth=320 ;<br>inspection visuelle complète |
| `L3-RG-02` |              390 | —        | Non mesuré              | Non inspecté                  | NOT TESTED | —                                                                               |
| `L3-RG-03` |              768 | —        | Non mesuré              | Non inspecté                  | NOT TESTED | —                                                                               |
| `L3-RG-04` |             1024 | —        | Non mesuré              | Non inspecté                  | NOT TESTED | —                                                                               |
| `L3-RG-05` |             1280 | —        | Non mesuré              | Non inspecté                  | NOT TESTED | —                                                                               |
| `L3-RG-06` |             1440 | —        | Non mesuré              | Non inspecté                  | NOT TESTED | —                                                                               |

> Une mesure globale sans débordement n'exclut pas un contenu tronqué dans un conteneur à `overflow: hidden`, ni un recouvrement entre composants : vérifier les deux aspects séparément.

## 3. Transitions et limites de largeur — R16 / QA-04

Les seuils ci-dessous sont ceux identifiés dans la matrice. Vérifier les conditions effectives (`max-width` / `min-width`, taille racine) avant de conclure à un défaut de transition.

| Test       | Largeurs (CSS px)           | Zone / comportement                            | Session | Verdict    | Preuve / remarque |
| ---------- | --------------------------- | ---------------------------------------------- | ------- | ---------- | ----------------- |
| `L3-BP-01` | 511 / 512 / 513             | Navigation sociale mobile / desktop            | —       | NOT TESTED | —                 |
| `L3-BP-02` | 623 / 624 / 625             | Principales Réalisations : galerie / diaporama | —       | NOT TESTED | —                 |
| `L3-BP-03` | 767 / 768 / 769             | Footer et disposition / navigation             | —       | NOT TESTED | —                 |
| `L3-BP-04` | 991 / 992 / 993             | Transitions des grilles desktop                | —       | NOT TESTED | —                 |
| `L3-BP-05` | 219–221 ; 299–301 ; 303–305 | Présentation : robustesse sous 320 px (#37)    | —       | NOT TESTED | —                 |
| `L3-BP-06` | 319–321 ; 351–353 ; 415–417 | Présentation : transitions des cartes (#37)    | —       | NOT TESTED | —                 |

**Limite :** les essais sous 320 px concernent uniquement la robustesse défensive prévue par #37 ; ils ne changent pas la largeur minimale officiellement prise en charge.

## 4. Validation des sections et critères locaux

Compléter les lignes lors des sessions dédiées. Les identifiants détaillés sont dans la matrice ; cette table suit uniquement l'avancement par domaine, sans prétendre qu'une issue d'implémentation clôturée vaut une revalidation.

| Issue | Critères matriciels | Domaine                                       | Session(s) | État de la revalidation | Référence des résultats |
| ----- | ------------------- | --------------------------------------------- | ---------- | ----------------------- | ----------------------- |
| #16   | `R16-*`             | Exigences globales                            | `L3-S01`   | `WIP`                   | §2, §3, §5–7            |
| #17   | `FND-*`             | Fondations responsive / gouttières            | —          | NOT TESTED              | —                       |
| #18   | `HDR-*`             | En-tête, transparence et navigation           | —          | NOT TESTED              | —                       |
| #19   | `SOC-*`             | Navigation sociale, footer et point d'ancrage | —          | NOT TESTED              | —                       |
| #20   | `HRO-*`             | Hero                                          | —          | NOT TESTED              | —                       |
| #21   | `SEC-*`             | Intégration des sections validées             | —          | NOT TESTED              | —                       |
| #22   | `FRM-*`             | Modale et formulaire de contact               | —          | NOT TESTED              | —                       |
| #24   | `PRS-*`             | Présentation                                  | —          | NOT TESTED              | —                       |
| #25   | `FPR-*`             | Principales Réalisations                      | —          | NOT TESTED              | —                       |
| #26   | `OPR-*`             | Autres Réalisations                           | —          | NOT TESTED              | —                       |
| #31   | `FTR-*`             | Footer                                        | —          | NOT TESTED              | —                       |
| #37   | `POV-*`             | Débordements / robustesse étroite             | —          | NOT TESTED              | §3                      |
| #23   | `QA-*`              | Bilan transversal                             | —          | En cours                | §2–9                    |

### 4.1. Résultats détaillés par session

Ajouter un tableau par série de tests sans dupliquer les textes originaux des critères.

| Test | Session | Critère(s) | Scénario exécuté / conditions          | Verdict    | Preuve / anomalie |
| ---- | ------- | ---------- | -------------------------------------- | ---------- | ----------------- |
| —    | —       | —          | Aucun test de cette section enregistré | NOT TESTED | —                 |

## 5. Accessibilité et interactions

| Test         | Scénario                                                                                | Session | Verdict    | Preuve / remarque               |
| ------------ | --------------------------------------------------------------------------------------- | ------- | ---------- | ------------------------------- |
| `L3-A11Y-01` | Parcours clavier Hero → contact → footer ; ordre de tabulation et focus visible         | —       | NOT TESTED | —                               |
| `L3-A11Y-02` | Orca : titres, régions, noms accessibles, ressources et formulaire                      | —       | NOT TESTED | —                               |
| `L3-A11Y-03` | Ouverture/fermeture du dialogue ; focus initial, confinement et restitution             | —       | NOT TESTED | —                               |
| `L3-A11Y-04` | Validation du formulaire ; annonces d'erreur, consentement, soumission                  | —       | NOT TESTED | —                               |
| `L3-A11Y-05` | Hauteur contrainte et clavier virtuel mobile : champs, erreurs et actions atteignables  | —       | NOT TESTED | —                               |
| `L3-A11Y-06` | `prefers-reduced-motion`, contrastes pertinents et visibilité du focus                  | —       | NOT TESTED | —                               |
| `L3-A11Y-07` | Retour depuis les ressources externes, clavier et pointeur (revalidation si nécessaire) | —       | NOT TESTED | Validation initiale dans PR #43 |

## 6. Non-régression desktop — QA-02 / DESK-01 à DESK-03

Se reporter au [protocole desktop](./desktop-regression-baseline.md), notamment au tableau des preuves à remplir pour 1024, 1280 et 1440 px CSS.

| Référence | Section                  | État        | Justification / preuve                                                |
| --------- | ------------------------ | ----------- | --------------------------------------------------------------------- |
| `DESK-01` | Présentation             | NON VÉRIFIÉ | Référence historique visuelle absente ; captures actuelles à produire |
| `DESK-02` | Principales Réalisations | NON VÉRIFIÉ | Référence historique visuelle absente ; captures actuelles à produire |
| `DESK-03` | Autres Réalisations      | NON VÉRIFIÉ | Référence historique visuelle absente ; captures actuelles à produire |

Les SHA historiques identifiés dans le référentiel sont des candidats techniques, **pas** des captures du rendu approuvé. Ne pas déclarer `PASS` pour une comparaison historique faute de BASE réellement comparable. Distinguer clairement « fonctionnement actuel conforme » et « identité visuelle historique démontrée ».

## 7. Confidentialité du formulaire — QA-09

**Issue de suivi fonctionnel :** [#41](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/issues/41).

| Test         | Contrôle                                                                                            | Session | Verdict    | Observations / référence |
| ------------ | --------------------------------------------------------------------------------------------------- | ------- | ---------- | ------------------------ |
| `L3-PRIV-01` | Examiner la notice et la distinction entre traitement nécessaire et consentements facultatifs       | —       | NOT TESTED | —                        |
| `L3-PRIV-02` | Vérifier la possibilité de soumettre une demande légitime sans consentement facultatif sans rapport | —       | NOT TESTED | —                        |
| `L3-PRIV-03` | Documenter tout écart et le suivre dans #41 sans étendre le correctif au lot 3                      | —       | NOT TESTED | —                        |

## 8. Registre des anomalies et décisions

| ID  | Détectée (session/test) | Description / reproduction                  | Gravité | Issue / PR corrective | Statut / justification |
| --- | ----------------------- | ------------------------------------------- | ------- | --------------------- | ---------------------- |
| —   | —                       | Aucune anomalie du lot 3 encore enregistrée | —       | —                     | —                      |

Les corrections des anciens lots restent traçables dans leurs PR. Les nouveaux défauts sont corrigés dans des PR ciblées ou font l'objet d'une issue avec justification explicite du report (QA-06).

## 9. Bilan de couverture et décision de sortie

| Point                                                               | État initial |
| ------------------------------------------------------------------- | ------------ |
| 146 critères de la matrice revalidés ou explicitement qualifiés     | NON          |
| Tests du parcours complet sur les six largeurs nominales            | NON          |
| Contrôles aux seuils et conditions particulières                    | NON          |
| Contrôles clavier, Orca, formulaire et contraintes de hauteur       | NON          |
| Comparaisons desktop historiques démontrées ou réserves formalisées | NON          |
| Revue de consentement QA-09 / suivi #41                             | NON          |
| Anomalies corrigées ou reportées avec justification                 | NON          |

**Décision :** lot 3 non terminé. Aucun résultat n'est présumé conforme avant exécution. La clôture de #23 sera examinée après les lots 3 et 4 et après traitement explicite des réserves.
