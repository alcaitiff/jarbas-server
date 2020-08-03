const randomResponseFrom = require('../lib/randomElement.js');
const substitutions = require('../lib/substitutions.js');
const memory = require('../dao/memory.js');
const persist = require('../dao/persist.js');
const context = {
  name: "context",
  data: null,
  context: null,
  matchType:null,
  match(v, user, db) {
    this.load(db, user);
    const str = v.toLowerCase().trim();
    if (this.context && this.context.question) {
      for (let i = 0; i < this.context.question.length; i++) {
        let reg = new RegExp(this.context.question[i].value, "i");
        let match = str.match(reg);
        if (match) {
          this.key = i;
          this.matchType = 'EXACT';
          return true;
        }
      }
    }
    return false;
  },
  process(v, user, db) {
    if(this.key){
      const q = this.context.question[this.key];
      q.persisted.forEach(e => persist.set(e.property, e.value));
      const response = randomResponseFrom(q.responses);
      //clear context
      memory.clear(user);
      return {
        original: v,
        value: substitutions.do(q.substitutions, response),
        intent: this.name,
        match_type: this.matchType,
        type: 'msg'
      }
    }
  },
  load(db, user) {
    if (!this.data) {
      const d = db.connector.prepare(db.model.intent.load).get({ "name": this.name });
      this.data = d && JSON.parse(d.data);
    }
    this.context = memory.get(user);
  }
};
module.exports = context;