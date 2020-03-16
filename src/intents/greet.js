const randomResponseFrom = require('../lib/randomElement.js');
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
    } else if (this.match === 'NAMED') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':NAME').join(this.named);
    } else if (this.match === 'NAMED_TIME') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':NAME').join(this.named);
      response = response.split(':TIME_GREET').join(this.getTimeGreet());
    }
    response
    return {
      original: v,
      value: response,
      intent: 'greet',
      match_type: this.match,
      type: 'msg'
    }
  },
  getTimeGreet() {
    const h = (new Date()).getHours();
    if (h > 4 && h < 12) return "bom dia";
    if (h > 11 && h < 18) return "boa tarde";
    return "boa noite";
  },
  load(db) {
    if (!this.data) {
      const v = db.connector.prepare(db.model.intent.load).get({ "name": this.name });
      this.data = v && JSON.parse(v.data);
    }
  }
};
module.exports = greet;