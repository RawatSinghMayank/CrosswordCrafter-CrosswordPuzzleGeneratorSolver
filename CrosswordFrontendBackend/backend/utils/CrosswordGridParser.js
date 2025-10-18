class CrosswordGridParser {
  static extractWords(gridStr) {
    const rows = gridStr.trim().split('\n');
    const numRows = rows.length;
    const numCols = rows[0].length;

    const grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
      grid[i] = rows[i].split('');
    }

    const horizontalWords = [];
    const verticalWords = [];

    // Extract horizontal words
    for (const row of grid) {
      horizontalWords.push(row.join(''));
    }

    // Extract vertical words
    for (let col = 0; col < numCols; col++) {
      let sb = '';
      for (let row = 0; row < numRows; row++) {
        sb += grid[row][col];
      }
      verticalWords.push(sb);
    }

    const result = {
      grid: horizontalWords, // The actual grid (as a list of strings, row-wise)
      horizontal: horizontalWords,
      vertical: verticalWords
    };
    return result;
  }
}

module.exports = CrosswordGridParser;
