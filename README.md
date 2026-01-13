# 📱 SimFito Mobile - App React Native

Applicazione mobile per la ricerca e consultazione di dati EPPO (pest, piante, malattie) del database Simfito.

## ✨ Features

✅ **Autenticazione** - Login con credenziali database Simfito  
✅ **Ricerca** - Ricerca pest/piante/malattie da EPPO  
✅ **Dettagli** - Visualizza info complete e tassonomia  
✅ **Offline-ready** - Backend incluso nel progetto  
✅ **Cross-platform** - iOS, Android, Web  
✅ **Multi-lingua** - Supporto nomi in diverse lingue  

## 🧪 Testing Guide

### Credenziali di Test
- **Username**: `fortunamiele`
- **Password**: `fortuna`
- **User ID**: 259
- **Type**: Tecnico URCOFI

### Test Flow
1. **Login** → Inserisci credenziali e premi login
2. **Search** → Vai al tab Explore, scrivi almeno 3 caratteri (prova "aut", "daf", "pir")
3. **Details** → Clicca su un risultato per vederlo a schermo intero
4. **Settings** → Visualizza profilo utente e logout
5. **Logout** → Clicca "Logout" in Settings per tornare al login

### Backend Endpoints
- `POST /services/login.php` - Autenticazione
  - Parametri: `loginUsername`, `loginPassword`, `mode=simfito`
  - Ritorna: `{success: true, id, nome, tipo, provincia, tipotecnico}`

- `GET /services/ajax.php?mode=parassitinew&query=...` - Ricerca Pest
  - Parametri: `mode=parassitinew`, `query=<search_string>`
  - Ritorna: `{data: [...], results: N, success: true}`

## 🔧 Tecnologie

| Tool | Versione | Uso |
|------|----------|-----|
| React Native | 0.81.5 | Framework mobile |
| Expo Router | ^2.0 | Routing |
| Redux Toolkit | ^2.11.2 | State management |
| Axios | Latest | HTTP client |
| TypeScript | ^5 | Type safety |
| PHP | 7.4+ | Backend |
| PostgreSQL | 13+ | Database |

## 📁 Struttura

```
├── app/                  # Routes e layout (Expo Router)
├── src/
│   ├── components/       # Componenti UI
│   ├── screens/          # Schermate
│   ├── services/api/     # Client API
│   ├── store/            # Redux (auth, search, detail)
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions
├── backend/              # Backend PHP (INCLUSO)
│   ├── services/         # API endpoints
│   └── etc/              # Configurazione DB
└── package.json
```

## 🔌 Tech Stack

- **Framework**: React Native + Expo Router
- **State**: Redux Toolkit
- **HTTP**: Axios
- **Storage**: AsyncStorage
- **Backend**: PHP + PostgreSQL
- **Database**: Simfito4 (schema eppo)

## 📚 Documentazione

- [SETUP.md](./SETUP.md) - Setup completo e troubleshooting
- [backend/README.md](./backend/README.md) - Docs backend
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Specifiche API

## 🔑 Credenziali Test

```
Username: fortunamiele
Password: fortuna

Username: francesco.nugnes
Password: anagrus82

Username: laurafiglioli
Password: laura
```

## 🔄 Flusso App

1. **Login** → Autenticazione con DB Simfito
2. **Home/Search** → Ricerca pest/piante/malattie
3. **Detail** → Info complete e tassonomia
4. **Settings** → Profilo utente e logout

## 🛠️ Sviluppo

### Development
```bash
npm start          # Expo dev server
npm run start:backend  # PHP server
```

### Lint
```bash
npm run lint
```

## 🌍 Deployment

Backend incluso nel progetto → Indipendenza totale da server esterno!

Quando rilasci ai consorzi:
1. Backend in `backend/` è completamente funzionante
2. Punta a `simfito4@192.168.1.19` come fonte dati
3. Build APK/IPA con `eas build`

---

**Made with ❤️ for Simfito**
