// Don't modified this file, it's auto created by jar2proxy

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = function (app) {
  const appName = 'hessian4';
  let version = '1.0';
  if (app.config.proxy && app.config.proxy.envVersion) {
    version = app.config.proxy.envVersion[appName] || version;
  }
  const rpcClient = app.rpcClient;
  if (!rpcClient) return;
  const consumer = rpcClient.createConsumer({
    interfaceName: 'com.alipay.nodejs.rpc.HelloService',
    version,
    targetAppName: appName,
    group: 'SOFA',
    proxyName: 'helloService',
    responseTimeout: 3000,
  });

  
  class HelloService extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }

    // java source code:  public Response send(Request req);
    // returnType: com.alipay.nodejs.rpc.Response
    /**
     * send 接口
     * @param req 请求对象
     * @return 返回对象
     */
    async send(req) {
      const args = [
        {
          $class: 'com.alipay.nodejs.rpc.Request',
          $: req,
        }
      ];
      return await consumer.invoke('send', args, {
        ctx: this.ctx,
      });
    }

    // java source code:  public GenericResult<List<HelloResponse>, HelloError> sendGenericResult(Request req);
    // returnType: com.alipay.nodejs.rpc.GenericResult
    /**
     * 范型响应接口
     * @param req 请求对象
     * @return
     */
    async sendGenericResult(req) {
      const args = [
        {
          $class: 'com.alipay.nodejs.rpc.Request',
          $: req,
        }
      ];
      return await consumer.invoke('sendGenericResult', args, {
        ctx: this.ctx,
      });
    }
  }
  return HelloService;
};

/* eslint-enable */

