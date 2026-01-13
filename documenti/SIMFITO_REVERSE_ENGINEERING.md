# 🔍 REVERSE ENGINEERING - SIMFITO WEB APP

**Per:** Developer (tu!)  
**Obiettivo:** Capire come è costruita Simfito web per replicarla su React Native  
**Data:** 9 Gennaio 2026

---

## 📋 QUICK SUMMARY - ARCHITETTURA ATTUALE

```
┌────────────────────────────────┐
│   BROWSER (Client-Side)        │
├────────────────────────────────┤
│  ExtJS 6.6 (JavaScript)        │
│  - Framework MVC               │
│  - Sencha Cmd build tool       │
│  - 10K+ lines minified JS      │
└────────────────────────────────┘
           ↓ HTTP/Ajax
┌────────────────────────────────┐
│   PHP SERVER (Backend)         │
├────────────────────────────────┤
│  - Apache + PHP 7.x            │
│  - Services in /services/      │
│  - CRUD operations             │
│  - Geospatial queries          │
│  - Export (PDF, Excel)         │
└────────────────────────────────┘
           ↓ SQL
┌────────────────────────────────┐
│   MySQL Database               │
├────────────────────────────────┤
│  - simfito4 (production DB)    │
│  - 20+ tables                  │
│  - EPPO data                   │
│  - Geospatial data (PostGIS)   │
└────────────────────────────────┘
```

---

## 🏗️ ARCHITETTURA EXTJS (MVC PATTERN)

### 1. **Entry Point: index.html**

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>simfito</title>
    <!-- ExtJS framework loaded -->
    <!-- app.json config -->
    <script id="microloader">
      <!-- Microloader boots Ext.Boot -->
    </script>
  </head>
  <body></body>
</html>
```

**Come funziona:**
- Microloader carica `app.json`
- app.json specifica i JS/CSS da caricare
- framework.js contiene ExtJS core
- app.js contiene la logica dell'applicazione

### 2. **app.json - Configuration File**

```json
{
  "name": "SIMFito",
  "namespace": "SIMFito",
  "version": "1.0.0.0",
  "framework": "ext",
  "toolkit": "classic",
  "theme": "theme-triton",
  "js": [
    {"path": "framework.js"},           // ExtJS
    {"path": "resources/lib/openlayers/build/ol-debug.js"},  // Maps
    {"path": "resources/lib/map.js"},   // Map wrapper
    {"path": "resources/lib/lib.js"},   // Utilities
    {"path": "app.js"}                  // Main app logic
  ],
  "css": [
    {"path": "resources/SIMFito-all_1.css"},
    {"path": "resources/SIMFito-all_2.css"},
    {"path": "resources/custom.css"},
    {"path": "resources/lib/openlayers/css/ol.css"}
  ]
}
```

**Key points:**
- Specifica dipendenze (framework, tema, librerie)
- CSS e JS da caricare
- Cache configuration
- Theme configuration

### 3. **app.js - Main Application Logic**

```javascript
// Tipo di define che troverai:

// 1. Models
Ext.define('SIMFito.model.AbbattimentiModel', {
  extend: 'Ext.data.Model',
  alias: 'model.abbattimentimodel',
  fields: [
    {type: 'int', name: 'id'},
    {type: 'string', name: 'descrizione'},
    {type: 'date', name: 'date'},
    // ...
  ]
});

// 2. Stores (Data Management)
Ext.define('SIMFito.store.AbbattimentiStore', {
  extend: 'Ext.data.Store',
  model: 'SIMFito.model.AbbattimentiModel',
  proxy: {
    type: 'ajax',
    url: 'services/ajax.php?action=getAbbattimenti',
    reader: {
      type: 'json',
      rootProperty: 'records'
    }
  }
});

// 3. Views (UI Components)
Ext.define('SIMFito.view.abbattimenti.Grid', {
  extend: 'Ext.grid.Panel',
  xtype: 'abbattimenti-grid',
  store: 'AbbattimentiStore',
  columns: [
    {text: 'ID', dataIndex: 'id'},
    {text: 'Descrizione', dataIndex: 'descrizione'},
    {text: 'Data', dataIndex: 'date', xtype: 'datecolumn'}
  ]
});

// 4. Controllers (Business Logic)
Ext.define('SIMFito.controller.Abbattimenti', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.abbattimenti',
  
  init: function() {
    this.control({
      'abbattimenti-grid': {
        itemdblclick: 'onGridItemDblClick'
      }
    });
  },
  
  onGridItemDblClick: function(grid, record) {
    // Handle double click
  }
});
```

---

## 📡 BACKEND STRUCTURE (PHP Services)

### File Structure in `/services/`

```
services/
├── ajax.php              ← Main AJAX endpoint
├── crud.php              ← CRUD operations
├── export.php            ← PDF/Excel export
├── login.php             ← Authentication
├── proxy.php             ← Geospatial proxy
├── shape.php             ← Shapefile handling
└── ... 50+ more files
```

### How Backend Works

#### **1. ajax.php - Main Service Handler**

```php
<?php
require_once("../etc/db_config.php");
require_once("crud.php");

// Handles all AJAX requests
// Pattern: ?action=METHOD
// Returns JSON

// Example: GET /services/ajax.php?action=getAbbattimenti&limit=20&offset=0

function getAbbattimenti($limit, $offset) {
  global $db;
  
  $sql = "SELECT * FROM abbattimenti LIMIT $offset, $limit";
  $db->Read($sql);
  
  $result = [];
  while($row = $db->fetch_assoc()) {
    $result[] = $row;
  }
  
  return json_encode([
    'success' => true,
    'records' => $result,
    'total' => count($result)
  ]);
}

// Dispatch based on action
if(isset($_GET['action'])) {
  $action = $_GET['action'];
  call_user_func($action, $_GET);
}
```

#### **2. Request/Response Pattern**

**Frontend (ExtJS):**
```javascript
// Store proxy sends request
Ext.Ajax.request({
  url: 'services/ajax.php',
  params: {
    action: 'getAbbattimenti',
    limit: 20,
    offset: 0
  },
  success: function(response) {
    var data = Ext.decode(response.responseText);
    // Process data
  }
});
```

**Backend Response:**
```json
{
  "success": true,
  "records": [
    {"id": 1, "descrizione": "Test", "date": "2024-01-09"},
    {"id": 2, "descrizione": "Test 2", "date": "2024-01-10"}
  ],
  "total": 100
}
```

---

## 🎯 KEY ENDPOINTS

### Search/Query Endpoints

```
GET /services/ajax.php?action=search&query=pest&type=eppo
GET /services/ajax.php?action=getDetail&id=EPPO-001
GET /services/ajax.php?action=getRelations&id=EPPO-001&type=host
```

### Geospatial Endpoints

```
GET /services/proxy.php?action=getGeospatial&layer=griglia
GET /services/shape.php?action=getShapefile&name=grid10km
POST /services/ajax.php?action=queryByLocation&lat=45.5&lng=11.5
```

### Export Endpoints

```
GET /services/export.php?action=exportPDF&id=EPPO-001
GET /services/export.php?action=exportExcel&format=xlsx&ids=1,2,3
```

### Authentication

```
POST /services/login.php
  {username: "user", password: "pass"}
  Response: {token: "jwt-token", user: {...}}
```

---

## 🗂️ DATABASE SCHEMA (Key Tables)

### From README analysis:

```sql
-- EPPO Database
t_baycode      -- 127,456 EPPO codes
t_bayname      -- 514,570 Names (75 languages!)
t_baylink      -- 121,658 Taxonomic links
r_attack       -- 33,542 Pest-Host relations
r_path         -- 2,398 Pathways
t_authorities  -- 44,132 Authorities

-- Geospatial
griglia        -- Grid 10km shapefile
griglia_10km   -- Grid 10km
geodata        -- Various geodata layers

-- Application
users          -- User data
sessions       -- User sessions
reports        -- Saved reports
bookmarks      -- User bookmarks
```

---

## 🎮 UI FLOW / USER INTERACTION

### Main Screens in ExtJS App:

```
┌─ Main Window (Viewport)
│
├─ Top Toolbar
│  ├─ Search Box
│  ├─ Language Selector
│  └─ User Menu
│
├─ Left Sidebar (Navigation Panel)
│  ├─ Search Results Tree
│  └─ Bookmarks
│
├─ Center Panel (Main Content)
│  ├─ Tab 1: Search Results (Grid)
│  ├─ Tab 2: Detail View
│  ├─ Tab 3: Map View
│  └─ Tab 4: Reports
│
└─ Bottom Statusbar
   └─ Status messages
```

### Typical User Journey:

```
1. User types in search box
   ↓
2. onChange event → ajax call to /services/ajax.php?action=search
   ↓
3. Backend queries database → returns JSON
   ↓
4. ExtJS Store updates
   ↓
5. Grid panel refreshes with results
   ↓
6. User clicks row → Detail panel loads
   ↓
7. Another ajax call to /services/ajax.php?action=getDetail&id=X
   ↓
8. Detail panel renders data
   ↓
9. User clicks "Map" tab
   ↓
10. OpenLayers map loads with geodata
```

---

## 🔄 STATE MANAGEMENT (ExtJS Style)

**NO Redux/Redux pattern** - ExtJS uses:
- **Stores** for data management (like Redux stores)
- **Controllers** for business logic (like Redux actions)
- **Views** observe Stores via bindings

```javascript
// ExtJS State Management Flow:

// 1. Store holds data
store.load({
  params: {action: 'search', query: 'pest'}
});

// 2. Controller listens to store events
this.control({
  'grid': {
    select: 'onItemSelected',
    refresh: 'onStoreRefresh'
  }
});

// 3. View automatically updates when store changes
// (No manual setState needed)

// 4. Store updates view through bindings
var grid = Ext.ComponentQuery.query('grid[itemId=results]')[0];
grid.getStore().load();
// Grid automatically refreshes
```

---

## 🛠️ LIBRARIES USED

### Frontend

```javascript
// Ext JS 6.6.0
- Grid panels
- Tree views
- Tab panels
- Forms
- Charts
- Date pickers

// OpenLayers (Maps)
- ol.js - Vector and raster layers
- Map interactions
- Feature selection
- Layer management

// Custom Libraries
- lib.js - Utility functions
- map.js - Custom map wrapper
- JsBarcode.all.min.js - Barcode generation
- proj4.js - Projection transformations
```

### Backend

```php
// Database
- MySQL (with PostGIS for geospatial)
- PDO or custom DB wrapper

// Export
- FPDF (PDF generation)
- PHPExcel (Excel generation)
- xlsxwriter

// Email
- PHPMailer v2.3
- SOAP support

// File handling
- File upload handling
- Shapefile parsing
```

---

## 📊 DATA PATTERNS

### Grid Data Format

```json
{
  "success": true,
  "records": [
    {
      "id": "EPPO-001",
      "code": "EPPO001",
      "name": "Name in current language",
      "type": "pest",
      "description": "...",
      "taxonomic_info": {...},
      "authorities": [...]
    }
  ],
  "total": 1000
}
```

### Detail Data Format

```json
{
  "success": true,
  "item": {
    "id": "EPPO-001",
    "code": "EPPO001",
    "names": {
      "it": "Nome italiano",
      "en": "English name",
      "fr": "Nom français",
      // ... 75 languages
    },
    "taxonomy": {
      "kingdom": "...",
      "phylum": "...",
      // ...
    },
    "relations": {
      "hosts": [
        {"id": "EPPO-002", "name": "Host plant"}
      ],
      "pests": [
        {"id": "EPPO-003", "name": "Pest"}
      ]
    },
    "authorities": {...},
    "references": [...]
  }
}
```

### Geospatial Data Format

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[45.5, 11.5], ...]]
      },
      "properties": {
        "istat": "...",
        "comune": "...",
        "provincia": "..."
      }
    }
  ]
}
```

---

## 🔐 AUTHENTICATION

### Current System

```javascript
// ExtJS form submission to login.php
Ext.Ajax.request({
  url: 'services/login.php',
  method: 'POST',
  params: {
    username: username,
    password: password
  },
  success: function(response) {
    var data = Ext.decode(response.responseText);
    if(data.success) {
      // Store token
      sessionStorage.setItem('token', data.token);
      // Redirect to main app
    }
  }
});
```

### Token Storage

```javascript
// Stored in sessionStorage or localStorage
{
  "token": "...",
  "user_id": 1,
  "username": "user",
  "role": "admin"
}
```

### API Authentication

```php
// Each request checks token
if(!isset($_GET['token']) || !validateToken($_GET['token'])) {
  die(json_encode(['error' => 'Unauthorized']));
}
```

---

## 📱 WHAT TO REPLICATE FOR MOBILE

### ✅ MUST HAVE (Same behavior)

1. **Search functionality**
   - Multi-field search
   - Filtering (type, language, etc)
   - Pagination
   - Result caching

2. **Detail view**
   - All properties
   - Relations (host/pest)
   - Multi-language display
   - References

3. **Maps**
   - Geospatial data visualization
   - Layer control
   - Location-based search

4. **Export**
   - PDF generation
   - CSV/Excel export

5. **Authentication**
   - Login
   - Token management
   - User session

### ✅ CAN IMPROVE FOR MOBILE

1. **Offline support**
   - SQLite caching (not in web version)
   - Offline search
   - Sync when online

2. **Performance**
   - Better caching strategy
   - Lazy loading
   - Virtual scrolling for large lists

3. **UX**
   - Touch optimized
   - Gesture support
   - Better loading states

4. **Features**
   - Bookmarks/Favorites
   - Search history
   - Push notifications

---

## 🎯 IMPLEMENTATION MAP: ExtJS → React Native

| ExtJS Concept | React Native Equivalent |
|---------------|------------------------|
| Store | Redux store or React Query |
| Model | TypeScript interface/type |
| View (Grid) | FlatList + Component |
| View (Panel) | View container |
| Controller | Custom hooks |
| Binding | useSelector/useState |
| Ajax.request | axios/fetch |
| EventBus | Redux actions/events |
| Router | React Navigation |
| Theme | React Native Paper theme |

---

## 📋 AUDIT CHECKLIST

When building mobile, verify:

- [ ] Search returns same data format as web
- [ ] Detail page shows all web fields
- [ ] Relations display correctly (host/pest)
- [ ] Multi-language support (75 languages!)
- [ ] Same database queries (optimize if needed)
- [ ] Export format matches web version
- [ ] Authentication uses same endpoints
- [ ] Offline caching strategy defined
- [ ] Performance baseline established
- [ ] Error handling matches web behavior

---

## 🚀 STARTING POINT FOR YOUR CODE

### Structure you should follow:

```typescript
// Similar to ExtJS structure

// 1. Types/Models (like Ext.define models)
src/types/eppo.ts

// 2. API Service (like ajax.php endpoints)
src/services/api/search.ts
src/services/api/detail.ts
src/services/api/geospatial.ts

// 3. Data Layer (like Stores)
src/store/slices/searchSlice.ts
src/store/slices/detailSlice.ts

// 4. UI Components (like Views)
src/screens/SearchScreen.tsx
src/screens/DetailScreen.tsx
src/screens/MapsScreen.tsx

// 5. Business Logic (like Controllers)
src/hooks/useSearch.ts
src/hooks/useDetail.ts
src/hooks/useGeospatial.ts
```

---

## 🔗 API ENDPOINTS TO REPLICATE

Create these endpoints or use existing:

```
GET /services/ajax.php?action=search
  Params: query, type, language, limit, offset
  Returns: {records: [], total: N}

GET /services/ajax.php?action=getDetail
  Params: id
  Returns: {item: {...full data...}}

GET /services/ajax.php?action=getRelations
  Params: id, type (host/pest)
  Returns: {relations: [...]}

GET /services/proxy.php?action=getGeospatial
  Params: layer, bounds
  Returns: GeoJSON

POST /services/login.php
  Body: {username, password}
  Returns: {token, user}

GET /services/export.php
  Params: action (exportPDF/exportExcel), id
  Returns: File download
```

---

## 💡 KEY TAKEAWAY

**Simfito web è un classic ExtJS MVC app** che:
- ✅ Talks to PHP backend via AJAX
- ✅ Renders grids, forms, panels
- ✅ Manages state via Stores
- ✅ Has clear separation: UI (View), Logic (Controller), Data (Store+Model)

**For React Native, replicate the same:**
- ✅ API calls to same PHP endpoints
- ✅ State management (Redux instead of Stores)
- ✅ Component hierarchy (screens + components)
- ✅ Business logic (custom hooks instead of Controllers)

---

**Documento creato:** 9 Gennaio 2026  
**Status:** Ready to code! 🚀
