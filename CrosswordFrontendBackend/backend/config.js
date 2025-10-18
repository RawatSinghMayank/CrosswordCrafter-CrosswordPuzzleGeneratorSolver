module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'word_clue_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mayank@2446'
  },
  server: {
    port: process.env.PORT || 8080,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  }
};
