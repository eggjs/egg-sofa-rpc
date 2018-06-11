'use strict';

class MathService {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async plus(a, b) {
    return a + b;
  }
}

module.exports = MathService;
