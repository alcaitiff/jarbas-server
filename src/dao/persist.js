const db = require('../../database/db.js');
const model = require('../../database/model/persist.json');
const persist = {
  get(property) {
    const v = db.prepare(model.load).get({ "property": property });
    const m = v && JSON.parse(v);
    if (!m) {
      db.prepare(model.insert).run({ "property": property, "value": "" });
      return "";
    } else {
      return m.value;
    }
  },
  set(property, value) {
    db.prepare(model.replace).run({ "property": property, "value": value });
  }
};
module.exports = persist;