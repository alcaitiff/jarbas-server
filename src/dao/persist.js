const model = require('../../database/model/persist.json');
const persist = {
  connector:null,
  get(property) {
    const v = this.connector.prepare(model.load).get({ "property": property });
    const m = v;
    if (!m) {
      this.connector.prepare(model.insert).run({ "property": property, "value": "" });
      return "";
    } else {
      return m.value;
    }
  },
  set(property, value) {
    this.connector.prepare(model.replace).run({ "property": property, "value": value });
  }
};
module.exports = persist;
