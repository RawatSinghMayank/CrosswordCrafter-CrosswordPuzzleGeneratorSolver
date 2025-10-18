const { getConnection } = require('../database/connection');
const CrosswordGrid = require('../models/CrosswordGrid');

class CrosswordGridRepository {
  async save(grid) {
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO crossword_grid (grid) VALUES (?)',
      [grid.grid]
    );
    return result.insertId;
  }

  async findById(id) {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM crossword_grid WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? CrosswordGrid.fromDbRow(rows[0]) : null;
  }

  async count() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM crossword_grid');
    return rows[0].count;
  }

  async findRandomGrid() {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM crossword_grid ORDER BY RAND() LIMIT 1'
    );
    return rows.length > 0 ? CrosswordGrid.fromDbRow(rows[0]) : null;
  }

  async findAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM crossword_grid');
    return rows.map(row => CrosswordGrid.fromDbRow(row));
  }
}

module.exports = CrosswordGridRepository;
