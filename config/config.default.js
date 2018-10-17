'use strict';

const fs = require('fs');
const path = require('path');
const antpb = require('antpb');
const protocol = require('sofa-bolt-node');
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;

module.exports = appInfo => {

  const protoPath = path.join(appInfo.baseDir, 'run/proto.json');
  // 加载 proto
  if (fs.existsSync(protoPath)) {
    const proto = antpb.fromJSON(require(protoPath));
    protocol.setOptions({ proto });
  }

  return {
    sofaRpc: {
      registryClass: ZookeeperRegistry,
      registry: null,
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
      },
    },
  };
};
