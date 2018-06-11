/**
 * BaseProxy, proxy 基类，封装 proxy 的通用逻辑
 */

'use strict';

/**
 * Proxy 基类，封装 proxy 的通用逻辑。
 * 你可以通过继承此基类来编写 proxy
 * @example
 * ```js
 * // app/proxy/user.js
 * module.exports = function(app) {
 *  return class UserProxy extends app.Proxy {
 *    constructor(ctx) {
 *      super(ctx);
 *    }
 *
 *    // 定义方法
 *  }
 * };
 */
class Proxy {

  /**
   * Constructs the object.
   *
   * @param      {Context}  ctx       The context
   * @param      {Consumer}  consumer  The consumer
   * @constructor
   */
  constructor(ctx, consumer) {
    this.ctx = ctx;
    this.app = ctx.app;
    this._consumer = consumer;
  }
}

module.exports = Proxy;
