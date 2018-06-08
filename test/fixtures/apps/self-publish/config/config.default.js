'use strict';

exports.sofaRpc = {
  registry: {
    address: '127.0.0.1:2181',
  },
  client: {
    responseTimeout: 3000,
  },
  server: {
    port: 12200 + Number(process.versions.node.split('.')[0]),
    idleTime: 5000,
    killTimeout: 30000,
    maxIdleTime: 90 * 1000,
    responseTimeout: 3000,
    codecType: 'hessian2',
    selfPublish: true,
    // 下面配置针对新的 rpc 服务发布方式
    namespace: 'com.alipay.nodejs.selfPublish',
    version: '1.0',
    group: 'SOFA',
    uniqueId: null,
  },
};
