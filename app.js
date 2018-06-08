'use strict';

const path = require('path');

module.exports = app => {
  // 载入到 app.proxyClasses
  app.loader.loadToContext(path.join(app.config.baseDir, 'app/proxy'), 'proxy', {
    call: true,
    caseStyle: 'lower',
    fieldClass: 'proxyClasses',
  });

  const serverConfig = app.config.sofaRpc && app.config.sofaRpc.server;
  if (serverConfig && serverConfig.namespace) {
    app.beforeStart(async function() {
      await app.sofaRpcServer.start();
    });
  }
};
