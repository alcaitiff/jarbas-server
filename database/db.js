const Database = require('better-sqlite3');
const db = new Database(
  '../database/memory.sqlite3',
  {
    //verbose: console.log
    verbose: null
  }
);
module.exports = db;