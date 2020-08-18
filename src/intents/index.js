const greet = require('./greet.js');
const context = require('./context.js');
const historySearch = require('./historySearch.js');
const listIntents = require('./listIntents.js');
const aptUpdate = require('./aptUpdate.js');
const intents = {
  "data": [
    context,
    greet,
    historySearch,
    aptUpdate,
    listIntents
  ]
};
module.exports = intents;