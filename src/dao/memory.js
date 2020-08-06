const model = require('../../database/model/memory.json');
const memory = {
  connector:null,
  get(user) {
    const v = this.connector.prepare(model.load).get({ "owner": user });
    const m = v && JSON.parse(v.data);
    if (!m) {
      this.connector.prepare(model.insert).run({ "owner": user, "data": JSON.stringify({}) });
      return {};
    } else {
      return m;
    }
  },
  set(user, data) {
    this.connector.prepare(model.replace).run({ "owner": user, "data": JSON.stringify(data) });
  },
  clear(user){
    this.connector.prepare(model.clear).run({"owner":user});
  }
};
module.exports = memory;