'use strict';

/**
 * 加法计数服务
 * @hsf
 * @public
 * @param {Number} a - 被加数
 * @param {Number} b - 加数
 * @return {Number} 结果
 */
exports.plus = async function(a, b) {
  return a + b;
};

exports.error = async function() {
  setTimeout(() => {
    throw new Error('uncaughtException');
  }, 1000);
  return 'ok';
};
