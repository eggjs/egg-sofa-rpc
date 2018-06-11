'use strict';

exports.echoObj = async function(req) {
  req = req.toObject({ enums: String });
  return {
    code: 200,
    message: 'hello ' + req.name + ', you are in ' + req.group,
  };
};
