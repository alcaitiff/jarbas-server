const randomResponseFrom = require('../lib/randomElement.js');
const listIntents = {
  name: "listIntents",
  info:{
    label:"Apresentar as ações que sou capaz de executar",
    example:"quais comandos você consegue realizar",
    hidden:false
  },
  data: null,
  match: null,
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
          this.match = this.data.regular_expression_entries[i].key;
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
    } else if (this.match === 'LIST_INTENTS') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':INTENTS').join(this.getIntents());
    } 
    return {
      original: v,
      value: response,
      intent: this.name,
      match_type: this.match,
      type: 'msg'
    }
  },
  getIntents() {
    let data='';
    const intent_list = require('../intents');
    for (let i = 0; i < intent_list.data.length; i++) {
      if (intent_list.data[i].info && !intent_list.data[i].info.hidden) {
        data+=intent_list.data[i].info.label+"\n\tExemplo: "+intent_list.data[i].info.example+"\n";
      };
    }
    return data;
  },
  load(db) {
    if (!this.data) {
      const v = db.connector.prepare(db.model.intent.load).get({ "name": this.name });
      this.data = v && JSON.parse(v.data);
    }
  }
};
module.exports = listIntents;