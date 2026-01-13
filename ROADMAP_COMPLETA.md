# 📋 ROADMAP COMPLETA - SimFito Mobile App

## 🎯 Obiettivo
Creare una mobile app che rispecchi tutte le funzionalità della web app simfito.org per Android/iOS/Web.

---

## 📊 FEATURE IMPLEMENTATE ✅

### 1. **Autenticazione & Profilo**
- ✅ Login con credenziali database
- ✅ Token persistence (AsyncStorage)
- ✅ Profilo utente (visualizzazione dati)
- ✅ Logout
- ✅ Settings (lingua, tema, dark mode)

### 2. **Ricerca EPPO**
- ✅ Ricerca Pest/Organism (mode=parassitinew)
- ✅ Visualizzazione risultati
- ✅ Dettagli pest (schermata modale)

### 3. **Schede (Forms)**
- ✅ Lista schede dell'utente (mode=app_schede)
- ✅ Visualizzazione dettagli scheda completi
- ✅ Status badge (In attesa, Completata, Rigettata, etc.)
- ✅ Informazioni localizzazione (azienda, sito, comune)
- ✅ Data sopralluogo
- ✅ Motivo visita
- ✅ Risultati rilevamenti (positivi, catture, allegati)

---

## 🚀 FEATURE DA IMPLEMENTARE (PRIORITÀ ALTA)

### 4. **Osservazioni (Pest Observations)**
- [ ] Lista osservazioni dell'utente (mode=osservazioni)
- [ ] Filtri per pest, stato, data
- [ ] Dettagli osservazione
- [ ] Statistiche (numero catture, percentuale positivi)
- [ ] Storico rilevamenti
- [ ] Export/condivisione dati

### 5. **Siti & Aziende (Locations)**
- [ ] Lista aziende/siti dell'utente (mode=siti, mode=aziende)
- [ ] Map view con localizzazione siti
- [ ] Dettagli sito (indirizzo, contatti, tipo coltura)
- [ ] Schede associate a un sito
- [ ] Modifica sito/azienda

### 6. **Piante Ospiti (Host Plants)**
- [ ] Ricerca piante ospiti (mode=hosts)
- [ ] Dettagli pianta (descrizione, sinonimi, famiglia)
- [ ] Relazioni pest-host (quali pest colpiscono quale pianta)
- [ ] Informazioni coltura

### 7. **Malattie & Patologie (Diseases)**
- [ ] Ricerca malattie/funghi/batteri
- [ ] Dettagli malattia (sintomi, ciclo biologico)
- [ ] Relazioni con host e pest
- [ ] Informazioni EPPO

### 8. **Relazioni & Tassonomia**
- [ ] Pest → Host relations explorer (mode=pest_host)
- [ ] Hierarchical navigation (Ordine → Famiglia → Specie)
- [ ] Codici EPPO
- [ ] Nomi comuni vs scientifici

### 9. **Campioni & Test (Samples)**
- [ ] Liste campioni raccolti (mode=tipocampione)
- [ ] Storico laboratorio (quali test fatti)
- [ ] Risultati analisi
- [ ] Documento del campione

### 10. **Referti (Reports)**
- [ ] Generazione referti PDF
- [ ] Firma digitale
- [ ] Invio via email
- [ ] Storico referti (mode=referti)
- [ ] Condivisione con cliente

---

## 🔧 FEATURE TECNICHE DA IMPLEMENTARE (PRIORITÀ MEDIA)

### 11. **Offline Support**
- [ ] Sync dati quando online
- [ ] Caching locale con SQLite
- [ ] Queue per upload dati offline
- [ ] Indicatore status sync

### 12. **Notifiche**
- [ ] Push notifications
- [ ] Reminder per schede scadute
- [ ] Allarmi pest critici
- [ ] Notifiche di aggiornamento

### 13. **Mappe & Geolocalizzazione**
- [ ] Map view con siti geo-localizzati
- [ ] GPS per nuovi rilevamenti
- [ ] Navigation to site
- [ ] Area de ripresa (polygon display)

### 14. **Reporting & Analytics**
- [ ] Dashboard con statistiche personali
- [ ] Grafici (pest più frequenti, trend temporali)
- [ ] Report excel/pdf generati
- [ ] KPI tracciamento

### 15. **Collaborazione**
- [ ] Condivisione schede con colleghi
- [ ] Commenti su osservazioni
- [ ] Assegnazione task
- [ ] Timeline di attività

---

## 📱 INTERFACCIA UTENTE (PRIORITÀ MEDIA)

### 16. **Navigation & Layout**
- ✅ Tab bar (Ricerca, Schede, Settings)
- [ ] Drawer menu per navigazione secondaria
- [ ] Breadcrumbs per context
- [ ] Quick actions FAB

### 17. **Dark Mode**
- ✅ Toggle theme
- [ ] Persistence preferenza utente
- [ ] Theme consistency ovunque
- [ ] AMOLED optimization

### 18. **Accessibilità**
- [ ] Screen reader support
- [ ] Font size adjustment
- [ ] High contrast mode
- [ ] Haptic feedback

### 19. **Localizzazione (i18n)**
- [ ] Supporto italiano (default)
- [ ] Supporto inglese
- [ ] Traduzioni complete
- [ ] Date/number formatting locali

### 20. **Onboarding**
- [ ] Tutorial iniziale
- [ ] Tooltips contestuali
- [ ] Guida features principali
- [ ] Demo mode

---

## 🔌 INTEGRAZIONI BACKEND (PRIORITÀ BASSA)

### 21. **Integrazione EPPO**
- [ ] Sync EPPO database
- [ ] Codici standardizzati
- [ ] Aggiornamenti periodici
- [ ] Fallback offline EPPO

### 22. **Integrazione SMS/Email**
- [ ] Invio risultati via SMS/Email
- [ ] Notifiche CLI
- [ ] Template report customizzabili
- [ ] Tracking delivery

### 23. **Integrazione Fotocamera**
- [ ] Scatta foto pest/danni
- [ ] Galleria allegate a osservazione
- [ ] Compressione auto
- [ ] Metadati (GPS, timestamp)

### 24. **API Meteo**
- [ ] Dati meteo sito
- [ ] Previsioni
- [ ] Correlazione con pest
- [ ] Alert meteo

### 25. **Sincronizzazione dati**
- [ ] Backup to cloud
- [ ] Sync tra dispositivi
- [ ] Versioning dati
- [ ] Conflict resolution

---

## 🧪 TESTING & QUALITÀ (PRIORITÀ BASSA)

### 26. **Testing**
- [ ] Unit tests (Redux, utils)
- [ ] Integration tests (API)
- [ ] E2E tests (user flows)
- [ ] Visual regression tests

### 27. **Performance**
- [ ] Optimizzazione bundle size
- [ ] Lazy loading screens
- [ ] Image optimization
- [ ] Memory management

### 28. **Security**
- [ ] SSL/TLS pinning
- [ ] Encryption credenziali
- [ ] Rate limiting client
- [ ] Input validation/sanitization

### 29. **Analytics & Logging**
- [ ] Crash reporting
- [ ] User behavior analytics
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

### 30. **CI/CD**
- [ ] GitHub Actions workflow
- [ ] Automated testing
- [ ] EAS Build integration
- [ ] Automated releases

---

## 📈 STIMA EFFORT

| Categoria | # Features | Effort (ore) | Status |
|-----------|-----------|------------|--------|
| Auth & Core | 3 | 8 | ✅ DONE |
| Ricerca & Dettagli | 2 | 12 | ✅ DONE |
| Schede | 1 | 8 | ✅ DONE |
| Osservazioni | 1 | 12 | 🔄 NEXT |
| Locations | 1 | 16 | ⏳ TODO |
| EPPO Relations | 4 | 24 | ⏳ TODO |
| Offline & Sync | 1 | 20 | ⏳ TODO |
| Maps | 1 | 16 | ⏳ TODO |
| UI/UX | 5 | 20 | ⏳ TODO |
| Testing | 4 | 32 | ⏳ TODO |
| **TOTALE** | **23** | **168 ore** | - |

---

## 🎬 NEXT STEPS (Fasi di sviluppo)

### **Fase 1: MVP Core** ✅ (COMPLETATO)
- [x] Autenticazione
- [x] Ricerca EPPO
- [x] Schede
- [x] Profilo

### **Fase 2: Ricerca Avanzata** (CURRENT)
- [ ] Osservazioni
- [ ] Siti & Aziende
- [ ] Filtri avanzati
- [ ] Statistiche

### **Fase 3: Esploratore EPPO**
- [ ] Piante ospiti
- [ ] Relazioni Pest-Host
- [ ] Malattie
- [ ] Tassonomia gerarchica

### **Fase 4: Features Avanzate**
- [ ] Offline support
- [ ] Mappe
- [ ] Reporting PDF
- [ ] Notifiche

### **Fase 5: Ottimizzazione & Launch**
- [ ] Testing completo
- [ ] Performance tuning
- [ ] Security audit
- [ ] Release production

---

## 🔗 API ENDPOINTS DISPONIBILI

Sono stati identificati i seguenti endpoint nel backend:

```
AUTENTICAZIONE:
- POST /login.php (login)

RICERCA & EPPO:
- GET /ajax.php?mode=parassitinew (search pests)
- GET /ajax.php?mode=organisms (organismi)
- GET /ajax.php?mode=hosts (piante ospiti)
- GET /ajax.php?mode=pests (tutti i pest)
- GET /ajax.php?mode=plant (singola pianta)
- GET /ajax.php?mode=pest_host (relazioni)

DATI UTENTE:
- GET /ajax.php?mode=app_schede (schede utente)
- GET /ajax.php?mode=scheda (singola scheda)
- GET /ajax.php?mode=osservazioni (osservazioni)
- GET /ajax.php?mode=osservazionicatture (catture)

LOCATIONS:
- GET /ajax.php?mode=siti (siti)
- GET /ajax.php?mode=aziende (aziende)
- GET /ajax.php?mode=sitiall (tutti siti)
- GET /ajax.php?mode=aziendeall (tutte aziende)

DATI SUPPORTO:
- GET /ajax.php?mode=comuni (comuni)
- GET /ajax.php?mode=province (province)
- GET /ajax.php?mode=motivoVisita (tipi visita)
- GET /ajax.php?mode=userInfo (info utente)
- GET /ajax.php?mode=referti (report)

TOTALE: 50+ endpoints disponibili
```

---

## 💡 Suggerimenti per continuare

1. **Consiglio immediato**: Implementare Osservazioni (Priority 4) perché è il cuore dell'app
2. **Veloce win**: Aggiungere Siti con mini-mappa
3. **Value aggiunto**: Implementare offline support e sync
4. **Polish finale**: Mappe interattive e reporting PDF

---

**Documento aggiornato**: 9 Gennaio 2026  
**Versione**: 1.0  
**Status**: In Sviluppo - MVP ✅ Complete, Fase 2 🔄 In Progress
