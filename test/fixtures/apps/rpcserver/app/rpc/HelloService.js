'use strict';

const sleep = require('mz-modules/sleep');

module.exports = function(app) {
  const exports = {};

  exports.interfaceName = 'com.alipay.nodejs.HelloService';
  exports.version = '1.0';
  exports.group = 'SOFA';


  exports.hello = function*(name) {
    yield sleep(200);
    return 'hello ' + name;
  };

  return exports;
}
