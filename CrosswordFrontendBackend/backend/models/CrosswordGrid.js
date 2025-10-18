class CrosswordGrid {
  constructor(grid = null) {
    this.id = null;
    this.grid = grid;
  }

  // Static method to create from database row
  static fromDbRow(row) {
    const grid = new CrosswordGrid(row.grid);
    grid.id = row.id;
    return grid;
  }

  // Method to convert to database format
  toDbFormat() {
    return {
      grid: this.grid
    };
  }
}

module.exports = CrosswordGrid;
