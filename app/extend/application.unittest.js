'use strict';

const request = require('sofa-rpc-node').test;

module.exports = {
  /**
   * rpc 服务测试 helper
   * ```js
   * app.rpcRequest('helloService')
   *   .invoke('plus')
   *   .send([ 1, 2 ])
   *   .type('number')
   *   .expect(3, done);
   * ```
   * @param {String} serviceName - rpc 服务全称
   * @return {Request} req
   */
  rpcRequest(serviceName) {
    // 自动填充 namespace
    if (this.config.sofaRpc && this.config.sofaRpc.server &&
      this.config.sofaRpc.server.namespace &&
      !serviceName.startsWith('com.') &&
      !serviceName.startsWith(this.config.sofaRpc.server.namespace)) {
      serviceName = `${this.config.sofaRpc.server.namespace}.${serviceName}`;
    }
    return request(this.sofaRpcServer).service(serviceName);
  },
};
