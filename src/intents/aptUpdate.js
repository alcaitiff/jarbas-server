const randomResponseFrom = require('../lib/randomElement.js');
const exec = require('child_process').exec;
const aptUpdate = {
  name: "aptUpdate",
  info:{
    label:"Atualiza o sistema através do APT",
    example:"atualize o sistema",
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
    } else if (this.match === 'UPDATE') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':UPDATE').join(this.update());
    } 
    return {
      original: v,
      value: response,
      intent: this.name,
      match_type: this.match,
      type: 'msg'
    }
  },
  update() {
    const data="Realizarei a atualização em um terminal paralelo";
    try{
      exec('x-terminal-emulator -e "sudo apt -y update&&sudo apt -y upgrade&&sudo apt -y autoremove"').toString();
    }catch(e){
      return e;
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
module.exports = aptUpdate;