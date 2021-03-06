const randomResponseFrom = require('../lib/randomElement.js');
const execSync = require('child_process').execSync;
const historySearch = {
  name: "historySearch",
  info:{
    label:"Buscar comandos no histórico do shell",
    example:"procure no meu historico git clone",
    hidden:false
  },
  data: null,
  match: null,
  needle:null,
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
          this.needle = match.groups.needle;
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
    } else if (this.match === 'HISTORY_SEARCH') {
      response = randomResponseFrom(this.data.regular_expression_entries[this.key].responses);
      response = response.split(':HISTORY').join(this.getHistory(this.needle));
    } 
    return {
      original: v,
      value: response,
      intent: this.name,
      match_type: this.match,
      type: 'msg'
    }
  },
  getHistory(needle) {
    let data;
    try{
      const shell= execSync('echo -n $SHELL').toString();
      const bin= execSync('echo -n $(basename $SHELL)').toString();
      if(bin=="zsh"){
        data = execSync('export HISTSIZE=50000;export HISTFILE=~/.$(basename $SHELL)_history; fc -R;fc -l 1|grep "'+needle+'"',{"shell":shell}).toString();
      }else{
        data = execSync('export HISTFILE=~/.$(basename $SHELL)_history; set -o history;history|grep "'+needle+'"',{"shell":shell}).toString();
      }
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
module.exports = historySearch;