# API Endpoints Documentation

## Database Connection
- **Host**: 192.168.1.19
- **Database**: simfito
- **Schema**: eppo

## Required Endpoints

### 1. Authentication

#### POST `/services/login.php`
Login con username e password

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2. Search

#### GET `/services/ajax.php?action=search&query=string&limit=20&token=token`
Cerca pest, piante, malattie nello schema EPPO

**Query Parameters:**
- `action`: "search"
- `query`: search string (min 3 chars)
- `limit`: number (default: 20)
- `token`: auth token (optional, from AsyncStorage)

**Response (Success):**
```json
{
  "success": true,
  "records": [
    {
      "id": "12345",
      "code": "ERWCAM",
      "name": "Erwinia carotovora",
      "type": "pest|plant|disease",
      "description": "Brief description"
    }
  ],
  "total": 150
}
```

### 3. Detail

#### GET `/services/ajax.php?action=getDetail&id=string&token=token`
Ottiene i dettagli completi di un elemento

**Query Parameters:**
- `action`: "getDetail"
- `id`: element id
- `token`: auth token (optional)

**Response (Success):**
```json
{
  "success": true,
  "item": {
    "id": "12345",
    "code": "ERWCAM",
    "name": "Erwinia carotovora",
    "type": "pest",
    "description": "Full description",
    "names": {
      "it": "Batterio della muffa molle",
      "en": "Soft rot bacterium",
      "es": "Bacteria blanda"
    },
    "taxonomy": {
      "class": "Gamma Proteobacteria",
      "order": "Enterobacteriales",
      "family": "Enterobacteriaceae",
      "genus": "Erwinia",
      "species": "carotovora"
    },
    "relations": {
      "host_plants": ["Potato", "Tomato"],
      "symptoms": ["Wilting", "Stem rot"],
      "control_methods": ["Chemical", "Cultural"]
    }
  }
}
```

## Notes
- All endpoints should accept a `token` parameter for authentication
- Token is passed as query parameter (from AsyncStorage interceptor)
- Return 401 if token is invalid or expired
- Search query must be minimum 3 characters
