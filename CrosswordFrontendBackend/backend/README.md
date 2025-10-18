# Crossword Backend - Node.js/Express

This is the Node.js/Express version of the crossword puzzle backend, converted from the original Spring Boot Java application.

## Features

- REST API for crossword generation and solving
- Server-Sent Events (SSE) for real-time solving visualization
- MySQL database integration
- Dictionary-based word generation
- Crossword clue generation using external API

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MySQL database:
   - Create a MySQL database named `word_clue_db`
   - Run the initialization script: `mysql -u root -p < database/init.sql`
   - Update database credentials in `config.js` if needed

3. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

- `GET /api/crossword/generate` - Generate new crossword grids
- `GET /api/crossword/random` - Get a random crossword grid
- `GET /api/crossword/random/details` - Get random crossword with word details
- `GET /api/crossword/random/clues` - Get random crossword with clues
- `GET /api/crossword/solve/steps` - SSE endpoint for step-by-step solving
- `GET /health` - Health check endpoint

## Configuration

Update `config.js` to modify:
- Database connection settings
- Server port
- CORS origins

## Project Structure

```
backend/
├── config.js                 # Configuration settings
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── database/
│   ├── connection.js         # Database connection
│   └── init.sql             # Database initialization
├── models/                   # Data models
│   ├── Trie.js
│   ├── CrosswordGrid.js
│   ├── DictionaryLoader.js
│   └── CrosswordGenerator.js
├── repositories/             # Data access layer
│   └── CrosswordGridRepository.js
├── services/                # Business logic
│   ├── CrosswordService.js
│   └── CrosswordSolver.js
├── utils/                   # Utility functions
│   ├── CrosswordGridParser.js
│   └── CrosswordClueBuilder.js
└── resources/               # Static resources
    └── dictionaries/        # Dictionary files
```

## Development

The server runs on port 8080 by default and includes CORS support for the frontend running on localhost:5173.

## Notes

This Node.js version maintains full compatibility with the original Spring Boot API, ensuring seamless integration with the existing React frontend.
