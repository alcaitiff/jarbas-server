const greet = require('./greet.js');
const context = require('./context.js');
const intents = {
  "data": [
    context,
    greet
  ]
};
module.exports = intents;