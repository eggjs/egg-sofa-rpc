'use strict';

const path = require('path');

module.exports = app => {
  // 载入到 app.proxyClasses
  app.loader.loadToContext(path.join(app.config.baseDir, 'app/proxy'), 'proxy', {
    call: true,
    caseStyle: 'lower',
    fieldClass: 'proxyClasses',
  });

  const paths = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/rpc'));
  app.loader.loadToApp(paths, 'rpcServices', {
    call: true,
    caseStyle: 'camel', // 首字母不变
  });

  // 如果有 app/rpc 服务，则自动启动 server
  if (Object.keys(app.rpcServices).length) {
    app.beforeStart(async function() {
      await app.sofaRpcServer.start();
    });
  }
};
