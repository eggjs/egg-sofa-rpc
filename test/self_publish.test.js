'use strict';

const mm = require('egg-mock');
const assert = require('assert');
const cluster = require('cluster');
const sleep = require('mz-modules/sleep');
const { RpcClient } = require('sofa-rpc-node').client;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;

const logger = console;

describe('test/self_publish.test.js', () => {
  let app;
  let client;
  let registry;
  const interfaceName = 'com.alipay.nodejs.selfPublish.HelloService';
  const port = 12200 + Number(process.versions.node.split('.')[0]);

  describe('app.cluster()', () => {
    before(async function() {
      mm.env('production');
      registry = new ZookeeperRegistry({
        address: '127.0.0.1:2181',
        logger,
      });
      app = mm.cluster({
        baseDir: 'apps/self-publish',
        workers: 4,
      });
      await app.ready();

      client = new RpcClient({
        registry,
        logger,
      });
      await client.ready();

      registry.subscribe({ interfaceName }, val => {
        if (val.length === 4) {
          registry.emit('init_address', val);
        }
      });
      const addressList = await registry.await('init_address');
      assert(addressList.every(url => url.port !== port));
    });
    afterEach(mm.restore);
    after(async function() {
      await app.close();
      await registry.close();
      await sleep(2000);
    });

    it('should publish self worker', async function() {
      let count = 4;
      let ret;
      const consumer = client.createConsumer({ interfaceName });
      await consumer.ready();
      while (count--) {
        ret = await consumer.invoke('plus', [ 1, 2 ]);
        assert(ret === 3);
      }

      const directConsumer = client.createConsumer({
        interfaceName,
        serverHost: `127.0.0.1:${port}`,
      });
      await directConsumer.ready();
      // 原始端口也需要监听
      ret = await directConsumer.invoke('plus', [ 1, 2 ]);
      assert(ret === 3);
    });

    it(`should app ready failed cause ${port} is used`, async function() {
      mm(cluster, 'isWorker', true);
      mm(cluster, 'worker', { id: 10 });
      let app;
      try {
        app = mm.app({
          baseDir: 'apps/self-publish',
        });
        await app.ready();
        assert(false, 'should not run here');
      } catch (err) {
        assert(err.message.includes('listen EADDRINUSE'));
      }
      if (app) {
        await app.close();
      }
    });

    it('should publish again if app worker uncaughtException', async function() {
      registry.subscribe({ interfaceName }, val => {
        registry.emit('service_address', val);
      });

      let addressList = await registry.await('service_address');
      assert(addressList.length === 4);

      const consumer = client.createConsumer({ interfaceName });
      [ addressList ] = await Promise.all([
        registry.await('service_address'),
        consumer.invoke('error', []),
      ]);

      assert(addressList.length === 3);
      addressList = await registry.await('service_address');
      assert(addressList.length === 4);

      let count = 4;
      let ret;
      while (count--) {
        ret = await consumer.invoke('plus', [ 1, 2 ]);
        assert(ret === 3);
      }
    });
  });

  describe('app.mm()', () => {
    it('start 防重入', async function() {
      mm(cluster, 'isWorker', true);
      mm(cluster, 'worker', { id: 1000 });
      const app = mm.app({
        baseDir: 'apps/self-publish',
      });
      await app.ready();
      await app.sofaRpcServer.start();

      await app.close();
    });
  });
});
