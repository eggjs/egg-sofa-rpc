'use strict';

const mm = require('egg-mock');

describe('test/index.test.js', () => {
  let app;
  before(async function() {
    app = mm.app({
      baseDir: 'apps/rpcserver',
    });
    await app.ready();
  });
  after(async function() {
    await app.close();
  });

  it('should invoke HelloService', done => {
    app.rpcRequest('com.alipay.nodejs.HelloService')
      .invoke('hello')
      .send([ 'gxcsoccer' ])
      .expect('hello gxcsoccer', done);
  });

  it('should invoke MathService', done => {
    app.rpcRequest('com.alipay.nodejs.rpc.MathService')
      .invoke('plus')
      .send([ 1, 2 ])
      .expect(3, done);
  });
});
