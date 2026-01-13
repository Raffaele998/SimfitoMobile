# 🚀 SimFito Mobile - Setup Completo

## 📋 Struttura Progetto

```
SimfitoMobile/
├── backend/                    # Backend PHP (NUOVO!)
│   ├── services/              # API PHP
│   ├── etc/db_config.php       # Config DB (aggiustato)
│   └── README.md               # Docs backend
├── app/                        # App React Native
├── src/                        # Logica app
├── package.json                # Dipendenze + script
├── start-backend.sh            # Script avvio backend (Linux/Mac)
├── start-backend.bat           # Script avvio backend (Windows)
└── README.md                   # Este file
```

## ⚙️ Setup Iniziale

```bash
npm install
```

## 🚀 Avvio (3 step)

### Step 1️⃣: Backend PHP
In un **terminale separato**:

**Linux/macOS:**
```bash
./start-backend.sh
```

**Windows:**
```bash
start-backend.bat
```

**Oppure diretto:**
```bash
php -S localhost:8000 --chdir ./backend
```

✅ Vedi: `✔ Development Server running on http://localhost:8000`

### Step 2️⃣: Expo Mobile
In un **altro terminale**:

```bash
npm start
```

✅ Vedi il QR code e le opzioni (a = Android, i = iOS, w = Web)

### Step 3️⃣: Testa l'App
- **Android/iOS**: Scansiona il QR con Expo Go
- **Web**: Premi `w` (ha CORS dal backend locale)

## 🔐 Login

Usa una di queste credenziali:

| Username | Password |
|----------|----------|
| `francesco.nugnes` | `anagrus82` |
| `fortunamiele` | `fortuna` |
| `laurafiglioli` | `laura` |

## 🔄 Flusso

1. **Login Screen** → Entra con credenziali
2. **Search Tab** → Ricerca pest/piante (min 3 caratteri)
3. **Dettagli** → Clicca su un risultato
4. **Settings** → Vedi profilo, logout

## 🌍 Connessioni

```
┌──────────────┐
│ SimfitoApp   │
│  (React Na)  │
└──────────┬───┘
           │
           │ http://localhost:8000
           ▼
┌──────────────────┐
│ Backend PHP      │
│  (local port)    │
└──────────┬───────┘
           │
           │ TCP 5432
           ▼
┌──────────────────────────┐
│ PostgreSQL 192.168.1.19  │
│ Database: simfito4       │
│ Schema: simfito, eppo    │
└──────────────────────────┘
```

## 📝 File Importanti

- `src/services/api/client.ts` → Config URL backend
- `backend/etc/db_config.php` → Config database
- `src/store/slices/authSlice.ts` → Login logic
- `src/store/slices/searchSlice.ts` → Search logic

## 🆘 Troubleshooting

### "Cannot connect to localhost:8000"
- ✅ Backend avviato? Controlla il terminale del backend
- ✅ Porta 8000 libera? `lsof -i :8000`

### "Database connection failed"
- ✅ PostgreSQL raggiungibile? `psql -h 192.168.1.19 -U postgres`
- ✅ Credenziali giuste in `backend/etc/db_config.php`?

### "CORS Error" (solo su web)
- ✅ Backend ha CORS abilitato nel config
- ✅ Controlla `header()` in `backend/etc/db_config.php`

### "Login Failed"
- ✅ Credenziali corrette?
- ✅ User "validated" nel DB?

## 🎯 Production Deployment

Quando rilasci ai consorzi:
1. Cambia `localhost:8000` a URL server reale
2. Aggiusta `src/services/api/client.ts` per puntare a production
3. Deploy backend su server web (Apache, Nginx, etc)
4. Build APK/IPA con il nuovo endpoint

---

**Fatto! 🎉 Backend integrato e indipendente!**
