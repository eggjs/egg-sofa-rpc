'use strict';

exports.echoObj = async function(req) {
  return {
    code: 200,
    message: 'hello ' + req.name + ' from Node.js',
  };
};

exports.interfaceName = 'com.alipay.sofa.rpc.test.ProtoService';
exports.version = '1.0';
exports.group = 'SOFA';
