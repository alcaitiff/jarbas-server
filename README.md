# jarbas-server

## Project setup

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn start
```

### Run on terminal

```bash
cd src
./run.js train
./run.js process <user> <msg>
```

### Simple script to run on terminal

Create a Jarbas file.

```bash
touch Jarbas
chmod +x Jarbas
```

```bash
#!/bin/bash
# Description: Send a message to be processed in Jarbas
CURR_DIR=$PWD;
JARBAS_SERVER_PATH=/home/XXXXX/jarbas-server/src;
cd JARBAS_SERVER_PATH;
./terminal.js "$@";
# I don't use cd - because you may change directories inside a intent
cd ${CURR_DIR} ;
```

### Adding intents

To create new intents and add them to the bot open the folder src/intents

* On index.js file add the new intent on the data array.

```javascript
const newIntent = require('./newIntent.js');
const intents = {
  "data": [
    ...,
    newIntent
    ...
```

* Create the new intent file code on src/intents/newintent.js
* Create the new intent file data on database/intentsnewIntent.json
* Train the bot again

```bash
npm run train
```
