#!/usr/bin/env node
const execSync = require('child_process').execSync;
const JarbasBrain = require('./JarbasBrain.js');

const [, , ...args] = process.argv;

const user= execSync('echo -n $USER').toString();

JarbasBrain.setUser(user);


if (args.length === 0) {
  console.log("No text provided");
  console.log("usage: ./terminal.js <TEXT>");
} else {
  JarbasBrain.debug(null);
  const result = JarbasBrain.process(args.join(' '));
  console.log(result.value);
}
