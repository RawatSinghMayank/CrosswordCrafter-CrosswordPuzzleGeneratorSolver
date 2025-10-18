const axios = require('axios');

class CrosswordClueBuilder {
  // Fetch a single definition from dictionary API
  static async getClue(word) {
    try {
      const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
      const response = await axios.get(apiURL);
      
      if (response.status !== 200) return 'No clue found';
      
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first.meanings && first.meanings.length > 0) {
          const definitions = first.meanings[0].definitions;
          if (definitions && definitions.length > 0) {
            return definitions[0].definition;
          }
        }
      }
      return 'No clue found';
    } catch (error) {
      console.error('Error fetching clue:', error);
      return 'No clue found';
    }
  }

  // Main method to extract horizontal & vertical words + clues
  static async extractWordsWithClues(gridStr) {
    const rows = gridStr.trim().split('\n');
    const numRows = rows.length;
    const numCols = rows[0].length;

    const grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
      grid[i] = rows[i].split('');
    }

    const gridLines = [];
    const horizontalClues = new Map();
    const verticalClues = new Map();

    // Horizontal
    for (const row of grid) {
      const word = row.join('');
      gridLines.push(word);
      horizontalClues.set(word, await this.getClue(word));
    }

    // Vertical
    for (let col = 0; col < numCols; col++) {
      let sb = '';
      for (let row = 0; row < numRows; row++) {
        sb += grid[row][col];
      }
      const word = sb;
      verticalClues.set(word, await this.getClue(word));
    }

    const result = {
      grid: gridLines,
      horizontal: Object.fromEntries(horizontalClues),
      vertical: Object.fromEntries(verticalClues)
    };

    return result;
  }
}

module.exports = CrosswordClueBuilder;
