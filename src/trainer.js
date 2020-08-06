const fs = require('fs');
const ddl = require('../database/model/ddl.json');
const intent = require('../database/model/intent.json');
const files = fs.readdirSync('../database/intents');

const trainer = {
  connector:null,
  createTables() {
    ddl.forEach(v => connector.prepare(v).run());
  },
  populate() {
    files.forEach((f) => {
      const file = JSON.parse(fs.readFileSync('../database/intents/' + f), 'utf8');
      this.importFile(file);
    });
  },
  importFile(f) {
    connector.prepare(intent.clear).run({ "name": f.name });
    const stm = connector.prepare(intent.insert);
    stm.run({ "name": f.name, "data": JSON.stringify(f.data) });
  }
};
module.exports = trainer;