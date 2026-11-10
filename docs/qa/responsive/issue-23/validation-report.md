# Stack-Flex — Rapport de validation responsive

**Issue pilote :** [#23 — Validate the responsive version and fix regressions](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/issues/23)
**Campagne :** Lot 3 — Validation transversale
**Statut :** En cours — 6/6 scénarios aux largeurs nominales validés (`L3‑RG‑01`, `L3‑RG‑02`, 
`L3‑RG‑03`, `L3‑RG‑04`, `L3‑RG‑05` et `L3‑RG‑06`) ; campagne globale non terminée
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

#### ENV‑01 — Poste de développement principal

| Paramètre                           | Valeur                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| Identifiant                         | `ENV‑01`                                                                         |
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

La configuration matérielle et les versions logicielles doivent être actualisées lorsqu'elles changent. Une nouvelle ligne ou sous-section `ENV‑02`, `ENV‑03`, etc., sera créée uniquement si nécessaire.

**Important :** la source des données réellement utilisée doit être confirmée à partir de la configuration du frontend ou des requêtes réseau. L'existence du backend Hetzner ne suffit pas à démontrer que chaque test l'utilise.

### 1.2. Journal des sessions

Chaque session possède un identifiant unique et référence l'environnement technique utilisé.

Une nouvelle session est créée lorsqu'une campagne de tests reprend à une autre date ou lorsqu'une modification importante des conditions rend nécessaire une nouvelle exécution.

Le SHA enregistré correspond à la **version applicative réellement testée**. Un commit modifiant exclusivement la documentation QA ne nécessite pas, à lui seul, de modifier cette référence.

| Session  | Date / heure                                   | Environ-nement | SHA applicatif testé                           | Périmètre                                                                                                                                             | État                                                                                                                                                     |
| -------- | ---------------------------------------------- | -------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `L3‑S01` | 06/11/2026<br> — 16h                           | `ENV‑01`       | `209969704bbad0c6819376e3c75fd8553cc2cd0d`     | `R16‑01`<br>et `R16‑02` <br>à 320px                                                                                                                   | `L3‑RG‑01` — `PASS`                                                                                                                                      |
| `L3‑S02` | 06/11/2026 — 23h → 07/11/2026 — 2h             | `ENV‑01`       | `209969704bbad0c6819376e3c75fd8553cc2cd0d`     | `R16‑01` <br>et `R16‑02` <br>à 390, 768, 1024,1280, 1440 px                                                                                           | `L3‑RG‑02`, `L3‑RG‑03`, `L3‑RG‑04`, `L3‑RG‑05`, `L3‑RG‑06`  — `PASS`                                                                                     |
| `L3‑S03` | 08/11/2026<br>— 22h30 → 09/11/2026 — 2h        | `ENV‑01`<br>   | `209969704bbad0c6819376e3c75fd8553cc2cd0d`<br> | `L3‑BP‑01`<br>à 511, 512, 513 px<br>et<br>`L3‑BP‑02`<br>à 623, 624, 625 px                                                                            | `L3‑BP‑01` — `PASS`<br>`L3‑BP‑02` — `PASS` avec réserve visuelle (`L3‑DEF‑01`)                                                                           |
| `L3‑S04` | 09/11/2026 — 9h  → 14h15                       | `ENV‑01`       | `209969704bbad0c6819376e3c75fd8553cc2cd0d`     | `L3‑BP‑03`<br>à 767, 768, 769 px<br>et<br>`L3‑BP‑04`<br>à 991, 992, 993 px<br>et <br>`L3‑BP‑05`<br> à 219, 220, 221,299, 300, 301, 303, 304 et 305 px | `L3‑BP‑03` — `PASS`<br>`L3‑BP‑04` — `PASS`<br>`L3‑BP‑05` — `FAIL`<br>◦`L3‑DEF‑02`<br>219, 220, 221 px<br>◦`L3‑DEF‑03`<br>221 px<br>◦`L3‑DEF‑04`<br>304px |
| `L3‑S05` | 09/11/2026 — 22h40  →<br>10/11/2026<br>— 22h40 | `ENV‑01`       | `209969704bbad0c6819376e3c75fd8553cc2cd0d`     | `L3‑BP‑06`                                                                                                                                            | `L3‑DEF‑06` — `PASS` ; 9/9 configurations conformes.                                                                                                     |

#### Notes de la session L3‑S01

- **Branche de travail documentaire :** `docs/23-responsive-qa-lot3`.

- **Origine du code applicatif :** `main` après fusion de la PR #43.

- **État Git initial :** `validation-report.md` présent et non encore suivi par Git (`??`).

- **Modifications applicatives non committées :** aucune signalée à ce stade ; à vérifier avant les tests.

- **Frontend :** exécution locale.

- **Backend :** Supabase auto-hébergé sur Hetzner ; connexion effective à confirmer.

- **Résultats :** `L3‑RG‑01` conforme à 320 px : `R16‑01` et `R16‑02` satisfaits pour cette largeur.

#### Notes de la session L3‑S02

- **Résultats :** `L3‑RG‑02` conforme à 390 px, `L3‑RG‑03` conforme à 768 px, `L3‑RG‑04` conforme à 1024 px, `L3‑RG‑05` conforme à 1280 px, `L3‑RG‑06` conforme à 1440 px : `R16‑01` et `R16‑02` satisfaits pour ces largeurs.


Les notes de session servent à documenter les circonstances particulières d'exécution, les changements de configuration et les difficultés rencontrées.

Elles ne remplacent pas les résultats détaillés des tests.

### 1.3. Configurations d'exécution

Les configurations d'exécution documentent les paramètres susceptibles de varier au sein d'une même session.

Chaque configuration reçoit un identifiant unique `CFG‑XX`.

Les dimensions du viewport sont exprimées en pixels CSS. Le DPR correspond à la valeur retournée par `window.devicePixelRatio`.

| Configuration | Session  | Viewport (L × H) | DPR    | Zoom | Police racine | Particularités                                              |
| ------------- | -------- | ---------------- | ------ | ---- | ------------- | ----------------------------------------------------------- |
| `CFG‑01`      | `L3‑S01` | 2111 ×  692 px   | 1.8182 | 100% | 16px          | Firefox desktop ; mesure initiale hors émulation responsive |
| `CFG‑02`      | `L3‑S01` | 320 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑03`      | `L3‑S02` | 390 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑04`      | `L3‑S02` | 768 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑05`      | `L3‑S02` | 1024 x 800 px    | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑06`      | `L3‑S02` | 1280 x 800 px    | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑07`      | `L3‑S02` | 1440 x 800 px    | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑08`      | `L3‑S03` | 511 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑09`      | `L3‑S03` | 512 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑10`      | `L3‑S03` | 513 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑11`      | `L3‑S03` | 623 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑12`      | `L3‑S03` | 624 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑13`      | `L3‑S03` | 625 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑14`      | `L3‑S04` | 767 x 800 px     | 3      | 100% | 16px<br>      | Firefox desktop — Responsive Design Mode                    |
| `CFG‑15`      | `L3‑S04` | 768 x 800 px     | 3      | 100% | 16px<br>      | Firefox desktop — Responsive Design Mode                    |
| `CFG‑16`      | `L3‑S04` | 769 x 800 px     | 3      | 100% | 16px<br>      | Firefox desktop — Responsive Design Mode                    |
| `CFG‑17`      | `L3‑S04` | 991 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑18`      | `L3‑S04` | 992 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑19`      | `L3‑S04` | 993 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑20`      | `L3‑S04` | 219 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑21`      | `L3‑S04` | 220 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑22`      | `L3‑S04` | 221 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑23`      | `L3‑S04` | 299 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑24`      | `L3‑S04` | 300 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑25`      | `L3‑S04` | 301 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑26`      | `L3‑S04` | 303 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑27`      | `L3‑S04` | 304 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑28`      | `L3‑S04` | 305 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑29`      | `L3‑S05` | 319 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑30`      | `L3‑S05` | 320 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑31`      | `L3‑S05` | 321 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑32`      | `L3‑S05` | 351 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑33`      | `L3‑S05` | 352 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑34`      | `L3‑S05` | 353 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑35`      | `L3‑S05` | 415 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑36`      | `L3‑S05` | 416 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |
| `CFG‑37`      | `L3‑S05` | 417 x 800 px     | 3      | 100% | 16px          | Firefox desktop — Responsive Design Mode                    |

**Mesures complémentaires de `CFG‑01` :**

- Viewport de mise en page : `2111 × 692` px CSS.
- Viewport visuel : `2111.45 × 691.90` px CSS (valeurs arrondies).
- Les dimensions ont été relevées avant le réglage des largeurs nominales de la campagne responsive.
- Cette configuration constitue une mesure initiale et non un résultat de validation responsive.

Une configuration supplémentaire est créée lorsqu'un changement pertinent intervient : largeur ou hauteur du viewport, DPR, zoom, taille de police racine, thème, réduction des animations ou contraste forcé.

Il n'est pas nécessaire de dupliquer toutes les informations de l'environnement `ENV‑01` dans chaque configuration.

Les tests peuvent référencer directement les identifiants `L3‑S01` et `CFG‑01`.

#### Conditions d'affichage complémentaires

Les paramètres ci-dessous ont été relevés pour la configuration `CFG‑01`.

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

#### Convention de nommage des identifiants

Afin de garantir une présentation homogène et d'empêcher les retours à la ligne à l'intérieur des identifiants documentaires, **Tous les identifiants propres au référentiel QA utilisent le trait d'union insécable Unicode (`U+2011`).**

Cette convention s'applique notamment aux identifiants de critères d'acceptation (`R16‑01`, `HDR‑01`, `QA‑01`), de scénarios de test (`L3‑RG‑01`, `L3‑BP‑01`), de sessions (`L3‑S01`), de configurations d'exécution (`CFG‑01`) et de références historiques (`DESK‑01`).

Elle est appliquée de manière uniforme dans les trois documents de référence de l'issue #23 : `acceptance-traceability.md`, `desktop-regression-baseline.md` et `validation-report.md`.

**Cette convention concerne exclusivement les identifiants documentaires.** Les tirets ASCII (`U+002D`) sont conservés lorsqu'ils font partie de la syntaxe Markdown, de chemins de fichiers, de noms de branches Git, de commandes, de propriétés CSS, d'attributs HTML ou de références techniques externes.

Les identifiants utilisant `U+2011` constituent la forme de référence dans la documentation QA. Toute automatisation future exploitant ces identifiants devra prendre en charge ce caractère ou effectuer une normalisation explicite avant les comparaisons.

Cette convention n'affecte ni les identifiants GitHub des issues et des PR, ni les critères d'acceptation originaux.

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

Une anomalie constatée doit être documentée et soit corrigée, soit associée à une issue de suivi explicitement justifiée, conformément à `QA‑06`.

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

## 2. Responsive global — R16‑01 / R16‑02

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

| Test       | Largeur (CSS px) | Session  | R16‑01 —Overflow global | R16‑02 — Intégrité visuelle   | Verdict | Preuve / remarque                                                                 |
| ---------- | ---------------: | -------- | ----------------------- | ----------------------------- | ------- | --------------------------------------------------------------------------------- |
| `L3‑RG‑01` |              320 | `L3‑S01` | `PASS` — 0 px<br>       | `PASS` — aucun défaut observé | `PASS`  | `CFG‑02`;<br>scrollWidth=320, clientWidth=320 ;<br>inspection visuelle complète   |
| `L3‑RG‑02` |              390 | `L3‑S02` | `PASS` — 0 px<br>       | `PASS` — aucun défaut observé | `PASS`  | `CFG‑03`;<br>scrollWidth=390, clientWidth=390 ;<br>inspection visuelle complète   |
| `L3‑RG‑03` |              768 | `L3‑S02` | `PASS` — 0 px           | `PASS` — aucun défaut observé | `PASS`  | `CFG‑04`;<br>scrollWidth=768, clientWidth=768 ;<br>inspection visuelle complète   |
| `L3‑RG‑04` |             1024 | `L3‑S02` | `PASS` — 0 px           | `PASS` — aucun défaut observé | `PASS`  | `CFG‑05`;<br>scrollWidth=1024, clientWidth=1024 ;<br>inspection visuelle complète |
| `L3‑RG‑05` |             1280 | `L3‑S02` | `PASS` — 0 px           | `PASS` — aucun défaut observé | `PASS`  | `CFG‑06`;<br>scrollWidth=1280, clientWidth=1280 ;<br>inspection visuelle complète |
| `L3‑RG‑06` |             1440 | `L3‑S02` | `PASS` — 0 px           | `PASS` — aucun défaut observé | `PASS`  | `CFG‑07`;<br>scrollWidth=1440, clientWidth=1440 ;<br>inspection visuelle complète |

> Une mesure globale sans débordement n'exclut pas un contenu tronqué dans un conteneur à `overflow: hidden`, ni un recouvrement entre composants : vérifier les deux aspects séparément.

## 3. Transitions et limites de largeur — R16 / QA‑04

Les seuils ci-dessous sont ceux identifiés dans la matrice. Vérifier les conditions effectives (`max-width` / `min-width`, taille racine) avant de conclure à un défaut de transition.

| Test       | Largeurs (CSS px)           | Zone / comportement                            | Session  | Verdict             | Preuve / remarque                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------- | --------------------------- | ---------------------------------------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `L3‑BP‑01` | 511 / 512 / 513             | Navigation sociale mobile / desktop            | `L3‑S03` | `PASS`              | `CFG‑08/09/10`; 511px : variante mobile;<br>512/513px : variante desktop;<br>navigation DOM unique, interactions et focus conformes ;<br>débordement nul. À 512 px affichés, Firefox évalue une largeur > 512 px (seuil exact non reproduit).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `L3‑BP‑02` | 623 / 624 / 625             | Principales Réalisations : galerie / diaporama | `L3‑S03` | `PASS` avec réserve | `CFG‑11/12/13`;<br>galerie à 623 px, diaporama à 624/625 px, conformément aux media queries évaluées par Firefox ;<br>aucun débordement global ni doublon de mode ;<br>navigation et focus clavier fonctionnels ;<br>tags conformes.<br>Réserve : chevauchement des contours de focus du lien PDF à 624/625 px (`L3‑DEF‑01`).<br>Seuil exact de 624 px non reproduit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `L3‑BP‑03` | 767 / 768 / 769             | Footer et disposition / navigation             | `L3‑S04` | `PASS`              | `CFG‑14/15/16`;<br>footer en colonne à 767/768 px et en ligne à 769 px, conformément aux media queries ; navigation secondaire présente, lisible et accessible au clavier ;<br>rail social vertical conservé ;<br>aucun chevauchement ni débordement horizontal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `L3‑BP‑04` | 991 / 992 / 993             | Transitions des grilles desktop                | `L3‑S04` | `PASS`              | `CFG‑17/18/19`;<br>Présentation : grille principale à 1 colonne à 991 px, puis 2 colonnes à 992/993 px ;<br>Autres Réalisations : 2 colonnes à 991 px, puis 3 colonnes à 992/993 px. Contenus et focus conformes ;<br>aucun chevauchement ni débordement horizontal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `L3‑BP‑05` | 219–221 ; 299–301 ; 303–305 | Présentation : robustesse sous 320 px (#37)    | `L3‑S04` | `FAIL`              | `CFG‑20/28`;<br>transitions à 220, 300 et 304 px conformes aux media queries. `L3‑DEF‑02` : chevauchements des en-têtes de cartes à 219–221 px ; `L3‑DEF‑03` : débordement interne du callout à 221 px ; `L3‑DEF‑04` : débordement horizontal global de 1 px au seuil de 304 px, reproduit. Défauts non observés à 299 ou 305 px selon les cas. Robustesse défensive à corriger ou à arbitrer.<br><br>**Précision `CFG-27` :** largeur cible de 304 px CSS, mais mesures effectives relevées dans Firefox : `window.innerWidth = 305 px`, `window.innerHeight = 803 px`, `documentElement.clientWidth = 304 px` et `visualViewport.width ≈ 304,15 px`. La media query `(max-width: 19rem)` est inactive. Le débordement horizontal global de 1 px (`scrollWidth = 305 px`) a été reproduit dans ces mêmes conditions. Le comportement à une largeur effective strictement égale à 304 px n'a pas été isolé. |
| `L3‑BP‑06` | 319–321 ; 351–353 ; 415–417 | Présentation : transitions des cartes (#37)    | `L3‑S05` | `PASS`              | `CFG‑29/37` ;<br>319–321 px : continuité du rendu autour du minimum supporté ;<br>351–353 px : grille technique de 1 à 2 colonnes après 352 px ;<br>415–417 px : disposition interne des cartes techniques de `column` à `row` après 416 px. Grille transversale maintenue sur 2 colonnes ; aucun débordement horizontal global ni nouveau défaut visuel signalé.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

**Limite :** les essais sous 320 px concernent uniquement la robustesse défensive prévue par #37 ; ils ne changent pas la largeur minimale officiellement prise en charge.

## 4. Validation des sections et critères locaux

Compléter les lignes lors des sessions dédiées. Les identifiants détaillés sont dans la matrice ; cette table suit uniquement l'avancement par domaine, sans prétendre qu'une issue d'implémentation clôturée vaut une revalidation.

| Issue | Critères matriciels | Domaine                                       | Session(s)         | État de la revalidation                                                                                                        | Référence des résultats |
| ----- | ------------------- | --------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| #16   | `R16‑*`             | Exigences globales                            | `L3‑S01`, `L3‑S02` | WIP — Largeurs nominales conformes et transitions vérifiées ; autres critères à contrôler                                      | §2, §3, §5–7            |
| #17   | `FND‑*`             | Fondations responsive / gouttières            | —                  | NOT TESTED                                                                                                                     | —                       |
| #18   | `HDR‑*`             | En-tête, transparence et navigation           | —                  | NOT TESTED                                                                                                                     | —                       |
| #19   | `SOC‑*`             | Navigation sociale, footer et point d'ancrage | —                  | Partiel — Transition sociale 512 px validée (`L3‑BP‑01`)                                                                       | —                       |
| #20   | `HRO‑*`             | Hero                                          | —                  | NOT TESTED                                                                                                                     | —                       |
| #21   | `SEC‑*`             | Intégration des sections validées             | —                  | NOT TESTED                                                                                                                     | —                       |
| #22   | `FRM‑*`             | Modale et formulaire de contact               | —                  | NOT TESTED                                                                                                                     | —                       |
| #24   | `PRS‑*`             | Présentation                                  | —                  | Partiel — Transitions Présentation contrôlées (`L3‑BP‑04/06`)                                                                  | —                       |
| #25   | `FPR‑*`             | Principales Réalisations                      | —                  | Partiel — Transition galerie/diaporama validée avec réserve `L3‑DEF‑01`                                                        | —                       |
| #26   | `OPR‑*`             | Autres Réalisations                           | —                  | Partiel — Transition des grilles validée ; `L3‑DEF‑02` documentée sous 320 px                                                  | —                       |
| #31   | `FTR‑*`             | Footer                                        | —                  | Partiel — Transition du footer validée (`L3‑BP‑03`) ; contrôles complémentaires ouverts                                        | —                       |
| #37   | `POV‑*`             | Débordements / robustesse étroite             | —                  | Non conforme partiellement — Transitions validées, mais anomalies `L3‑DEF‑03/04` et contrôle de robustesse `L3‑BP‑05` en échec | §3                      |
| #23   | `QA‑*`              | Bilan transversal                             | —                  | WIP — `QA‑04` exécuté, `QA‑06` ouvert                                                                                          | §2–9                    |

### 4.1. Résultats détaillés par session

Ajouter un tableau par série de tests sans dupliquer les textes originaux des critères.

| Test | Session | Critère(s) | Scénario exécuté / conditions          | Verdict    | Preuve / anomalie |
| ---- | ------- | ---------- | -------------------------------------- | ---------- | ----------------- |
| —    | —       | —          | Aucun test de cette section enregistré | NOT TESTED | —                 |

## 5. Accessibilité et interactions

| Test         | Scénario                                                                                | Session | Verdict    | Preuve / remarque               |
| ------------ | --------------------------------------------------------------------------------------- | ------- | ---------- | ------------------------------- |
| `L3‑A11Y‑01` | Parcours clavier Hero → contact → footer ; ordre de tabulation et focus visible         | —       | NOT TESTED | —                               |
| `L3‑A11Y‑02` | Orca : titres, régions, noms accessibles, ressources et formulaire                      | —       | NOT TESTED | —                               |
| `L3‑A11Y‑03` | Ouverture/fermeture du dialogue ; focus initial, confinement et restitution             | —       | NOT TESTED | —                               |
| `L3‑A11Y‑04` | Validation du formulaire ; annonces d'erreur, consentement, soumission                  | —       | NOT TESTED | —                               |
| `L3‑A11Y‑05` | Hauteur contrainte et clavier virtuel mobile : champs, erreurs et actions atteignables  | —       | NOT TESTED | —                               |
| `L3‑A11Y‑06` | `prefers-reduced-motion`, contrastes pertinents et visibilité du focus                  | —       | NOT TESTED | —                               |
| `L3‑A11Y‑07` | Retour depuis les ressources externes, clavier et pointeur (revalidation si nécessaire) | —       | NOT TESTED | Validation initiale dans PR #43 |

## 6. Non-régression desktop — QA‑02 / DESK‑01 à DESK‑03

Se reporter au [protocole desktop](./desktop-regression-baseline.md), notamment au tableau des preuves à remplir pour 1024, 1280 et 1440 px CSS.

| Référence | Section                  | État        | Justification / preuve                                                |
| --------- | ------------------------ | ----------- | --------------------------------------------------------------------- |
| `DESK‑01` | Présentation             | NON VÉRIFIÉ | Référence historique visuelle absente ; captures actuelles à produire |
| `DESK‑02` | Principales Réalisations | NON VÉRIFIÉ | Référence historique visuelle absente ; captures actuelles à produire |
| `DESK‑03` | Autres Réalisations      | NON VÉRIFIÉ | Référence historique visuelle absente ; captures actuelles à produire |

Les SHA historiques identifiés dans le référentiel sont des candidats techniques, **pas** des captures du rendu approuvé. Ne pas déclarer `PASS` pour une comparaison historique faute de BASE réellement comparable. Distinguer clairement « fonctionnement actuel conforme » et « identité visuelle historique démontrée ».

## 7. Confidentialité du formulaire — QA‑09

**Issue de suivi fonctionnel :** [#41](https://github.com/al-dev93/PRJ-0013-STFX00-WEB/issues/41).

| Test         | Contrôle                                                                                            | Session | Verdict    | Observations / référence |
| ------------ | --------------------------------------------------------------------------------------------------- | ------- | ---------- | ------------------------ |
| `L3‑PRIV‑01` | Examiner la notice et la distinction entre traitement nécessaire et consentements facultatifs       | —       | NOT TESTED | —                        |
| `L3‑PRIV‑02` | Vérifier la possibilité de soumettre une demande légitime sans consentement facultatif sans rapport | —       | NOT TESTED | —                        |
| `L3‑PRIV‑03` | Documenter tout écart et le suivre dans #41 sans étendre le correctif au lot 3                      | —       | NOT TESTED | —                        |

## 8. Registre des anomalies et décisions

| ID          | Détectée (session/test)                                  | Description / reproduction                                                                                                                                                                                                                                                                     | Gravité                          | Issue / PR corrective | Statut / justification                                                                                                                                                                                                                                                                            |
| ----------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `L3‑DEF‑01` | `L3‑S03` / `L3‑BP‑02` / <br>`CFG‑12` et `CFG‑13`         | À 624 et 625 px, le contour de focus du libellé « Voir l'étude de cas (PDF) » chevauche celui de l'image. Les deux indicateurs correspondent au même lien interactif. Reproduction visuelle confirmée aux deux largeurs ; <br>capture à 624 px.                                                | Mineure (visuelle), provisoire   | À déterminer          | Ouvert — reproduit à 624 et 625 px.<br>Preuve :<br>→ [Étude de cas](./evidence/L3-BP-02_CFG-12_DEF-01_slideshow-624px.png)<br><br>Correction CSS ciblée ou report justifié à décider, disparition estimée vers 645 px, non vérifiée.                                                              |
| `L3‑DEF‑02` | `L3‑S04` / `L3‑BP‑05` / <br>`CFG‑20`, `CFG‑21`, `CFG‑22` | À 219,220 et 221 px, dans Autres Réalisations, les boutons de navigation contextuelle des cartes recouvrent l'icône de la carte HRnet et le badge « Projet socle » de Stack-Flex. Le recouvrement diminue avec la largeur mais reste visible.                                                  | Mineure, à qualifier             | À déterminer          | Ouvert —  reproduit à 219, 220 et 221 px. Observation sous le minimum supporté de 320 px. <br>Preuves à 221 px :<br>→ [HRnet](./evidence/L3-BP-05_CFG-22_DEF-02_hrnet-221px.png)<br>→ [Stack-Flex](./evidence/L3-BP-05_CFG-22_DEF-02_stack-flex-221px.png)<br><br>Non reproduit à partir de 299px |
| `L3‑DEF‑03` | `L3‑S04` / `L3‑BP‑05` / <br>`CFG‑22`                     | À 221 × 800 px, le bloc « En complément » passe en disposition horizontale conformément au breakpoint `13.75rem`, mais le texte déborde légèrement de son cadre. Aucun débordement horizontal global. Capture disponible.                                                                      | Visuelle — à qualifier           | À déterminer          | Ouvert — débordement interne constaté à 221 px.<br>Preuve :<br>→ [En complément](./evidence/L3-BP-05_CFG-22_DEF-03_callout-221px.png).<br><br>Non reproduit à partir de 299px                                                                                                                     |
| `L3‑DEF‑04` | `L3‑S04` / `L3‑BP‑05` / <br>`CFG‑27`                     | À 304 px affichés (largeur visuelle effective : 304,15 px), le breakpoint `max-width: 19rem` est inactif. Le soulignement du titre « Présentation de Stack-Flex » adopte son positionnement par défaut (`inset-inline-end: -35.236px`) et un débordement horizontal global de 1 px est mesuré. | Mineure — débordement horizontal | À déterminer          | Ouvert — débordement horizontal global de 1 px reproduit à 304 px.<br>Non reproduit à 303 et 305 px.<br>Cause exacte à confirmer.<br>Preuve : <br>→[Soulignement](./evidence/L3-BP-05_CFG-27_DEF-04_underline-304px.png)<br>                                                                      |

Les corrections des anciens lots restent traçables dans leurs PR. Les nouveaux défauts sont corrigés dans des PR ciblées ou font l'objet d'une issue avec justification explicite du report (`QA‑06`).

## 9. Bilan de couverture et décision de sortie

| Point                                                               | État actuel                                                                                    |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 146 critères de la matrice revalidés ou explicitement qualifiés     | NON                                                                                            |
| Tests du parcours complet sur les six largeurs nominales            | NON                                                                                            |
| Contrôles aux seuils et conditions particulières                    | PARTIEL — 6/6 scénarios de breakpoints exécutés ; autres conditions particulières à contrôler. |
| Contrôles clavier, Orca, formulaire et contraintes de hauteur       | NON                                                                                            |
| Comparaisons desktop historiques démontrées ou réserves formalisées | NON                                                                                            |
| Revue de consentement `QA‑09` / suivi #41                           | NON                                                                                            |
| Anomalies corrigées ou reportées avec justification                 | NON                                                                                            |

**Décision :** lot 3 non terminé. Aucun résultat n'est présumé conforme avant exécution. La clôture de #23 sera examinée après les lots 3 et 4 et après traitement explicite des réserves.

---
## Annexe A — Scripts de diagnostic et de mesure

Cette annexe conserve les scripts JavaScript réellement employés
pendant les contrôles des transitions responsive.

Ils sont exécutés dans la console de développement de Firefox,
sur la page applicative chargée, avec la configuration de viewport
correspondante.

Ils fournissent des mesures techniques reproductibles, mais ne
remplacent pas les observations visuelles, les essais au clavier
ni les vérifications d'accessibilité.

### A.1. `L3‑SCR‑01` — Navigation sociale

**Scénario :** `L3‑BP‑01`

**Configurations :** `CFG‑08`, `CFG‑09`, `CFG‑10`

**Largeurs :** 511, 512 et 513 px CSS.

**Objectifs :**

- Mesurer les dimensions du viewport et le débordement horizontal.
- Vérifier le résultat de la media query `(max-width: 32rem)`.
- Identifier la variante de navigation rendue.
- Vérifier l'unicité de la navigation de page.
- Compter les raccourcis vers le footer.

**Script exécuté :**

```javascript
(() => {
  const root = document.documentElement;
  const navs = [...document.querySelectorAll(
    'nav[data-variant="page-mobile"], nav[data-variant="page-desktop"]'
  )];

  const mobile = matchMedia('(max-width: 32rem)').matches;

  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    overflowPx: Math.max(0, root.scrollWidth - root.clientWidth),
    dpr: window.devicePixelRatio,
    rootFontSize: getComputedStyle(root).fontSize,
    breakpointMobile: mobile,
    expectedVariant: mobile ? 'page-mobile' : 'page-desktop',
    navigationCount: navs.length,
    renderedVariants: navs.map(nav => nav.dataset.variant),
    footerShortcutCount: navs.reduce(
      (total, nav) => total + nav.querySelectorAll('a[href="#footer"]').length,
      0
    ),
  };
})()
```

**Limites :**

- `expectedVariant` est calculé à partir de `matchMedia` :
  il ne constitue pas une vérification indépendante du seuil CSS.
- Le script ne vérifie pas le positionnement visuel, les liens,
  l'ordre de tabulation ni la visibilité du focus.
- À 512 px affichés, Firefox a évalué une largeur effective
  légèrement supérieure à 512 px. Le seuil mathématiquement exact
  n'a donc pas été reproduit.

**Résultats :** voir `L3‑BP‑01`, section 3.
#### A.1.1. Diagnostic complémentaire du breakpoint à 512 px

**Scénario concerné :** `L3‑BP‑01` — Navigation sociale mobile / desktop.

**Configuration :** `CFG‑09` — Firefox Responsive Design Mode, viewport affiché de 512 × 800 px, DPR 3, zoom 100 % et police racine calculée de 16 px.

**Contexte :**

Lors du contrôle à 512 px, la navigation sociale affichait la variante `page-desktop`, alors que le breakpoint applicatif `(max-width: 32rem)` correspond théoriquement à 512 px inclus, pour une taille initiale de police de 16 px.

Le diagnostic initial a fourni les résultats suivants :

- `window.innerWidth` : 512 px ;
- `document.documentElement.clientWidth` : 512 px ;
- `window.visualViewport.width` : 512.0499877929688 px ;
- `(max-width: 32rem)` : `false` ;
- `(max-width: 512px)` : `false` ;
- `(min-width: 512px)` : `true` ;
- `(max-width: 513px)` : `true`.

Ces résultats suggèrent que Firefox évalue les media queries à partir d'une largeur fractionnaire supérieure à 512 px, malgré une largeur entière de 512 px rapportée par `window.innerWidth`.

**Objectif du contrôle complémentaire :**

Encadrer plus précisément la largeur utilisée lors de l'évaluation des media queries, afin de déterminer si le passage anticipé à la variante desktop résulte d'une particularité de mesure du viewport ou d'un dysfonctionnement applicatif.

**Script exécuté dans la console Firefox :**

```javascript
[512, 512.01, 512.05, 512.1, 512.5, 513].map((width) => ({
  width,
  matches: matchMedia(`(max-width: ${width}px)`).matches,
}));
```

**Résultats obtenus :**

| Seuil testé (`max-width`) | Résultat |
| ------------------------- | -------- |
| 512 px                    | `false`  |
| 512.01 px                 | `false`  |
| 512.05 px                 | `true`   |
| 512.1 px                  | `true`   |
| 512.5 px                  | `true`   |
| 513 px                    | `true`   |
**Interprétation :**

Les résultats permettent d'encadrer la largeur évaluée par les media queries :

`512.01 px < largeur évaluée ≤ 512.05 px`

Cette plage est cohérente avec la valeur de `window.visualViewport.width` relevée à environ 512.05 px.

Par conséquent, la media query `(max-width: 512px)` ne correspond pas et la variante `page-desktop` est sélectionnée.

L'examen du hook applicatif `useMediaQuery` montre qu'il exploite directement `window.matchMedia(query).matches`. Le comportement du composant est donc cohérent avec le résultat retourné par Firefox.

**Conclusion :**

Le passage à la variante desktop à 512 px affichés s'explique par une largeur fractionnaire évaluée au-delà du breakpoint.

Aucune anomalie fonctionnelle de `SocialMediaNavBar` ou de `useMediaQuery` n'a été mise en évidence par ces contrôles.

Le scénario `L3‑BP‑01` a été validé aux trois largeurs affichées de 511, 512 et 513 px, avec une observation particulière à 512 px.

**Limites et précautions :**

- La largeur utilisée par les media queries est encadrée indirectement ; sa valeur exacte n'est pas mesurée par ce script.
- La concordance avec `visualViewport.width` ne démontre pas que cette propriété constitue la source directe de l'évaluation.
- La taille de police calculée sur l'élément racine ne suffit pas, à elle seule, à établir la taille initiale de police utilisée pour les unités `rem` dans les media queries.
- Le comportement à une largeur effectivement égale à 512.00 px n'a pas été reproduit.
- Cette observation est propre aux conditions d'exécution documentées et ne doit pas être généralisée à tous les navigateurs.

**Décision QA :**

- Pas de correction applicative nécessaire sur la base des résultats disponibles.
- Pas de nouvelle anomalie ouverte.
- Observation conservée pour la reproductibilité des tests aux frontières des breakpoints.
- Prise en compte de cette particularité dans les contrôles suivants.

**Référence :** section 3 — `L3‑BP‑01`, configuration `CFG‑09`.

### A.2. `L3‑SCR‑02` — Galerie et diaporama

**Scénario :** `L3‑BP‑02`

**Configurations :** `CFG‑11`, `CFG‑12`, `CFG‑13`

**Largeurs :** 623, 624 et 625 px CSS.

**Objectifs :**

- Mesurer les dimensions du viewport et le débordement horizontal.
- Vérifier le résultat de la media query `(max-width: 39rem)`.
- Vérifier la présence du composant Slideshow.
- Distinguer la galerie horizontale du diaporama.
- Vérifier leur exclusion mutuelle.
- Examiner les propriétés de défilement de la galerie.

**Script exécuté :**

```javascript
(() => {
  const root = document.documentElement;

  const slideshow = document.querySelector(
    'article[aria-roledescription="carousel"]'
  );

  const gallery = slideshow?.querySelector(
    '[role="region"][aria-label="Galerie des principales réalisations"]'
  );

  const carousel = slideshow?.querySelector('#picturesScroller');

  const galleryList = gallery?.querySelector(':scope > ul');

  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    visualWidth: window.visualViewport?.width ?? null,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    overflowPx: Math.max(0, root.scrollWidth - root.clientWidth),

    dpr: window.devicePixelRatio,
    rootFontSize: getComputedStyle(root).fontSize,

    galleryBreakpoint: matchMedia('(max-width: 39rem)').matches,
    max624px: matchMedia('(max-width: 624px)').matches,

    slideshowPresent: Boolean(slideshow),
    galleryPresent: Boolean(gallery),
    carouselPresent: Boolean(carousel),

    galleryScrollSnap: galleryList
      ? getComputedStyle(galleryList).scrollSnapType
      : null,

    galleryScrollable: galleryList
      ? galleryList.scrollWidth > galleryList.clientWidth
      : null,
  };
})()
```

**Limites :**

- La présence d'un composant ne démontre pas, à elle seule,
  son bon fonctionnement.
- `galleryScrollable` indique la présence d'un débordement
  horizontal interne ; il ne valide pas les gestes tactiles.
- `galleryScrollSnap` confirme la configuration CSS,
  mais pas la qualité de l'alignement après défilement.
- Le script ne vérifie pas les commandes, les liens, les tags,
  la visibilité du focus ni les éventuels chevauchements.
- À 624 px affichés, Firefox a évalué une largeur supérieure
  à 624 px. Le seuil mathématiquement exact n'a pas été reproduit.

**Résultats :** voir `L3‑BP‑02`, section 3.

**Anomalie associée :** `L3‑DEF‑01`, section 8.

### A.3. `L3‑SCR‑03` — Disposition responsive du footer

**Scénario :** `L3‑BP‑03` — Transition du footer et de la navigation secondaire.

**Configurations :** `CFG‑14`, `CFG‑15`, `CFG‑16`.

**Largeurs :** 767, 768 et 769 px CSS, pour une hauteur de 800 px.

**Objectifs :**

- Mesurer les dimensions du viewport et détecter un éventuel débordement horizontal global.
- Vérifier l'application du breakpoint `(max-width: 48rem)` qui pilote la disposition du footer.
- Déterminer la direction effective du conteneur principal du footer (`column` ou `row`).
- Vérifier la présence de la navigation secondaire et de ses deux commandes.
- Contrôler les propriétés de largeur et de retour à la ligne de la navigation secondaire.
- Identifier la variante de `SocialMediaNavBar` affichée.
- Fournir un indice sur l'indépendance structurelle du footer par rapport au contenu principal.

```javascript
(() => {
  const root = document.documentElement;
  const footer = document.querySelector('footer#footer');
  const secondaryNav = footer?.querySelector(
    'nav[aria-label="Navigation secondaire"]'
  );

  const footerMain = secondaryNav?.parentElement;
  const secondaryList = secondaryNav?.querySelector('ul');
  const socialNav = document.querySelector(
    'nav[data-variant="page-mobile"], nav[data-variant="page-desktop"]'
  );

  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    visualWidth: window.visualViewport?.width ?? null,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    overflowPx: Math.max(0, root.scrollWidth - root.clientWidth),

    dpr: window.devicePixelRatio,
    rootFontSize: getComputedStyle(root).fontSize,

    footerBreakpoint: matchMedia('(max-width: 48rem)').matches,
    max768px: matchMedia('(max-width: 768px)').matches,

    footerPresent: Boolean(footer),
    secondaryNavPresent: Boolean(secondaryNav),

    footerDirection: footerMain
      ? getComputedStyle(footerMain).flexDirection
      : null,

    secondaryNavWidth: secondaryNav
      ? getComputedStyle(secondaryNav).width
      : null,

    secondaryListWrap: secondaryList
      ? getComputedStyle(secondaryList).flexWrap
      : null,

    contactButtonCount: secondaryNav?.querySelectorAll(
      'button[aria-haspopup="dialog"]'
    ).length ?? 0,

    legalLinkCount: secondaryNav?.querySelectorAll(
      'a[href="/legal-notice"]'
    ).length ?? 0,

    pageSocialVariant: socialNav?.dataset.variant ?? null,
    footerInsidePageContent: Boolean(
      footer?.closest('main, .pageContent')
    ),
  };
})()
```

**Limites :**

- Le script mesure les propriétés DOM/CSS et le débordement global, mais ne détecte pas nécessairement les éléments tronqués ou les chevauchements.
- secondaryListWrap confirme la propriété CSS, sans tester l'ajout de liens ou de libellés longs.
- footerInsidePageContent fournit seulement un indice structurel, notamment parce que pageContent est une classe CSS Modules. La structure est également vérifiée dans Page/index.tsx.
- Le script ne valide ni les interactions clavier/tactiles, ni les indicateurs de focus, ni la largeur exacte utilisée pour les media queries. Ces aspects nécessitent des vérifications complémentaires.

**Résultats :** voir `L3‑BP‑03`, section 3.

### A.4. `L3‑SCR‑04` — Transitions des grilles desktop

**Scénario :** `L3‑BP‑04` — Transitions des grilles des sections Présentation et Autres Réalisations.

**Configurations :** `CFG‑17`, `CFG‑18`, `CFG‑19`.

**Largeurs :** 991, 992 et 993 px CSS, pour une hauteur de 800 px.

**Objectifs :**

- Mesurer les dimensions du viewport et détecter un éventuel débordement horizontal global.
- Vérifier les media queries `(max-width: 62rem)` et `(min-width: 62rem)`.
- Contrôler la disposition de la grille principale de Présentation : une ou deux colonnes.
- Vérifier le mode d'affichage et le nombre de colonnes du bloc secondaire de Présentation.
- Contrôler le passage de deux à trois colonnes dans la grille des Autres Réalisations.
- Comparer les dispositions effectivement calculées par Firefox aux breakpoints CSS.

**Script exécuté :**

```javascript
(() => {
  const root = document.documentElement;

  const about = document.querySelector(
    'section[data-variant="about"]'
  );

  const more = document.querySelector(
    'section[data-variant="more"]'
  );

  const aboutSecondary = about?.querySelector(
    ':scope > [class*="section__secondaryColumn"]'
  );

  const moreCards = more?.querySelector(
    '[class*="more__cardsWrapper"]'
  );

  const getGridInfo = (element) => {
    if (!element) return null;

    const style = getComputedStyle(element);
    const columns = style.gridTemplateColumns;

    return {
      display: style.display,
      columns,
      columnCount: style.display === 'grid' && columns !== 'none'
        ? columns.trim().split(/\s+/).length
        : null,
    };
  };

  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    visualWidth: window.visualViewport?.width ?? null,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    overflowPx: Math.max(
      0,
      root.scrollWidth - root.clientWidth
    ),

    dpr: window.devicePixelRatio,
    rootFontSize: getComputedStyle(root).fontSize,

    max62rem: matchMedia('(max-width: 62rem)').matches,
    min62rem: matchMedia('(min-width: 62rem)').matches,
    max992px: matchMedia('(max-width: 992px)').matches,
    min992px: matchMedia('(min-width: 992px)').matches,

    aboutPresent: Boolean(about),
    aboutGrid: getGridInfo(about),
    aboutSecondaryGrid: getGridInfo(aboutSecondary),

    morePresent: Boolean(more),
    moreCardsPresent: Boolean(moreCards),
    moreCardsGrid: getGridInfo(moreCards),
  };
})()
```

**Limites :**

- Le script vérifie les propriétés DOM et CSS des grilles, mais ne détecte pas directement les chevauchements, les troncatures ou les défauts d'alignement. Ces contrôles reposent sur les observations visuelles complémentaires.
- `overflowPx` mesure uniquement le débordement horizontal global du document, sans détecter nécessairement les débordements internes masqués.
- `columnCount` est déduit des valeurs calculées de `grid-template-columns`. Il constitue un indicateur de la structure des grilles, mais ne garantit pas la bonne présentation de leurs contenus.
- Les sélecteurs des blocs internes utilisent des fragments de noms de classes CSS Modules. Leur validité doit être réexaminée si les classes ou la structure des composants évoluent.
- Une valeur `columnCount: null` est normale pour un conteneur affiché en `flex` ; elle ne signifie pas nécessairement qu'un élément est absent.
- Les valeurs fractionnaires de `visualViewport.width` ne démontrent pas à elles seules la largeur exacte utilisée pour évaluer les media queries.
- Le script ne valide pas les interactions clavier, les indicateurs de focus ou la non-régression visuelle historique desktop. Ces vérifications nécessitent des contrôles distincts.

**Résultats :** voir `L3‑BP‑04`, section 3.

### A.5. `L3‑SCR‑05` — Robustesse de Présentation sous 320 px

**Scénario :** `L3‑BP‑05` — Vérification des transitions défensives introduites par le correctif #37.

**Configurations :** `CFG‑20` à `CFG‑28`.

**Largeurs :** 219, 220, 221, 299, 300, 301, 303, 304 et 305 px CSS, pour une hauteur cible de 800 px.

**Objectifs :**

- Mesurer les dimensions du viewport et détecter un éventuel débordement horizontal global.
- Vérifier les media queries `(max-width: 13.75rem)`, `(max-width: 18.75rem)` et `(max-width: 19rem)`.
- Contrôler le passage du bloc « En complément » d'une disposition verticale à horizontale au seuil de 220 px.
- Vérifier le maintien de la grille à deux colonnes des savoir-faire transversaux et le changement de disposition interne des six cartes au seuil de 300 px.
- Contrôler le positionnement calculé du soulignement des titres de section au seuil de 304 px.
- Confronter les propriétés CSS calculées aux observations visuelles, notamment concernant les débordements internes, les chevauchements et la lisibilité.

**Script exécuté :**

```javascript
(() => {
  const root = document.documentElement;

  const about = document.querySelector(
    'section[data-variant="about"]'
  );

  const callout = about?.querySelector(
    '[class*="callout__wrapper"]'
  );

  const crossCuttingGrid = about?.querySelector(
    '[class*="section__listBody--flexColumn"]'
  );

  const crossCuttingCards = [
    ...(
      about?.querySelectorAll(
        'li[data-variant="cross_cutting_skill"]'
      ) ?? []
    ),
  ];

  const titleInner = about?.querySelector(
    '#about-title > span'
  );

  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    visualWidth: window.visualViewport?.width ?? null,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    overflowPx: Math.max(
      0,
      root.scrollWidth - root.clientWidth
    ),

    dpr: window.devicePixelRatio,
    rootFontSize: getComputedStyle(root).fontSize,

    calloutBreakpoint: matchMedia(
      '(max-width: 13.75rem)'
    ).matches,

    crossCuttingBreakpoint: matchMedia(
      '(max-width: 18.75rem)'
    ).matches,

    underlineBreakpoint: matchMedia(
      '(max-width: 19rem)'
    ).matches,

    aboutPresent: Boolean(about),

    calloutPresent: Boolean(callout),
    calloutDirection: callout
      ? getComputedStyle(callout).flexDirection
      : null,

    crossCuttingGridPresent: Boolean(crossCuttingGrid),
    crossCuttingGridColumns: crossCuttingGrid
      ? getComputedStyle(crossCuttingGrid).gridTemplateColumns
      : null,

    crossCuttingCardCount: crossCuttingCards.length,
    crossCuttingCardDirections: [
      ...new Set(
        crossCuttingCards.map(
          (card) => getComputedStyle(card).flexDirection
        )
      ),
    ],

    underlinePresent: Boolean(titleInner),
    underlineInsetInlineEnd: titleInner
      ? getComputedStyle(titleInner, '::after').insetInlineEnd
      : null,
  };
})()
```

**Limites :**

- Le script vérifie les media queries et les propriétés CSS calculées, sans garantir l'absence de défauts visuels. Les chevauchements, troncatures et débordements internes nécessitent une inspection complémentaire.
- `overflowPx` mesure uniquement le débordement horizontal global du document. Une valeur nulle n'exclut pas un débordement à l'intérieur d'un composant.
- `crossCuttingGridColumns` restitue les dimensions calculées des pistes de la grille, sans vérifier leur contenu ni leur lisibilité.
- `underlineInsetInlineEnd` mesure le positionnement CSS du pseudo-élément `::after`, mais ne permet pas à lui seul de déterminer son emprise visuelle ni de démontrer qu'il provoque un débordement.
- Les sélecteurs reposent en partie sur des fragments de classes CSS Modules et sur la structure DOM actuelle. Ils doivent être réexaminés si les composants évoluent.
- Les largeurs fractionnaires et les écarts entre `window.innerWidth`, `visualViewport.width` et `clientWidth` peuvent influencer l'évaluation des breakpoints. Le relevé à 304 px présente notamment des dimensions mesurées différentes de la configuration cible.
- Les largeurs testées sont inférieures au minimum officiellement pris en charge de 320 px. Elles servent à vérifier la robustesse défensive prévue par le correctif #37, sans élargir le périmètre général de compatibilité.

**Résultats :** voir `L3‑BP‑05`, section 3, et les anomalies `L3‑DEF‑02`, `L3‑DEF‑03` et `L3‑DEF‑04`, section 8.

### A.6. `L3‑SCR‑06` — Transitions des cartes de Présentation

**Scénario :** `L3‑BP‑06` — Vérification des transitions responsive des cartes de Présentation, conformément au correctif #37.

**Configurations :** `CFG‑29` à `CFG‑37`.

**Largeurs :** 319, 320, 321, 351, 352, 353, 415, 416 et 417 px CSS, pour une hauteur de 800 px.

**Objectifs :**

- Mesurer les dimensions du viewport et détecter un éventuel débordement horizontal global.
- Vérifier la continuité du rendu autour de la largeur minimale supportée de 320 px.
- Contrôler l'activation des media queries `(max-width: 22rem)` et `(max-width: 26rem)`, ainsi que le repère de mesure `(max-width: 20rem)`.
- Vérifier le passage de la grille des cartes techniques de une à deux colonnes au franchissement du seuil de 352 px.
- Vérifier le passage de la disposition interne des cartes techniques de `column` à `row` au franchissement du seuil de 416 px.
- Contrôler le maintien de la grille des savoir-faire transversaux sur deux colonnes et de leur disposition interne horizontale.
- Vérifier l'absence de troncature, de chevauchement ou de régression visuelle lors des transitions.

**Script exécuté :**

```javascript
(() => {
  const root = document.documentElement;

  const about = document.querySelector(
    'section[data-variant="about"]'
  );

  const technicalCards = [
    ...(about?.querySelectorAll(
      'li[data-variant="technical_skill"]'
    ) ?? []),
  ];

  const crossCuttingCards = [
    ...(about?.querySelectorAll(
      'li[data-variant="cross_cutting_skill"]'
    ) ?? []),
  ];

  const technicalGrid = technicalCards[0]?.closest('ul');
  const crossCuttingGrid = crossCuttingCards[0]?.closest('ul');

  const getGridInfo = (element) => {
    if (!element) return null;

    const style = getComputedStyle(element);
    const columns = style.gridTemplateColumns;

    return {
      display: style.display,
      columns,
      columnCount: style.display === 'grid' && columns !== 'none'
        ? columns.trim().split(/\s+/).length
        : null,
    };
  };

  const getDirections = (elements) => [
    ...new Set(
      elements.map(
        (element) => getComputedStyle(element).flexDirection
      )
    ),
  ];

  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    visualWidth: window.visualViewport?.width ?? null,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    overflowPx: Math.max(
      0,
      root.scrollWidth - root.clientWidth
    ),

    dpr: window.devicePixelRatio,
    rootFontSize: getComputedStyle(root).fontSize,

    max320px: matchMedia('(max-width: 20rem)').matches,
    max352px: matchMedia('(max-width: 22rem)').matches,
    max416px: matchMedia('(max-width: 26rem)').matches,

    aboutPresent: Boolean(about),

    technicalGridPresent: Boolean(technicalGrid),
    technicalGrid: getGridInfo(technicalGrid),
    technicalCardCount: technicalCards.length,
    technicalCardDirections: getDirections(technicalCards),

    technicalCardPaddingInline: technicalCards[0]
      ? getComputedStyle(technicalCards[0]).paddingInlineStart
      : null,

    crossCuttingGridPresent: Boolean(crossCuttingGrid),
    crossCuttingGrid: getGridInfo(crossCuttingGrid),
    crossCuttingCardCount: crossCuttingCards.length,
    crossCuttingCardDirections: getDirections(crossCuttingCards),
  };
})()
```

**Limites :**

- Le script vérifie les media queries et les propriétés CSS calculées, mais ne détecte pas directement les chevauchements, les troncatures ni les défauts d'alignement. Ces aspects nécessitent une inspection visuelle complémentaire.
- `overflowPx` mesure uniquement le débordement horizontal global du document ; une valeur nulle ne garantit pas l'absence de débordement interne ou de contenu masqué.
- `columnCount` est déduit de `grid-template-columns`. Il renseigne sur la structure calculée des grilles, sans garantir la lisibilité ou l'intégrité visuelle de leurs contenus.
- `technicalCardDirections` et `crossCuttingCardDirections` restituent les valeurs distinctes de `flex-direction` ; ils ne mesurent pas directement la position des icônes et des textes.
- `technicalCardPaddingInline` relève uniquement le `padding-inline-start` de la première carte technique. Il ne permet pas de vérifier l'ensemble des espacements de toutes les cartes.
- Les sélecteurs dépendent des attributs `data-variant` et de la structure DOM actuelle. Leur validité doit être réexaminée si les composants évoluent.
- Les largeurs fractionnaires évaluées par Firefox peuvent modifier l'activation des media queries aux seuils exacts. La propriété `max320px` sert uniquement de repère : elle ne correspond pas à une règle spécifique de `PresentationBlock`.
- La comparaison à 319, 320 et 321 px vérifie la continuité locale du rendu autour du minimum supporté. Elle ne constitue pas, à elle seule, une preuve complète de non-régression à toutes les largeurs supérieures.
- Le script ne compare pas automatiquement le rendu aux références visuelles historiques et ne vérifie pas les interactions clavier ou tactiles.

**Résultats :** voir `L3‑BP‑06`, section 3.
