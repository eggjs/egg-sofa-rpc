'use strict';

module.exports = app => {
  const { router } = app;

  router.get('home', '/', async (ctx) => {
    const result = await ctx.proxy.helloService.send({
      name: 'foo',
      obj: {
        foo: {
          name: 'bar',
        },
      },
    });
    ctx.body = result;
  });
}
