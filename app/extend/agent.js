'use strict';

const _sofaRegistry = Symbol.for('egg#sofaRegistry');

module.exports = {
  get sofaRegistry() {
    if (!this[_sofaRegistry]) {
      const options = this.config.sofaRpc.registry;
      if (!options) return null;
      const registryClass = this.config.sofaRpc.registryClass;
      this[_sofaRegistry] = new registryClass(Object.assign({
        logger: this.coreLogger,
        cluster: this.cluster,
      }, options));
      this[_sofaRegistry].on('error', err => { this.coreLogger.error(err); });
      this.beforeClose(async () => {
        await this[_sofaRegistry].close();
      });
    }
    return this[_sofaRegistry];
  },
};
