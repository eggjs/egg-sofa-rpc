'use strict';

module.exports = app => {
  app.get('/', async function(ctx) {
    ctx.body = await ctx.proxy.protoService.echoObj({
      name: 'zongyu',
      group: 'B',
    });
  });
};
