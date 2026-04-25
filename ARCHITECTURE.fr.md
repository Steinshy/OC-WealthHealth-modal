# Architecture — wealthhealth-modal

**Langue :** Français · [English](./ARCHITECTURE.md) — **README :** [Français](./README.fr.md) · [English](./README.md)

## Vue d’ensemble

`@steinshy/wealthhealth-modal` est une bibliothèque React légère et accessible de modales, construite avec Vite. Elle remplace l’usage du plugin jQuery « dialog » du projet HRNet d’origine. Le paquet npm est publié en double format (ESM + CJS) avec des types TypeScript complets.

**Stack :** React 18/19 · TypeScript 6 · Vite 8 · CSS Modules · Storybook 10 (`@storybook/react-vite`)

**npm :** `@steinshy/wealthhealth-modal`  
**Démo :** https://steinshy.github.io/OC-WealthHealth-modal/  
**Storybook (hébergé avec la démo) :** https://steinshy.github.io/OC-WealthHealth-modal/storybook/

---

## Arborescence du dépôt

```
.
├── src/
│   ├── index.ts                 # API publique — réexporte composants, hook, types
│   ├── types/index.ts         # ModalProps, SignupModalProps, …
│   ├── hooks/useTheme.ts      # Hook thème (data-theme + localStorage)
│   ├── demo/                  # Appli démo Vite (non publiée sur npm)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── demo.css
│   │   └── demo.module.css
│   └── components/
│       ├── index.ts
│       ├── Modal.tsx / Modal.module.css / Modal.stories.tsx
│       ├── SignupModal.tsx / …module.css / …stories.tsx
│       ├── LoginModal.tsx / …module.css / …stories.tsx
│       ├── ConfirmModal.tsx / …module.css / …stories.tsx
│       └── form/                # Primitifs de formulaire partagés
│           ├── FormField.tsx
│           ├── PasswordField.tsx
│           ├── ErrorBanner.tsx
│           ├── SuccessMessage.tsx
│           └── index.ts
├── .storybook/                  # Config Storybook (React + Vite, addon a11y)
├── vite.config.ts               # Build bibliothèque → dist/
├── vite.demo.config.ts          # SPA démo → dist-demo/ (+ publicDir pour assets démo)
├── index.html                   # Point d’entrée dev de la démo (racine)
├── public/                      # Répertoire public Vite par défaut (dev)
└── .github/workflows/           # CI, Pages, publication
```

La génération `dts` de la bibliothèque exclut `src/demo/**` : le code réservé à la démo n’apparaît pas dans les définitions de types publiées.

---

## API publique

Tout ce que consomment les intégrateurs est exporté depuis `src/index.ts` :

### Composants

| Export           | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| `Modal`          | Modale de base — `<dialog>` natif, statut, taille, pied, icône, règles de fermeture   |
| `SignupModal`    | E-mail + mot de passe + confirmation ; validation côté client ; chargement et erreurs |
| `LoginModal`     | E-mail + mot de passe ; mêmes patterns UX que l’inscription                           |
| `ConfirmModal`   | Confirmer / annuler avec confirmation async optionnelle + chargement                  |
| `FormField`      | Libellé + champ + erreur (formulaires personnalisés dans `Modal`)                     |
| `PasswordField`  | `FormField` + bascule afficher / masquer le mot de passe                              |
| `ErrorBanner`    | Zone d’erreur au niveau formulaire                                                    |
| `SuccessMessage` | Zone de succès après envoi                                                            |

### Hook

| Export     | Description                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `useTheme` | Pose `data-theme` sur `<html>`, persiste dans `localStorage` sous la clé `wh-theme`, suit `prefers-color-scheme` |

### Types

| Export                                                                            | Description                    |
| --------------------------------------------------------------------------------- | ------------------------------ |
| `ModalProps`, `SignupModalProps`, `LoginModalProps`, `ConfirmModalProps`          | Props des composants           |
| `SignupFormData`, `LoginFormData`                                                 | Données envoyées au submit     |
| `FormFieldProps`, `PasswordFieldProps`, `ErrorBannerProps`, `SuccessMessageProps` | Props des primitifs formulaire |
| `Theme`, `UseThemeReturn`                                                         | Types du hook thème            |

---

## Conception des composants

### Modal (base)

Utilise l’élément HTML `<dialog>` — pas de bibliothèque de piège à focus maison, pas de portail pour la surface de dialogue elle-même. Le navigateur gère la couche supérieure et le focus lorsque `showModal()` est utilisé.

**Flux typique :**

- `isOpen === true` → `dialogRef.current.showModal()`
- `isOpen === false` → `dialogRef.current.close()`
- Les chemins de fermeture (Échap, fond si activé, bouton fermer) aboutissent à un seul appel `onClose` par fermeture
- `dismissible={false}` désactive les fermetures déclenchées par l’utilisateur selon l’implémentation du composant
- `autoCloseDuration` utilise une temporisation nettoyée au démontage ou quand la durée change

**Styles :** `status` et `size` correspondent à des classes modificateurs CSS Modules sur `<dialog>`.

### Modales prêtes à l’emploi

`SignupModal`, `LoginModal` et `ConfirmModal` composent `Modal` et gèrent un état UI local (valeurs, validation, chargement, succès). La validation est centrée sur la soumission. Les parcours réussis peuvent afficher un état succès dans la modale avant `onClose`.

### Primitifs de formulaire (`form/`)

Réutilisés dans les modales prêtes à l’emploi et exportés pour des mises en page personnalisées dans `Modal`.

---

## Styles

Les composants utilisent des **CSS Modules**. On peut passer `className` à `Modal` et surcharger les **propriétés CSS personnalisées** là où les modules les déclarent (liste de référence dans `Modal.module.css`, couleurs de bordure / titre par statut).

L’apparence sombre repose sur :

- `data-theme="dark"` sur `<html>` (écrit par `useTheme`), et/ou
- les règles `@media (prefers-color-scheme: dark)` dans les modules

Les animations respectent `prefers-reduced-motion`.

---

## Builds

### Bibliothèque (`npm run build`, `vite.config.ts`)

| Sortie           | Rôle                                        |
| ---------------- | ------------------------------------------- |
| `dist/index.js`  | Point d’entrée ESM                          |
| `dist/index.cjs` | Point d’entrée CommonJS                     |
| `dist/**/*.d.ts` | Déclarations TypeScript (`vite-plugin-dts`) |

Rollup marque comme externes `react`, `react-dom`, `react/jsx-runtime`. Le CSS est injecté dans le bundle à l’exécution via `vite-plugin-css-injected-by-js` : les consommateurs n’importent pas de fichier CSS séparé.

Le champ `exports` de `package.json` pointe `"."` vers types + ESM + CJS. `"sideEffects": ["**/*.css"]` évite que les bundlers éliminent à tort les effets de bord liés au CSS.

### Démo + GitHub Pages (`npm run build:demo`)

1. **Vite** (`vite.demo.config.ts`) construit la SPA démo dans **`dist-demo/`** avec `base` issu de `VITE_BASE_PATH` (ex. `/OC-WealthHealth-modal/` en CI).
2. **Storybook** exécute `storybook build -o dist-demo/storybook` : le site statique Storybook est à côté de la démo, sous **`/…/storybook/`** sur Pages.

`vite.demo.config.ts` définit `publicDir` sur `demo-public/` (dossier à la racine du dépôt pour des fichiers statiques copiés dans le build démo lorsqu’il est présent).

**Prévisualisation locale :** `npm run preview` lance `build:demo` puis `vite preview` avec la config démo.

**Storybook seul :** `npm run storybook` (dev) ou `npm run build:storybook` (sortie par défaut `storybook-static/`, ignorée par git).

---

## Commandes de développement

| Commande                          | Rôle                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                     | Serveur démo Vite (port **5173**) et Storybook (**6006**) via `concurrently` |
| `npm run dev:demo`                | Démo seule (`vite`)                                                          |
| `npm run storybook`               | Storybook en dev uniquement                                                  |
| `npm run build`                   | Bibliothèque → `dist/`                                                       |
| `npm run build:demo`              | Démo → `dist-demo/` + Storybook → `dist-demo/storybook/`                     |
| `npm run build:storybook`         | Build statique Storybook (dossier par défaut `storybook-static/`)            |
| `npm run preview`                 | Démo « production » après `build:demo`                                       |
| `npm run type-check`              | `tsc --noEmit`                                                               |
| `npm run lint` / `lint:fix`       | ESLint                                                                       |
| `npm run lint:styles`             | Stylelint sur `src/**/*.css`                                                 |
| `npm run format` / `format:check` | Prettier                                                                     |

---

## CI/CD (`.github/workflows/`)

| Workflow         | Déclencheur                      | Actions                                                                                                                                                                              |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ci.yml`         | Push et pull request             | `format:check`, ESLint, Stylelint, `type-check`, `build:demo` avec `VITE_BASE_PATH` = `/${{ github.event.repository.name }}/`, puis vérification de `dist-demo/storybook/index.html` |
| `build-demo.yml` | Push sur **`main`** et **`dev`** | `build:demo` avec le même chemin de base, vérification Storybook, envoi de **`dist-demo`** comme artefact GitHub Pages, job de déploiement Pages                                     |
| `publish.yml`    | **Release** GitHub créée         | Vérifie que le commit de release est sur `main`, exécute `prepublishOnly`, `npm publish`                                                                                             |

La publication nécessite le secret de dépôt `NPM_TOKEN`.

---

## Storybook

- **Framework :** `@storybook/react-vite`, stories sous `src/**/*.stories.tsx`.
- **Addon :** `@storybook/addon-a11y`.
- **`viteFinal` :** fusionne `base: './'` pour que les URL d’assets fonctionnent sous un sous-chemin (ex. `/repo/storybook/`). La limite d’avertissement de taille de chunk est relevée pour le gros bundle preview.

---

## Accessibilité

La bibliothèque vise des patterns orientés **WCAG 2.1 AA** :

- Sémantique `<dialog>` et fermeture clavier lorsque c’est activé
- Libellés, descriptions et erreurs branchés pour les technologies d’assistance
- Styles de focus visibles (`:focus-visible`)
- Contraste des couleurs et indices non exclusivement colorimétriques
- `prefers-reduced-motion` et préférences de thème respectés dans le CSS

Des retours a11y automatisés sont disponibles dans Storybook (addon accessibilité) ; les tests manuels lecteur d’écran et clavier restent importants pour les releases.
