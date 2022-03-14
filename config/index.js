const path = require('path');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
  db: {
    dialect: 'sqlite',
    dialectModule: sqlite3,
    database: 'node-sequelize',
    storage: path.resolve(__dirname, '../database.sqlite'),
    logging: false,
  },
  admin: {
    username: 'admin',
    password: 'admin',
  },
};
