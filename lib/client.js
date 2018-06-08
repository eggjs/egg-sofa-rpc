'use strict';

const assert = require('assert');
const { RpcClient } = require('sofa-rpc-node').client;

class EggRpcClient extends RpcClient {
  constructor(app) {
    const globalConfig = app.config.sofaRpc && app.config.sofaRpc.client;
    super(Object.assign({
      logger: app.coreLogger,
      registry: app.sofaRegistry,
    }, globalConfig));
    this.app = app;
    this.globalConfig = globalConfig;
  }

  createConsumer(options, consumerClass) {
    const targetAppName = options.targetAppName;
    assert(targetAppName, '[egg-sofa-rpc:client] createConsumer(options, consumerClass) options must config targetAppName');

    const globalConfig = this.globalConfig;
    // 支持 `app.config['targetAppName.rpc.service.options'] = { ... }`
    options = Object.assign({ app: this.app }, globalConfig, globalConfig[targetAppName + '.rpc.service.options'], options);

    // 读取 responseTimeout 优先级如下
    // 1. 通过 config 的 ${targetAppName}.rpc.service.timeout 读取
    // 2. 尝试从 consumer 配置 responseTimeout 读取
    // 3. 尝试从 app.config.rpc.responseTimeout 读取
    // 4. 默认 5000ms 超时
    const timeoutKey = targetAppName + '.rpc.service.timeout';
    const timeout = options[timeoutKey];
    options.responseTimeout = Number(timeout) || options.responseTimeout || this.options.responseTimeout || 5000;

    // 硬负载
    if (!options.serverHost) {
      const testUrl = options[targetAppName + '.rpc.service.url'];
      const proxyName = options.proxyName;
      const proxyTestUrl = proxyName ? options['proxy.' + proxyName + '.rpc.service.url'] : null;
      options.serverHost = proxyTestUrl || testUrl;
    }
    return super.createConsumer(options, consumerClass);
  }
}

module.exports = EggRpcClient;
