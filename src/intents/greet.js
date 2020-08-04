const randomResponseFrom = require('../lib/randomElement.js');
const substitutions = require('../lib/substitutions.js');
const memory = require('../dao/memory.js');
const persist = require('../dao/persist.js');
const botNameQuestion = require('../../database/questions/botname.json');
const greet = {
  name: "greet",
  data: null,
  match: null,
  named: null,
  greet: null,
  key: null,
  match(v, user, db) {
    this.load(db);
    const str = v.toLowerCase().trim();
    if (this.data.entries[str]) {
      this.match = 'EXACT';
      this.key = str;
      return true;
    } else {
      for (let i = 0; i < this.data.regular_expression_entries.length; i++) {
        let reg = new RegExp(this.data.regular_expression_entries[i].value, "i");
        let match = str.match(reg);
        if (match) {
          if(this.data.regular_expression_entries[i].key === 'CORRECT_NAMED'){
            if(!this.sameName(match.groups.name)){
              continue;
            }
          }
          this.match = this.data.regular_expression_entries[i].key;
          this.named = match.groups.name;
          this.greet = match.groups.greet;
          this.key = i;
          return true;
        }
      }
      return false;
    }
  },
  process(v, user, db) {
    let response;
    if (this.match === 'EXACT') {
      response = randomResponseFrom(this.data.entries[this.key]);
      response = response.split(':TIME_GREET').join(this.getTimeGreet());
    } else if (this.match === 'CORRECT_NAMED') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':TIME_GREET').join(this.getTimeGreet());
    } else if (this.match === 'NAMED') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':NAME').join(this.named);
      this.setQuestion(this.named, user);
    } else if (this.match === 'NAMED_TIME') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':NAME').join(this.named);
      response = response.split(':TIME_GREET').join(this.getTimeGreet());
      this.setQuestion(this.named, user);
    }

    return {
      original: v,
      value: response,
      intent: 'greet',
      match_type: this.match,
      type: 'msg'
    }
  },
  setQuestion(name, user) {
    const m = memory.get(user);
    botNameQuestion.Y.persisted = [
      {
        "property": "BOT_NAME",
        "value": name
      }
    ];
    m.question = Object.values(botNameQuestion);
    substitutions.add(m.question, [{ "key": ":NAME", "value": name }]);
    memory.set(user, m);
  },
  getTimeGreet() {
    const h = (new Date()).getHours();
    if (h > 4 && h < 12) return "bom dia";
    if (h > 11 && h < 18) return "boa tarde";
    return "boa noite";
  },
  sameName(name){
    const current = persist.get('BOT_NAME');
    return current == name;
  },
  load(db) {
    if (!this.data) {
      const v = db.connector.prepare(db.model.intent.load).get({ "name": this.name });
      this.data = v && JSON.parse(v.data);
    }
  }
};
module.exports = greet;