# SimFito Mobile - Guida Rapida

## 🚀 Setup

```bash
npm install
npx expo start
```

## 🔑 Login

L'app è connessa al backend vero di **simfito.org**. Usa credenziali del database:

**Server**: http://192.168.1.19
**Database**: simfito
**Schema**: eppo, public

## 📱 Flusso App

### 1. **Login Screen** 
- Inserisci username e password dal database Simfito
- Credenziali salvate in AsyncStorage
- Auto redirect alle tabs se già loggato

### 2. **Search Tab** (Home)
- Ricerca pest/piante/malattie
- Minimo 3 caratteri
- Debounce 500ms
- Risultati da db `eppo`

### 3. **Detail Screen**
- Info complete dell'elemento
- Tassonomia (class, order, family, genus, species)
- Relazioni e note

### 4. **Settings Tab**
- Info utente
- Logout

## 🔌 API Endpoints Used

**POST `/services/login.php`**
```
loginUsername=...&loginPassword=...
```

**GET `/services/ajax.php?mode=codici&query=...&idUser=0`**
- Ricerca elementi
- Dettaglio elemento (filtra per codice)

## 📊 Database Structure

Usa il database **eppo** dello schema `simfito`:
- `codici` - Tabella principale (id, code, name, type)
- `names` - Nomi multilingue
- `taxonomy` - Informazioni tassonomiche
- `relations` - Relazioni tra elementi

## 🧪 Testing

1. Apri Expo Go
2. Scannerizza QR code
3. Login con credenziali reali
4. Cerca un elemento (es: "pest", "host", "disease")
5. Clicca per vedere i dettagli

## 📝 Note

- Token salvato in AsyncStorage
- Auto-persists login
- Logout rimuove token e torna a login
- Errori mostrati in UI con messaggi descrittivi
