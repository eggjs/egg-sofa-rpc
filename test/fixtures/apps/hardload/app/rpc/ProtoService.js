'use strict';

exports.echoObj = async function(req) {
  return {
    code: 200,
    message: 'hello ' + req.name + ' from Node.js',
  };
};
