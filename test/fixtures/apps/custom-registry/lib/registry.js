'use strict';

const RegistryBase = require('sofa-rpc-node/lib/registry/base');
const DataClient = require('./client');

class CustomeRegistry extends RegistryBase {
  get DataClient() {
    return DataClient;
  }
}

module.exports = CustomeRegistry
