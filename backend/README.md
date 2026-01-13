# SimFito Mobile Backend

Backend PHP per l'app mobile SimFito. Comunica con il database `simfito4` su `192.168.1.19`.

## 📋 Requisiti

- PHP 7.4+
- PostgreSQL (connessione a 192.168.1.19:5432)
- php-pgsql extension

## 🚀 Avvio

### Linux/macOS

```bash
cd SimfitoMobile
chmod +x start-backend.sh
./start-backend.sh
```

Oppure manualmente:

```bash
cd backend
php -S localhost:8000
```

### Windows

```bat
cd SimfitoMobile
start-backend.bat
```

Oppure da PowerShell:

```powershell
cd backend
php -S localhost:8000
```

## 🔌 Endpoint Disponibili

Una volta avviato il server, gli endpoint sono:

- **Login**: `POST http://localhost:8000/services/login.php`
  - Parametri: `loginUsername`, `loginPassword`

- **Ricerca**: `GET http://localhost:8000/services/ajax.php?mode=codici&query=...&idUser=0`
  - Ritorna dati EPPO dal database

## ⚙️ Configurazione

Il file `etc/db_config.php` è già configurato per puntare a:
- **Host**: 192.168.1.19
- **Database**: simfito4
- **User**: postgres
- **Password**: ariespac3

## 📝 Struttura

```
backend/
├── services/
│   ├── login.php          # Autenticazione
│   ├── ajax.php           # API principale
│   ├── crud.php           # Operazioni DB
│   └── ... (altri servizi)
├── etc/
│   └── db_config.php      # Configurazione DB
└── uploads/               # Directory per upload (se usato)
```

## 🐛 Debug

Se vedi errori di connessione:

1. Verifica che PostgreSQL sia raggiungibile:
   ```bash
   psql -h 192.168.1.19 -U postgres -d simfito4
   ```

2. Controlla i log PHP:
   ```bash
   tail -f /var/log/php-error.log
   ```

3. Accedi direttamente all'API via browser:
   ```
   http://localhost:8000/services/ajax.php?mode=test
   ```
