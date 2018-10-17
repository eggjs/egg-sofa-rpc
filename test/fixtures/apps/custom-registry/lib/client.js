'use strict';

const Base = require('sdk-base');

class SimpleRegistry extends Base {
  constructor(options) {
    super(options);
    this.ready(true);
  }

  async register() {}

  async unRegister() {}

  subscribe(config, listener) {
    setImmediate(() => {
      listener([
        'bolt://127.0.0.1:12200',
      ]);
    });
  }

  unSubscribe() {}

  close() {
    return Promise.resolve()
  }
}

module.exports = SimpleRegistry;
