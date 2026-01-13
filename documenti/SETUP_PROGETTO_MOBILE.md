# 🗂 STRUTTURA PROGETTO + SETUP INIZIALE

**Framework Scelto:** React Native + Expo  
**Linguaggio:** TypeScript  
**Data:** 9 Gennaio 2026

---

## 📁 ARCHITETTURA DIRECTORY

```
simfito-mobile/
│
├── 📁 app/                           # App principale
│   ├── 📁 src/
│   │   ├── 📁 screens/              # Screen componenti
│   │   │   ├── Auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── Search/
│   │   │   │   ├── SearchScreen.tsx
│   │   │   │   ├── FilterScreen.tsx
│   │   │   │   └── SearchHistoryScreen.tsx
│   │   │   ├── Detail/
│   │   │   │   ├── DetailScreen.tsx
│   │   │   │   ├── RelationsTab.tsx
│   │   │   │   └── PropertiesTab.tsx
│   │   │   ├── Maps/
│   │   │   │   ├── MapsScreen.tsx
│   │   │   │   └── LayerControl.tsx
│   │   │   ├── Reports/
│   │   │   │   ├── ReportsScreen.tsx
│   │   │   │   └── ExportScreen.tsx
│   │   │   ├── Settings/
│   │   │   │   └── SettingsScreen.tsx
│   │   │   └── Tabs/
│   │   │       └── TabNavigator.tsx
│   │   │
│   │   ├── 📁 components/          # Reusable componenti
│   │   │   ├── Common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── Chip.tsx
│   │   │   │   └── Loading.tsx
│   │   │   ├── Search/
│   │   │   │   ├── SearchResultItem.tsx
│   │   │   │   ├── FilterPicker.tsx
│   │   │   │   └── AdvancedFilters.tsx
│   │   │   ├── Detail/
│   │   │   │   ├── RelationsList.tsx
│   │   │   │   ├── PropertyList.tsx
│   │   │   │   └── Breadcrumb.tsx
│   │   │   └── Maps/
│   │   │       ├── MapMarker.tsx
│   │   │       ├── LayerToggle.tsx
│   │   │       └── MapLegend.tsx
│   │   │
│   │   ├── 📁 services/           # API & external services
│   │   │   ├── api/
│   │   │   │   ├── client.ts       # Axios instance
│   │   │   │   ├── endpoints.ts    # API endpoints
│   │   │   │   ├── auth.ts         # Auth endpoints
│   │   │   │   ├── search.ts       # Search endpoints
│   │   │   │   ├── detail.ts       # Detail endpoints
│   │   │   │   └── maps.ts         # Geospatial endpoints
│   │   │   ├── storage/
│   │   │   │   ├── sqlite.ts       # SQLite DB
│   │   │   │   └── asyncStorage.ts # Secure storage
│   │   │   ├── export/
│   │   │   │   ├── pdf.ts          # PDF generation
│   │   │   │   └── csv.ts          # CSV export
│   │   │   ├── geolocation.ts      # Location services
│   │   │   └── notifications.ts    # Push notifications
│   │   │
│   │   ├── 📁 store/               # Redux Toolkit
│   │   │   ├── index.ts            # Store config
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── searchSlice.ts
│   │   │   │   ├── detailSlice.ts
│   │   │   │   ├── settingsSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   └── hooks.ts            # Custom hooks (useAppDispatch, etc)
│   │   │
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useSearch.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useLanguage.ts
│   │   │   └── useOfflineSync.ts
│   │   │
│   │   ├── 📁 utils/               # Utility functions
│   │   │   ├── constants.ts
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   ├── debounce.ts
│   │   │   └── logger.ts
│   │   │
│   │   ├── 📁 types/               # TypeScript types
│   │   │   ├── index.ts
│   │   │   ├── api.ts
│   │   │   ├── models.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── 📁 navigation/          # Navigation config
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── LinkingConfiguration.ts
│   │   │   └── navigationTypes.ts
│   │   │
│   │   ├── 📁 theme/               # Design system
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   ├── theme.ts
│   │   │   └── styles.ts
│   │   │
│   │   ├── 📁 locale/              # i18n translations
│   │   │   ├── i18n.ts
│   │   │   ├── 📁 locales/
│   │   │   │   ├── it.json         # Italiano
│   │   │   │   ├── en.json         # English
│   │   │   │   └── [75 more...]    # EPPO languages
│   │   │   └── useLanguage.ts
│   │   │
│   │   ├── App.tsx                 # Root component
│   │   └── index.tsx               # Entry point
│   │
│   ├── app.json                    # Expo config
│   ├── babel.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── 📁 docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── API.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT.md
│
├── 📁 tests/                        # Test files (mirror src structure)
│   ├── screens/
│   ├── components/
│   ├── services/
│   ├── store/
│   └── hooks/
│
├── .gitignore
├── .env.example
├── README.md
└── CHANGELOG.md
```

---

## 📦 PACKAGE.JSON INIZIALE

```json
{
  "name": "simfito-mobile",
  "version": "0.1.0",
  "description": "SIMFITO Mobile App - EPPO Database Management",
  "main": "expo-router/entry",
  "homepage": "https://simfito.org",
  "scripts": {
    "start": "expo start",
    "web": "expo start --web",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "build:both": "eas build --platform all",
    "submit": "eas submit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "0.73.2",
    "expo": "^51.0.0",
    "expo-router": "^3.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "^3.27.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-reanimated": "^3.6.1",
    "react-native-safe-area-context": "^4.7.2",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "@tanstack/react-query": "^5.28.0",
    "axios": "^1.6.2",
    "react-native-paper": "^5.12.0",
    "react-native-vector-icons": "^10.0.0",
    "@react-native-maps/maps": "^1.11.1",
    "react-native-maps": "^1.11.1",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "expo-sqlite": "^13.4.0",
    "expo-file-system": "^16.0.0",
    "expo-sharing": "^13.0.0",
    "expo-auth-session": "^5.4.0",
    "expo-secure-store": "^13.0.0",
    "expo-localization": "^14.8.0",
    "i18next": "^23.7.5",
    "react-i18next": "^13.5.0",
    "date-fns": "^2.30.0",
    "zod": "^3.22.4",
    "sentry-expo": "^8.4.0",
    "@sentry/react-native": "^5.11.0",
    "victory-native": "^36.9.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-native": "^0.72.8",
    "typescript": "^5.3.2",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "eslint": "^8.54.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.0",
    "@testing-library/jest-native": "^5.4.3",
    "detox": "^20.13.1",
    "detox-cli": "^20.13.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "expo-dev-client": "^3.3.0"
  },
  "private": true,
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

---

## ⚙️ CONFIGURAZIONE CHIAVE

### app.json (Expo Config)

```json
{
  "expo": {
    "name": "SIMFITO Mobile",
    "slug": "simfito-mobile",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "org.simfito.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "org.simfito.mobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermissions": "Allow SIMFITO to access your location"
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow SIMFITO to access your camera"
        }
      ]
    ],
    "extra": {
      "apiUrl": "https://api.simfito.org",
      "environment": "production"
    }
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "jsx": "react-jsx",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@screens/*": ["./src/screens/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@store/*": ["./src/store/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@hooks/*": ["./src/hooks/*"]
    }
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

---

## 🔧 SETUP COMANDI

### 1. Creare il progetto
```bash
# Installa Expo CLI
npm install -g expo-cli

# Crea progetto Expo con TypeScript
npx create-expo-app simfito-mobile --template

# Oppure usa il template TypeScript direttamente
npx create-expo-app@latest --template expo-template-default simfito-mobile
```

### 2. Installa dipendenze
```bash
cd simfito-mobile

# Installa tutte le dipendenze
npm install

# Setup Expo
expo prebuild --clean
```

### 3. Setup TypeScript
```bash
# Crea tsconfig.json
npx tsc --init

# Installa dipendenze TypeScript
npm install --save-dev typescript @types/react @types/react-native
```

### 4. Setup ESLint + Prettier
```bash
npm install --save-dev eslint prettier eslint-config-prettier
npx eslint --init
```

### 5. Setup Husky (pre-commit hooks)
```bash
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run lint:fix && npm run format"
```

### 6. Setup Jest + Testing
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
npx jest --init
```

### 7. Setup Sentry (Error Tracking)
```bash
npm install sentry-expo @sentry/react-native

# Configura account Sentry
npx sentry-cli login
npx sentry releases files upload-sourcemaps .
```

### 8. Setup EAS Build (Deployment)
```bash
npm install --global eas-cli
eas login
eas build:configure
```

---

## 🚀 QUICK START SCRIPT

```bash
#!/bin/bash
# setup.sh

echo "🎯 Setting up SIMFITO Mobile..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Create env file
echo "🔧 Creating .env file..."
cp .env.example .env

# 3. Run TypeScript check
echo "✅ Type checking..."
npm run type-check

# 4. Create database schema
echo "🗄️  Initializing database..."
# npm run init-db

# 5. Start dev server
echo "🎬 Starting Expo..."
npm start

echo "✅ Setup complete! Press 'a' for Android, 'i' for iOS, or 'w' for web."
```

---

## 🎨 DESIGN TOKENS

### Colors
```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#1976D2',
  secondary: '#424242',
  success: '#4CAF50',
  warning: '#FB8C00',
  danger: '#D32F2F',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#BDBDBD',
};
```

### Typography
```typescript
// src/theme/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: 'bold', lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  body1: { fontSize: 16, lineHeight: 24 },
  body2: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
};
```

---

## ✅ PRE-LAUNCH CHECKLIST

- [ ] Repository GitHub creato
- [ ] Environment variables configurati
- [ ] Database locale (SQLite) setup
- [ ] API client testato
- [ ] Authentication flow completato
- [ ] Search screen funzionante
- [ ] CI/CD pipeline configurato (GitHub Actions)
- [ ] Device testing (iPhone 12+, Android 12+)
- [ ] Sentry project creato
- [ ] App signing certificates
- [ ] EAS Build configurato
- [ ] Privacy policy + T&C pronte
- [ ] Localization (almeno EN + IT)

---

**Documento creato:** 9 Gennaio 2026
