'use strict';

const mm = require('egg-mock');

describe('test/hardload.test.js', () => {
  let app;
  before(async function() {
    app = mm.app({
      baseDir: 'apps/hardload',
    });
    await app.ready();
  });
  after(async function() {
    await app.close();
  });
  afterEach(mm.restore);

  it('should invoke with serverHost', async function() {
    await app.httpRequest()
      .get('/')
      .expect({
        code: 200,
        message: 'hello zongyu from Node.js',
      });
  });
});
