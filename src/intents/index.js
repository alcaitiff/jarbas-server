const greet = require('./greet.js');
const context = require('./context.js');
const historySearch = require('./historySearch.js');
const intents = {
  "data": [
    context,
    greet,
    historySearch
  ]
};
module.exports = intents;