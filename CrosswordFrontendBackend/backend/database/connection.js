const mysql = require('mysql2/promise');
const config = require('../config');

let connection;

const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });
  }
  return connection;
};

const closeConnection = async () => {
  if (connection) {
    await connection.end();
    connection = null;
  }
};

module.exports = {
  getConnection,
  closeConnection
};
