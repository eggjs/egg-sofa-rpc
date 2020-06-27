'use strict';

const fs = require('fs');
const path = require('path');

const classMap = {};

module.exports = className => {
  let map = classMap[className];
  if (!map) {
    const args = className.split('.');
    args.unshift(__dirname);
    args[ args.length - 1 ] = args[ args.length - 1 ] + '.js';
    const classfile = path.join.apply(null, args);
    if (fs.existsSync(classfile)) {
      map = classMap[className] = require(classfile);
    } else {
      throw new Error(`class ${classMap} not found.`);
    }
  }
  return map;
};
