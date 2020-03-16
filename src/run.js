#!/usr/bin/env node
const JarbasBrain = require('./JarbasBrain.js');

const [, , method, user, ...args] = process.argv;

JarbasBrain.setUser(user);

if (method === 'process') {
  if (args.length === 0) {
    console.log("No text provided");
    console.log("usage: ./run.js process <USER> <TEXT>");
  } else {
    console.time('Process');
    console.log(JarbasBrain.process(args.join(' ')));
    console.timeEnd('Process');
  }
}

if (method === 'train') {
  console.time('Training');
  JarbasBrain.train();
  console.timeEnd('Training');
}