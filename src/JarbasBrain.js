const databaseConnector = require('../database/db.js');
const intentModel = require('../database/model/intent.json');
const memoryModel = require('../database/model/memory.json');
const intents = require('./intents');
const db = {
  "connector": databaseConnector.getDataBase(),
  "model": {
    "intent": intentModel,
    "memory": memoryModel
  }
};
const brain = {
  user: null,
  train() {
    const trainer = require('./trainer');
    trainer.connector=db.connector;
    trainer.createTables();
    trainer.populate();
  },
  debug(value){
   databaseConnector.verbose = value;
   db.connector = databaseConnector.getDataBase();
  },
  process(v) {
    for (let i = 0; i < intents.data.length; i++) {
      if (intents.data[i].match(v, this.user, db)) {
        return intents.data[i].process(v, this.user, db);
      };
    }
    return {
      value: v,
      type: 'msg'
    };
  },
  setUser(u) {
    this.user = u;
  }
};
module.exports = brain;