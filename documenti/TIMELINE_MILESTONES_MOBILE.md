# 📅 TIMELINE & MILESTONES DETTAGLIATI

**Progetto:** SIMFITO Mobile App  
**Durata Totale:** 13 settimane (~3 mesi)  
**Team:** 1-2 sviluppatori  
**Data Inizio:** Febbraio 2026  
**Data Lancio Prevista:** Fine Aprile 2026

---

## 🎯 MILESTONES PRINCIPALI

```
FASE 1 (Sett 1-2)    FASE 2 (Sett 3-5)    FASE 3 (Sett 6-8)    FASE 4+ (Sett 9-13)
├─ MVP Setup        ├─ Search Core      ├─ Details & Nav    ├─ Maps & Offline
├─ Auth             ├─ Filters          ├─ Relations        ├─ Export/Reports
└─ Navigation       └─ Results          └─ Bookmarks        └─ Launch
```

---

## 📊 GANTT TIMELINE

```
SETTIMANA    1   2   3   4   5   6   7   8   9  10  11  12  13
FASE 1       [===]
FASE 2           [===========]
FASE 3                    [===========]
FASE 4                                [============]
TESTING                                            [===]
DEPLOYMENT                                              [===]

BLOCKERS CRITICI:
- Settimana 2: Backend API readiness
- Settimana 5: Design review
- Settimana 8: Performance optimization
- Settimana 12: App store submission
```

---

## FASE 1️⃣: MVP & SETUP (Settimane 1-2)

**Obiettivo:** App funzionante con login e navigazione di base  
**Team:** 1 dev senior  
**Deliverables:** MVP funzionante su device fisici

### Settimana 1: Foundation

#### Giorno 1-2: Repository & Setup
- [ ] Creare repository GitHub
- [ ] Clonare template Expo TypeScript
- [ ] Setup Node.js environment
- [ ] Install dipendenze principali
- [ ] Configure git workflow (main, dev, feature branches)
- [ ] Setup GitHub Projects board
- **Durata:** 1-2 giorni
- **Owner:** Lead Developer

#### Giorno 3-4: Architecture & Tooling
- [ ] Setup ESLint + Prettier
- [ ] Configure TypeScript strict mode
- [ ] Setup Husky pre-commit hooks
- [ ] Create base folder structure
- [ ] Setup absolute imports (path aliases)
- [ ] Configure Redux store
- **Durata:** 2 giorni
- **Owner:** Lead Developer

#### Giorno 5: Authentication Flow (Base)
- [ ] Design Auth state slice
- [ ] Create LoginScreen component
- [ ] Setup API client + auth endpoints
- [ ] JWT token storage (SecureStore)
- [ ] Auth navigation state
- [ ] Basic error handling
- **Durata:** 1 giorno
- **Owner:** Lead Developer

**TEST & VALIDATION (Giorno 5):**
- [ ] App avvia su Android emulator
- [ ] App avvia su iOS simulator
- [ ] Login screen visibile
- [ ] ESLint/TypeScript passan senza errori

---

### Settimana 2: Navigation & Components Base

#### Giorno 1-2: Root Navigation
- [ ] Create RootNavigator (Auth stack + App stack)
- [ ] Implement AuthNavigator (Login, Register)
- [ ] Implement AppNavigator (Tabs: Search, Detail, Maps, Settings)
- [ ] Deep linking setup
- [ ] Navigation type definitions
- **Durata:** 2 giorni
- **Owner:** Lead Developer

#### Giorno 3: Common Components
- [ ] Header component with theme toggle
- [ ] Button component (primary, secondary, variant)
- [ ] Card component
- [ ] SearchBar component
- [ ] Loading spinner
- [ ] Empty state component
- **Durata:** 1 giorno
- **Owner:** Lead Developer
- **Reqs:** Color/Typography tokens defined

#### Giorno 4: Theme & i18n Setup
- [ ] Design system: colors, typography, spacing
- [ ] Create theme provider
- [ ] Setup react-i18next
- [ ] Create locale files (IT, EN)
- [ ] Translation hooks
- **Durata:** 1 giorno
- **Owner:** Lead Developer

#### Giorno 5: Testing & Polish
- [ ] Unit tests per Redux slices
- [ ] Component snapshot tests
- [ ] Navigate tra screens
- [ ] Test logout flow
- [ ] Device testing (real device o simulator)
- **Durata:** 1 giorno
- **Owner:** Lead Developer

**MILESTONE 1 - MVP FUNZIONANTE:**
```
✅ App avvia su Android + iOS
✅ Navigation tra screens funziona
✅ Login/Logout implementato
✅ Redux store operativo
✅ Theme switching attivo
✅ 2 lingue supportate
✅ All tests passing
```

---

## FASE 2️⃣: SEARCH CORE (Settimane 3-5)

**Obiettivo:** Ricerca completa funzionante  
**Team:** 1-2 dev  
**Deliverables:** Search screen con filtri, paginazione, offline cache

### Settimana 3: Search API & State

#### Giorno 1: API Integration
- [ ] Setup Axios interceptors
- [ ] Create search API service (`src/services/api/search.ts`)
- [ ] Define search endpoint types
- [ ] Error handling standardizzato
- [ ] Implement retry logic
- [ ] Mock API per dev
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 2-3: Search Redux Slice
- [ ] Design search state structure
- [ ] Create `searchSlice.ts` con actions:
  - `setSearchQuery`
  - `setFilters`
  - `fetchSearchResults` (thunk)
  - `setPagination`
  - `clearSearch`
- [ ] Add loading/error states
- [ ] Implement search history reducer
- **Durata:** 2 giorni
- **Owner:** Dev 1

#### Giorno 4-5: SearchScreen Component
- [ ] Create SearchScreen.tsx layout
- [ ] Implement SearchBar input
- [ ] Loading state UI
- [ ] Results list (scroll)
- [ ] Error state UI
- [ ] Empty state UI
- **Durata:** 2 giorni
- **Owner:** Dev 1

**REVIEWS & TESTING (Giorno 5):**
- [ ] Code review PR
- [ ] Unit tests search reducer
- [ ] Integration test API calls

---

### Settimana 4: Filtering & Pagination

#### Giorno 1-2: Filter UI Components
- [ ] Create FilterScreen.tsx
- [ ] FilterPicker component (tipo, linguaggio, etc)
- [ ] Advanced filters modal
- [ ] Clear filters button
- [ ] Save filter presets
- **Durata:** 2 giorni
- **Owner:** Dev 1 o Dev 2

#### Giorno 3: Pagination Implementation
- [ ] Pagination reducer in searchSlice
- [ ] Infinite scroll / Load more button
- [ ] Scroll to top on filter change
- [ ] Pagination cache (store page 1, 2, etc)
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 4: Search Optimization
- [ ] Debouncing search input (300ms)
- [ ] Query caching (React Query oppure Redux)
- [ ] Prevent duplicate requests
- [ ] Search history localStorage
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 5: Polish & Testing
- [ ] Test filter combinations
- [ ] Test pagination edge cases
- [ ] Performance profiling (React DevTools)
- [ ] Accessibility audit (axe-react-native)
- **Durata:** 1 giorno
- **Owner:** Dev 1

---

### Settimana 5: Search Polish & Cache

#### Giorno 1: Offline Caching
- [ ] Setup AsyncStorage caching
- [ ] Cache search results
- [ ] Invalidate cache on filter change
- [ ] Display "offline" badge if using cache
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 2: Search History
- [ ] Save recent searches
- [ ] View search history screen
- [ ] Delete individual searches
- [ ] Search suggestions (autocomplete)
- **Durata:** 1 giorno
- **Owner:** Dev 2 (if available)

#### Giorno 3: Advanced Features
- [ ] Search by EPPO code
- [ ] Search by multiple languages
- [ ] Wildcard search
- [ ] Exact match option
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 4-5: QA & Optimization
- [ ] End-to-end testing search flow
- [ ] Memory leak testing (React Profiler)
- [ ] Network optimization (gzip, compression)
- [ ] UI performance: FPS consistency
- [ ] Device testing (low-end device compatibility)
- **Durata:** 2 giorni
- **Owner:** Both devs

**MILESTONE 2 - SEARCH FUNZIONANTE:**
```
✅ Search con 5+ filter criteri
✅ Paginazione works perfectly
✅ Offline caching attivo
✅ Search history completo
✅ 80%+ test coverage
✅ Performance: <300ms ricerca
✅ Device compatibility: Android 12+, iOS 14+
```

---

## FASE 3️⃣: DETAILS & NAVIGATION (Settimane 6-8)

**Obiettivo:** Visualizzazione dettagli completa con relazioni  
**Team:** 1-2 dev  
**Deliverables:** DetailScreen con tabs, relazioni, bookmarks

### Settimana 6: Detail Screen Base

#### Giorno 1: Detail API & State
- [ ] Detail API endpoint
- [ ] Detail reducer in Redux
- [ ] Fetch detail data on screen focus
- [ ] Error/loading states
- **Durata:** 1 giorno
- **Owner:** Dev 2

#### Giorno 2-3: DetailScreen Layout
- [ ] Create DetailScreen.tsx
- [ ] Header con title, EPPO code
- [ ] Tab navigation (Overview, Relations, Properties)
- [ ] ScrollView con content
- [ ] Share button
- [ ] Favorite button
- **Durata:** 2 giorni
- **Owner:** Dev 2

#### Giorno 4: Overview Tab
- [ ] Display basic properties
- [ ] Multiple language names
- [ ] Taxonomic info
- [ ] Authority references
- **Durata:** 1 giorno
- **Owner:** Dev 2

#### Giorno 5: Testing
- [ ] Navigate from search to detail
- [ ] Test tab switching
- [ ] Verify all data renders
- **Durata:** 1 giorno
- **Owner:** Dev 2

---

### Settimana 7: Relations & Bookmarks

#### Giorno 1-2: Relations Tab
- [ ] Fetch relations data (host, pest, etc)
- [ ] Display relations list
- [ ] Click relation → Navigate to detail
- [ ] Group by relation type
- [ ] Infinite scroll relations
- **Durata:** 2 giorni
- **Owner:** Dev 2

#### Giorno 3: Bookmarks System
- [ ] Create bookmarks Redux slice
- [ ] Save bookmark functionality
- [ ] Bookmarks screen
- [ ] Offline sync bookmarks
- [ ] Bookmark collections
- **Durata:** 1 giorno
- **Owner:** Dev 1 o Dev 2

#### Giorno 4: Back Navigation & Breadcrumb
- [ ] Create Breadcrumb component
- [ ] Back navigation stack
- [ ] Deep linking to detail from notification
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 5: Testing
- [ ] Test detail navigation flows
- [ ] Test bookmark persistence
- [ ] Performance test: loading times
- **Durata:** 1 giorno
- **Owner:** Both

---

### Settimana 8: Polish & Optimization

#### Giorno 1: Properties Tab
- [ ] Display all properties
- [ ] Formatted tables/lists
- [ ] Copy to clipboard
- [ ] Show references/sources
- **Durata:** 1 giorno
- **Owner:** Dev 2

#### Giorno 2: Animations & UX
- [ ] Transition animations (screens)
- [ ] Loading skeleton screens
- [ ] Pull-to-refresh detail
- [ ] Smooth scroll behavior
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 3: Cache Strategy
- [ ] Cache detail data
- [ ] Invalidate on swipe-refresh
- [ ] Manage memory (LRU cache)
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 4-5: QA & Testing
- [ ] Device testing
- [ ] Performance profiling
- [ ] Accessibility (a11y) audit
- [ ] Edge cases (empty data, errors)
- **Durata:** 2 giorni
- **Owner:** Both

**MILESTONE 3 - DETAILS FUNZIONANTE:**
```
✅ Detail screen completo
✅ 3+ tabs (Overview, Relations, Properties)
✅ Bookmarks working offline
✅ Navigation smooth e veloce
✅ All data visible and formatted well
✅ 75%+ test coverage details
✅ Performance: <500ms detail load
```

---

## FASE 4️⃣: GEODATA & MAPS (Settimane 9-10)

**Obiettivo:** Mappa funzionante con layer  
**Team:** 1-2 dev  
**Deliverables:** MapsScreen con layer control, query geospaziali

### Settimana 9: Maps Base

#### Giorno 1: Maps Setup
- [ ] Install `@react-native-maps/maps`
- [ ] Configure API keys (Google Maps, MapBox)
- [ ] Basic map component
- [ ] Location permissions setup
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 2-3: MapsScreen Component
- [ ] Create MapsScreen.tsx
- [ ] Map with markers
- [ ] Search location input
- [ ] Center map on location
- [ ] Zoom controls
- **Durata:** 2 giorni
- **Owner:** Dev 1

#### Giorno 4: Layer Control
- [ ] Create LayerToggle component
- [ ] Multiple layers (species, pest, etc)
- [ ] Toggle layer visibility
- [ ] Legend display
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 5: Testing
- [ ] Test map rendering
- [ ] Test layer toggle
- [ ] Performance: FPS on map
- **Durata:** 1 giorno
- **Owner:** Dev 1

---

### Settimana 10: Geospatial & Polish

#### Giorno 1-2: Geodata Visualization
- [ ] Load shapefile/GeoJSON data
- [ ] Display on map
- [ ] Color by property
- [ ] Popup on tap
- **Durata:** 2 giorni
- **Owner:** Dev 1

#### Giorno 3: Search Integration
- [ ] From search → go to maps
- [ ] Highlight result on map
- [ ] Query by location (reverse geocoding)
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 4: Performance & Caching
- [ ] Cache map tiles (offline)
- [ ] Optimize geodata loading
- [ ] Memory management
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 5: Testing & QA
- [ ] Device testing maps
- [ ] Offline map access
- [ ] Performance profiling
- **Durata:** 1 giorno
- **Owner:** Dev 1

**MILESTONE 4 - MAPS FUNZIONANTE:**
```
✅ Map displays and responsive
✅ Layer control working
✅ Geodata visible
✅ Offline maps (cached tiles)
✅ Location services integrated
✅ Performance acceptable (>30 FPS)
```

---

## FASE 5️⃣: EXPORT & OFFLINE (Settimane 11-12)

**Obiettivo:** Export e offline sync completi  
**Team:** 1-2 dev  
**Deliverables:** PDF/CSV export, SQLite offline DB, sync

### Settimana 11: Export Functionality

#### Giorno 1: PDF Export
- [ ] Setup react-native-pdf library
- [ ] Create PDF from search results
- [ ] Format results nicely
- [ ] Share PDF
- **Durata:** 1 giorno
- **Owner:** Dev 2

#### Giorno 2: CSV Export
- [ ] CSV generation from results
- [ ] Excel format (XLSX)
- [ ] Custom columns selector
- [ ] Share to cloud storage
- **Durata:** 1 giorno
- **Owner:** Dev 2

#### Giorno 3: Reports Screen
- [ ] Create ReportsScreen
- [ ] Recent exports list
- [ ] Download history
- [ ] Delete exports
- **Durata:** 1 giorno
- **Owner:** Dev 2

#### Giorno 4-5: SQLite Offline DB
- [ ] Setup expo-sqlite
- [ ] Create database schema
- [ ] Store search results locally
- [ ] Query local data when offline
- **Durata:** 2 giorni
- **Owner:** Dev 1

---

### Settimana 12: Offline Sync & Launch Prep

#### Giorno 1-2: Offline Sync
- [ ] Detect online/offline status
- [ ] Queue requests when offline
- [ ] Sync when back online
- [ ] Conflict resolution (if needed)
- [ ] Offline indicator UI
- **Durata:** 2 giorni
- **Owner:** Dev 1

#### Giorno 3: Settings Screen
- [ ] Language selection
- [ ] Theme (light/dark)
- [ ] Cache management
- [ ] Offline mode toggle
- [ ] App info & version
- **Durata:** 1 giorno
- **Owner:** Dev 2

#### Giorno 4: Bug Fixes & Polish
- [ ] Fix reported bugs
- [ ] Code cleanup
- [ ] Documentation update
- **Durata:** 1 giorno
- **Owner:** Both

#### Giorno 5: Staging Testing
- [ ] Full app testing
- [ ] Beta release to testers
- [ ] Collect feedback
- **Durata:** 1 giorno
- **Owner:** Both

**MILESTONE 5 - EXPORT & OFFLINE READY:**
```
✅ PDF export working
✅ CSV/Excel export ready
✅ SQLite offline DB syncing
✅ Offline mode fully functional
✅ Settings screen complete
✅ Bug-free ready for launch
```

---

## FASE 6️⃣: TESTING & DEPLOYMENT (Settimana 13)

**Obiettivo:** Production ready, live su app stores  
**Team:** 1-2 dev (+ QA if available)  
**Deliverables:** App su PlayStore + AppStore

### Settimana 13: Final Push

#### Giorno 1: App Signing & Build
- [ ] Create Android keystore
- [ ] Configure iOS certificates
- [ ] Build APK/AAB for Android
- [ ] Build IPA for iOS
- [ ] Test builds on real devices
- **Durata:** 1 giorno
- **Owner:** Dev 1

#### Giorno 2: PlayStore Submission
- [ ] Create PlayStore listing
- [ ] Upload build (AAB)
- [ ] Complete app metadata
- [ ] Screenshots & description
- [ ] Privacy policy link
- [ ] Submit for review
- **Durata:** 1 giorno
- **Owner:** Dev 1 + DevOps

#### Giorno 3: AppStore Submission
- [ ] Create AppStore listing
- [ ] Upload build (IPA)
- [ ] Complete app metadata
- [ ] Screenshots & description (iOS specific)
- [ ] Privacy policy
- [ ] Submit for review
- **Durata:** 1 giorno
- **Owner:** Dev 1 + DevOps

#### Giorno 4: Launch Monitoring
- [ ] Setup Sentry error tracking
- [ ] Setup analytics
- [ ] Monitor Crashlytics
- [ ] Check store reviews
- **Durata:** 1 giorno
- **Owner:** Dev 1 + DevOps

#### Giorno 5: Post-Launch Support
- [ ] Address review feedback (if rejected)
- [ ] Fix critical bugs (hotfix)
- [ ] Respond to user reviews
- [ ] Monitor performance
- **Durata:** 1 giorno
- **Owner:** Dev 1

**MILESTONE 6 - LAUNCH COMPLETE:**
```
✅ App live on PlayStore
✅ App live on AppStore
✅ Error monitoring active
✅ Monitoring setup
✅ Documentation complete
✅ Team trained on maintenance
```

---

## 📊 RESOURCE ALLOCATION

### Developer 1 (Lead)
- Weeks 1-2: Architecture, Auth, Navigation
- Weeks 3-5: Search API, Optimization
- Weeks 6-8: Details optimization
- Weeks 9-10: Maps implementation
- Weeks 11-12: Offline sync, deployment
- Weeks 13: App store submissions

### Developer 2 (Optional)
- Weeks 3-5: Filtering, Pagination
- Weeks 6-8: Details implementation
- Weeks 11-12: Export functionality, Settings
- Weeks 13: QA and final polish

### DevOps/QA (External)
- Weeks 1-2: CI/CD setup
- Weeks 9-13: Testing, deployment

---

## 🎯 DEFINITION OF DONE (DoD)

### Per ogni Giorno/Task:
- [ ] Code written (clean, commented)
- [ ] Unit tests passing (80%+ coverage)
- [ ] PR created and code reviewed
- [ ] No linting errors
- [ ] TypeScript strict mode passing
- [ ] Tested on Android emulator
- [ ] Tested on iOS simulator
- [ ] Device testing (if possible)
- [ ] Documentation updated

### Per ogni Settimana:
- [ ] All tasks completed
- [ ] All PRs merged
- [ ] Builds are passing
- [ ] Performance metrics acceptable
- [ ] No critical bugs open
- [ ] Demo to stakeholder (optional)

### Per ogni Milestone:
- [ ] All deliverables completed
- [ ] Full QA pass
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Stakeholder sign-off

---

## 🚨 RISK MANAGEMENT

| Risk | Probability | Impact | Mitigation |
|------|:---:|:---:|---|
| Backend API delay | Medium | High | Have mock API ready early |
| Performance issues | Medium | High | Profile weekly, optimize early |
| Design approval delays | Low | Medium | Get design approved Week 1 |
| Platform-specific bugs | Medium | Medium | Device testing from Week 1 |
| App Store rejection | Low | High | Follow guidelines, test early |

---

## 📱 DEVICE TESTING MATRIX

**Required Testing:**
```
┌─ Android
│  ├─ Emulator (Latest)
│  ├─ Real Device (Pixel 6)
│  └─ Low-end Device (Xiaomi)
│
└─ iOS
   ├─ Simulator (iPhone 15)
   ├─ Real Device (iPhone 13 Pro)
   └─ iPad (if time permits)
```

---

## ✅ GO/NO-GO CHECKLIST (Fine Settimana 12)

**MUST HAVE:**
- [ ] Search fully functional
- [ ] Details screen working
- [ ] No critical bugs
- [ ] <100ms average response time
- [ ] Offline mode works
- [ ] 75%+ code coverage

**SHOULD HAVE:**
- [ ] Maps functional
- [ ] Export working
- [ ] 85%+ code coverage
- [ ] Performance optimized

**NICE TO HAVE:**
- [ ] Bookmarks with collections
- [ ] Advanced search filters
- [ ] 90%+ code coverage

---

**Documento creato:** 9 Gennaio 2026  
**Ultimo aggiornamento:** 9 Gennaio 2026

---

## 📞 NEXT STEPS

1. **Review pianificazione** con il team
2. **Decidere team composition** (1 dev vs 2 dev)
3. **Setup repository GitHub**
4. **First meeting:** discutere design, API contracts
5. **Kick-off:** Lunedì prossimo (o data decisa)
6. **Begin Week 1:** Setup progetto
