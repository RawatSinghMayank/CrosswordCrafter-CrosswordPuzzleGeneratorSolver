# Migration Guide: Spring Boot to Node.js/Express

This guide documents the complete conversion of the crossword puzzle backend from Spring Boot (Java) to Node.js/Express (JavaScript).

## Overview

The entire backend has been converted from Java/Spring Boot to JavaScript/Node.js while maintaining full API compatibility with the existing React frontend.

## What Was Converted

### 1. Project Structure
- **Before**: Maven-based Spring Boot project
- **After**: npm-based Node.js project with Express

### 2. Dependencies
- **Spring Boot** → **Express.js**
- **Spring Data JPA** → **mysql2** (raw SQL queries)
- **Spring Web** → **Express** with CORS
- **Lombok** → Native JavaScript (no need for annotations)
- **JSON library** → Native JavaScript JSON

### 3. Database Layer
- **JPA Repositories** → Custom repository classes with mysql2
- **Entity annotations** → Plain JavaScript classes
- **Hibernate** → Direct SQL queries

### 4. API Endpoints
All endpoints maintain the same URL structure and response format:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/crossword/generate` | GET | Generate new crossword grids |
| `/api/crossword/random` | GET | Get random crossword grid |
| `/api/crossword/random/details` | GET | Get crossword with word details |
| `/api/crossword/random/clues` | GET | Get crossword with clues |
| `/api/crossword/solve/steps` | GET | SSE endpoint for step-by-step solving |
| `/health` | GET | Health check |

### 5. Key Components Converted

#### Models
- `CrosswordGrid.java` → `CrosswordGrid.js`
- `Trie.java` → `Trie.js`
- `DictionaryLoader.java` → `DictionaryLoader.js`
- `CrosswordGenerator.java` → `CrosswordGenerator.js`

#### Services
- `CrosswordService.java` → `CrosswordService.js`
- `CrosswordSolver.java` → `CrosswordSolver.js`

#### Repositories
- `CrosswordGridRepository.java` → `CrosswordGridRepository.js`

#### Utilities
- `CrosswordGridParser.java` → `CrosswordGridParser.js`
- `CrosswordClueBuilder.java` → `CrosswordClueBuilder.js`

#### Controllers
- `CrosswordController.java` → Express routes in `server.js`

## Key Differences

### 1. Language Features
- **Java annotations** → **JavaScript functions**
- **Lombok** → **Native JavaScript properties**
- **Generics** → **Dynamic typing**
- **Streams** → **Array methods**

### 2. Database Access
- **JPA/Hibernate** → **Raw SQL with mysql2**
- **Repository interfaces** → **Class-based repositories**
- **Entity relationships** → **Manual object mapping**

### 3. HTTP Handling
- **Spring MVC** → **Express.js**
- **@RestController** → **Express routes**
- **@CrossOrigin** → **CORS middleware**

### 4. Server-Sent Events
- **Spring SseEmitter** → **Express SSE implementation**
- **ExecutorService** → **Native JavaScript async/await**

## Setup Instructions

### 1. Install Dependencies
```bash
cd CrosswordFrontendBackend/backend
npm install
```

### 2. Database Setup
```bash
# Initialize database
npm run setup

# Or manually:
mysql -u root -p < database/init.sql
```

### 3. Configuration
Update `config.js` with your database credentials:
```javascript
module.exports = {
  database: {
    host: 'localhost',
    port: 3306,
    database: 'word_clue_db',
    user: 'root',
    password: 'your_password'
  }
};
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Testing

### 1. Health Check
```bash
curl http://localhost:8080/health
```

### 2. API Tests
```bash
npm test
```

### 3. Manual Testing
```bash
# Get random crossword
curl http://localhost:8080/api/crossword/random

# Get crossword details
curl http://localhost:8080/api/crossword/random/details

# Get crossword with clues
curl http://localhost:8080/api/crossword/random/clues
```

## File Structure Comparison

### Spring Boot Structure
```
crossword-solver/
├── src/main/java/com/crossword/
│   ├── controller/CrosswordController.java
│   ├── model/
│   ├── repository/
│   ├── service/
│   └── util/
├── src/main/resources/
└── pom.xml
```

### Node.js Structure
```
backend/
├── server.js
├── config.js
├── package.json
├── database/
│   ├── connection.js
│   └── init.sql
├── models/
├── repositories/
├── services/
├── utils/
├── resources/
└── scripts/
```

## Benefits of the Conversion

1. **Simplified Deployment**: No JVM required
2. **Faster Startup**: Node.js starts faster than Spring Boot
3. **Unified Language**: Frontend and backend both use JavaScript
4. **Easier Development**: Single language ecosystem
5. **Better Performance**: V8 engine optimizations
6. **Simpler Dependencies**: Fewer transitive dependencies

## Compatibility

The Node.js backend is 100% compatible with the existing React frontend. No changes are required to the frontend code.

## Migration Checklist

- [x] Convert all Java models to JavaScript
- [x] Convert all services to JavaScript
- [x] Convert repository layer to mysql2
- [x] Convert REST controller to Express routes
- [x] Implement Server-Sent Events
- [x] Copy dictionary resources
- [x] Set up database schema
- [x] Create configuration system
- [x] Add error handling
- [x] Create setup scripts
- [x] Add testing framework
- [x] Document the migration

## Notes

- The MySQL database schema remains unchanged
- All API endpoints maintain the same contract
- Server-Sent Events work identically to the Spring Boot version
- Dictionary files are copied to the resources directory
- CORS is configured for the React frontend
- Error handling follows Express.js patterns
