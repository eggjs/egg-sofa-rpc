'use strict';

const protocol = require('sofa-bolt-node');
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;

module.exports = () => {
  return {
    rpc: {
      registryClass: ZookeeperRegistry,
      registry: null,
      hessionVersion: '3.0', // 支持 3.0 和 4.0
      client: {
        protocol,
        responseTimeout: 3000,
      },
      server: {
        protocol,
        port: 12200,
        idleTime: 5000,
        killTimeout: 30000,
        maxIdleTime: 90 * 1000,
        responseTimeout: 3000,
        codecType: 'protobuf',
        selfPublish: true,
        // 下面配置针对新的 rpc 服务发布方式
        namespace: null,
        version: '1.0',
        group: 'SOFA',
        uniqueId: null,
        autoServe: true, // 如果发现有暴露服务，则自定启动 server
      },
    },
  };
};
