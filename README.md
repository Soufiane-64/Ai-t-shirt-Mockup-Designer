# AI T-Shirt Mockup Designer

A React + TypeScript + Vite starter template customized for building an AI-powered T-Shirt Mockup Designer application. This project includes HMR, ESLint, Prettier, and opinionated conventions to help you scaffold and maintain a production-ready codebase.

---

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Available Scripts](#available-scripts)
6. [ESLint & Prettier Configuration](#eslint--prettier-configuration)
7. [Environment Variables](#environment-variables)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

* **React 18** with fast refresh via Vite
* **TypeScript** for static typing and improved developer experience
* **Vite** for lightning-fast builds and dev server
* **ESLint** + **Prettier** for consistent code style
* **Opinionated folder structure** for scalable projects

## Prerequisites

* Node.js >= 16.x
* npm >= 8.x or yarn >= 1.22

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<YOUR_GITHUB_ORG>/ai-tshirt-mockup-designer.git
cd ai-tshirt-mockup-designer
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open your browser at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

### 5. Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
├── public/                 # Public assets & static files
├── src/
│   ├── assets/             # Images, fonts, and static media
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page-level components
│   ├── services/           # API clients & AI integration code
│   ├── stores/             # State management (e.g., Zustand)
│   ├── styles/             # Global styles & variables
│   ├── utils/              # Utility functions and helpers
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entrypoint
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── README.md               # Project README (this file)
```

## Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start dev server with HMR      |
| `npm run build`   | Build for production           |
| `npm run preview` | Serve production build locally |
| `npm run lint`    | Run ESLint checks              |
| `npm run format`  | Format code with Prettier      |

## ESLint & Prettier Configuration

This template comes with a robust ESLint + Prettier setup:

* **Parser Options**: Supports type-aware linting by pointing to TypeScript configs.
* **Recommended Rulesets**:

  * `plugin:@typescript-eslint/recommended-type-checked`
  * `plugin:@typescript-eslint/strict-type-checked`
  * `plugin:react/recommended`
  * `plugin:react/jsx-runtime`

```js
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier'
  ],
  rules: {
    // Add project-specific rules here
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "semi": true
}
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_AI_API_URL=<YOUR_AI_API_URL>
VITE_S3_BUCKET=<YOUR_S3_BUCKET_NAME>
```

## Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider (e.g., Vercel, Netlify, AWS S3 + CloudFront).

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow the existing code style and ensure all checks pass.
