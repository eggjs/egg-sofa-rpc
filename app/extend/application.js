'use strict';

const assert = require('assert');
const EggRpcClient = require('../../lib/client');
const EggRpcServer = require('../../lib/server');
const ProxyBase = require('../../lib/base_proxy');
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;

// Symbols
const _sofaRegistry = Symbol.for('egg#sofaRegistry');
const _sofaRpcClient = Symbol.for('egg#sofaRpcClient');
const _sofaRpcServer = Symbol.for('egg#sofaRpcServer');

module.exports = {
  get Proxy() {
    return ProxyBase;
  },
  get sofaRegistry() {
    if (!this[_sofaRegistry]) {
      const options = this.config.sofaRpc.registry;
      assert(options && options.address, '[egg-sofa-rpc] registry.address is required');
      this[_sofaRegistry] = new ZookeeperRegistry(Object.assign({
        logger: this.coreLogger,
      }, options));
      this[_sofaRegistry].on('error', err => { this.coreLogger.error(err); });
      this.beforeClose(async () => {
        await this[_sofaRegistry].close();
      });
    }
    return this[_sofaRegistry];
  },
  get sofaRpcClient() {
    if (!this[_sofaRpcClient]) {
      this[_sofaRpcClient] = new EggRpcClient(this);
      this[_sofaRpcClient].on('error', err => { this.coreLogger.error(err); });
      this.beforeClose(async () => {
        await this[_sofaRpcClient].close();
      });
    }
    return this[_sofaRpcClient];
  },
  get sofaRpcServer() {
    if (!this[_sofaRpcServer]) {
      this[_sofaRpcServer] = new EggRpcServer(this);
      this[_sofaRpcServer].on('error', err => { this.coreLogger.error(err); });
      this.beforeClose(async () => {
        await this[_sofaRpcServer].close();
        this.coreLogger.info('[egg-sofa-rpc] sofaRpcServer is closed');
      });
    }
    return this[_sofaRpcServer];
  },
};
