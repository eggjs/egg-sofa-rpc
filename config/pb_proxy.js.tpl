// Don't modified this file, it's auto created by egg-rpc-tool

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {
  const consumer = app.sofaRpcClient.createConsumer({
    interfaceName: '{{interfaceName}}',
    targetAppName: '{{appName}}',
    version: '{{version}}',
    group: '{{group}}',
    proxyName: '{{name}}',
    {{#if responseTimeout}}
    responseTimeout: {{responseTimeout}},
    {{/if}}
    {{#if errorAsNull}}
    errorAsNull: {{errorAsNull}},
    {{/if}}
  });

  if (!consumer) {
    // `app.config['{{appName}}.rpc.service.enable'] = false` will disable this consumer
    return;
  }

  app.beforeStart(async() => {
    await consumer.ready();
  });

  class {{normalizeName interfaceName}} extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }
  {{#each methods}}

    async {{ methodName }}(req) {
      return await consumer.invoke('{{ methodName }}', [ req ], { 
        ctx: this.ctx,
        codecType: 'protobuf',
        {{#if extConfig.responseTimeout}}
        responseTimeout: {{extConfig.responseTimeout}},
        {{/if}}
      });
    }
  {{/each}}
  }

  return {{normalizeName interfaceName}};
};
/* eslint-enable */



