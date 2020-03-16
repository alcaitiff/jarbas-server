const fs = require('fs');
const db = require('../database/db.js');
const ddl = require('../database/model/ddl.json');
const intent = require('../database/model/intent.json');
const files = fs.readdirSync('../database/intents');

const trainer = {
  createTables() {
    ddl.forEach(v => db.prepare(v).run());
  },
  populate() {
    files.forEach((f) => {
      const file = JSON.parse(fs.readFileSync('../database/intents/' + f), 'utf8');
      this.importFile(file);
    });
  },
  importFile(f) {
    db.prepare(intent.clear).run({ "name": f.name });
    const stm = db.prepare(intent.insert);
    stm.run({ "name": f.name, "data": JSON.stringify(f.data) });
  }
};
module.exports = trainer;