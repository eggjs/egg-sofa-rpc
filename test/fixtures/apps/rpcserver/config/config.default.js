'use strict';

exports.rpc = {
  registry: {
    address: '127.0.0.1:2181',
  },
  server: {
    port: 12200,
    codecType: 'hessian2',
    selfPublish: true,
    // 下面配置针对新的 rpc 服务发布方式
    namespace: 'com.alipay.nodejs.rpc',
  },
};
