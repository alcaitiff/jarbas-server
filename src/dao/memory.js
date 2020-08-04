const db = require('../../database/db.js');
const model = require('../../database/model/memory.json');
const memory = {
  get(user) {
    const v = db.prepare(model.load).get({ "owner": user });
    const m = v && JSON.parse(v.data);
    if (!m) {
      db.prepare(model.insert).run({ "owner": user, "data": JSON.stringify({}) });
      return {};
    } else {
      return m;
    }
  },
  set(user, data) {
    db.prepare(model.replace).run({ "owner": user, "data": JSON.stringify(data) });
  },
  clear(user){
    db.prepare(model.clear).run({"owner":user});
  }
};
module.exports = memory;