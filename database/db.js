const Database = require('better-sqlite3');
const db = {
  verbose:console.log,
  path:'../database/memory.sqlite3',
  getDataBase(){
    return new Database(this.path,{verbose: this.verbose});  
  }
};
module.exports = db;