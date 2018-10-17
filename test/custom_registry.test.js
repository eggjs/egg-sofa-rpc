'use strict';

const path = require('path');
const mm = require('egg-mock');
const assert = require('assert');
const sleep = require('mz-modules/sleep');
const rimraf = require('mz-modules/rimraf');

describe('test/custom_registry.test.js', () => {

  async function cleanDir() {
    await Promise.all([
      rimraf(path.join(__dirname, 'fixtures/apps/custom-registry/app/proxy')),
      rimraf(path.join(__dirname, 'fixtures/apps/custom-registry/logs')),
      rimraf(path.join(__dirname, 'fixtures/apps/custom-registry/run')),
    ]);
  }

  let app;
  before(async function() {
    app = mm.app({
      baseDir: 'apps/custom-registry',
    });
    await app.ready();
    await sleep(1000);
  });
  after(async function() {
    await app.close();
    await cleanDir();
  });

  it('should invoke ok', async function() {
    const ctx = app.createAnonymousContext();
    const res = await ctx.proxy.protoService.echoObj({
      name: 'gxcsoccer',
      group: 'B',
    });
    console.log(res);
    assert.deepEqual(res, {
      code: 200,
      message: 'hello gxcsoccer from Node.js',
    });
  });

  it('should app.rpcRequest ok', done => {
    app.rpcRequest('com.alipay.sofa.rpc.test.ProtoService')
      .invoke('echoObj')
      .send([{
        name: 'gxcsoccer',
        group: 'B',
      }])
      .expect({
        code: 200,
        message: 'hello gxcsoccer from Node.js',
      }, done);
  });
});
