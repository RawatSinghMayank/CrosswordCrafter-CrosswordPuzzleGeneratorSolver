const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

// Import services
const CrosswordService = require('./services/CrosswordService');
const CrosswordSolver = require('./services/CrosswordSolver');
const CrosswordGridParser = require('./utils/CrosswordGridParser');
const CrosswordClueBuilder = require('./utils/CrosswordClueBuilder');

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'resources')));

// Initialize services
const crosswordService = new CrosswordService();
let randomFinalGrid = null;

// Routes
app.get('/api/crossword/generate', async (req, res) => {
  try {
    const grids = await crosswordService.generateCrosswords();
    res.json(grids);
  } catch (error) {
    console.error('Error generating crosswords:', error);
    res.status(500).json({ error: 'Failed to generate crosswords' });
  }
});

app.get('/api/crossword/random', (req, res) => {
  const grid = randomFinalGrid;
  res.json(grid || 'No grids available in the database.');
});

app.get('/api/crossword/random/details', (req, res) => {
  const grid = randomFinalGrid;
  if (!grid) {
    res.json({ message: 'No grids available in the database.' });
    return;
  }
  const result = CrosswordGridParser.extractWords(grid);
  res.json(result);
});

app.get('/api/crossword/random/clues', async (req, res) => {
  try {
    const grid = await crosswordService.getRandomGrid();
    randomFinalGrid = grid;
    if (!grid) {
      res.json({ message: 'No grids available in the database.' });
      return;
    }
    const result = await CrosswordClueBuilder.extractWordsWithClues(grid);
    res.json(result);
  } catch (error) {
    console.error('Error getting random crossword with clues:', error);
    res.status(500).json({ error: 'Failed to get crossword with clues' });
  }
});

// SSE endpoint for solving with steps
app.get('/api/crossword/solve/steps', (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': config.server.corsOrigin,
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // 1) Get random crossword details
    const details = CrosswordGridParser.extractWords(randomFinalGrid);
    const horizontalWords = details.horizontal;
    const verticalWords = details.vertical;

    // 2) Combine and shuffle words
    const allWords = [...horizontalWords, ...verticalWords];
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }

    // 3) Create initial empty grid (5x5)
    const initialGrid = Array(5).fill(null).map(() => Array(5).fill('-'));

    // 4) Set up solver
    const solver = new CrosswordSolver();
    solver.setSize(5);

    // 5) Listener for solver updates
    const listener = {
      onStep: (grid, stepIndex, action) => {
        try {
          // Convert grid to array of strings
          const gridState = grid.map(row => row.join(''));

          // Prepare event data
          const event = {
            grid: gridState,
            step: stepIndex,
            action: action
          };

          // Send SSE event
          sendEvent(event);

          if (action === 'solved') {
            res.end();
          }
        } catch (error) {
          console.error('Error in solver step:', error);
          res.end();
        }
      }
    };

    // 6) Start solving
    solver.crosswordPuzzle(initialGrid, allWords, listener);

  } catch (error) {
    console.error('Error in solve steps:', error);
    res.end();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Crossword backend server running on port ${PORT}`);
  console.log(`CORS enabled for: ${config.server.corsOrigin}`);
});

module.exports = app;
