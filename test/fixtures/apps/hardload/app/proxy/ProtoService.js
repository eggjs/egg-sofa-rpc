// Don't modified this file, it's auto created by egg-rpc-tool

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {
  const consumer = app.sofaRpcClient.createConsumer({
    interfaceName: 'com.alipay.sofa.rpc.test.ProtoService',
    targetAppName: 'sofarpc',
    version: '1.0',
    group: 'SOFA',
    proxyName: 'ProtoService',
  });

  if (!consumer) {
    // `app.config['sofarpc.rpc.service.enable'] = false` will disable this consumer
    return;
  }

  app.beforeStart(async() => {
    await consumer.ready();
  });

  class ProtoService extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }

    async echoObj(req) {
      return await consumer.invoke('echoObj', [ req ], { 
        ctx: this.ctx,
        codecType: 'protobuf',
      });
    }
  }

  return ProtoService;
};
/* eslint-enable */



