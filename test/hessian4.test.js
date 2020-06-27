'use strict';

const mm = require('egg-mock');
const sleep = require('mz-modules/sleep');

describe('test/hessian4.test.js', () => {
  let app;
  before(async function() {
    app = mm.app({
      baseDir: 'apps/hessian4',
    });
    await app.ready();
    await sleep(1000);
  });
  after(async function() {
    await app.close();
  });
  afterEach(mm.restore);

  it('should call rpc with hessian4 ok', async () => {
    await app.httpRequest()
      .get('/')
      .expect({
        result: {
          hello: 'bar',
        },
        resultStatus: 1000,
      });
  });
});
