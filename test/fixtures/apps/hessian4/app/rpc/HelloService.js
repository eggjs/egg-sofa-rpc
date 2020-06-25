'use strict';

/**
 * 请求对象
 * @typedef Request
 * @property {String} name 名字
 * @property {Map<String,Sub>} obj 子对象
 */

/**
 * Sub 对象
 * @typedef Sub
 * @property {String} name 名字
 */

/**
 * 响应对象
 * @typedef Response
 * @property {Map<String, String>} result
 * @property {int} resultStatus 响应状态
 */

/**
 * send 接口
 *
 * @param {Request} req 请求对象
 * @return {Response} 返回对象
 * @rpc
 */
exports.send = async function(req) {
  return {
    result: {
      hello: req.obj[req.name].name,
    },
    resultStatus: 1000,
  };
};

/**
 * GenericResult
 * @typedef {GenericResult<T,U>} GenericResult
 * @property {T} result
 * @property {Boolean} success
 * @property {U} error
 */

/**
 * HelloResponse
 * @typedef HelloResponse
 * @property {String} hello
 */

/**
 * HelloError
 * @typedef HelloError
 * @property {String} name
 * @property {String} message
 */

/**
 * 范型响应接口
 * @rpc
 * @param {Request} req 请求对象
 * @return {GenericResult<List<HelloResponse>, HelloError>}
 */
exports.sendGenericResult = async function(req) {
  return {
    success: true,
    result: [{
      hello: req.obj[req.name].name,
    }],
    error: {
      name: 'MockError',
      message: 'mock MockError',
    }
  }
};
