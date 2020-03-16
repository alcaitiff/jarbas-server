const context = {
  name: "context",
  data: null,
  context: null,
  match(v, user, db) {
    this.load(db);
    const str = v.toLowerCase().trim();
    if (this.context && this.context.question) {
      return true;
    }
    return false;
  },
  process(v, user, db) {
    return 'calma';
  },
  load(db, user) {
    if (!this.data) {
      const d = db.connector.prepare(db.model.intent.load).get({ "name": this.name });
      this.data = d && JSON.parse(d.data);
    }
    const c = db.connector.prepare(db.model.memory.load).get({ "owner": user });
    this.context = c && JSON.parse(c.data);
  }
};
module.exports = context;