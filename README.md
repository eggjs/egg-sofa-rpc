# egg-sofa-rpc

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-sofa-rpc.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-sofa-rpc
[travis-image]: https://img.shields.io/travis/eggjs/egg-sofa-rpc.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-sofa-rpc
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-sofa-rpc.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-sofa-rpc?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-sofa-rpc.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-sofa-rpc
[snyk-image]: https://snyk.io/test/npm/egg-sofa-rpc/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-sofa-rpc
[download-image]: https://img.shields.io/npm/dm/egg-sofa-rpc.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-sofa-rpc

[SOFARPC](https://github.com/alipay/sofa-rpc) plugin for egg framework

## Install

```bash
$ npm i egg-sofa-rpc --save
```

## Usage

### Enable the plugin

Change `${app_root}/config/plugin.js` to enable SOFARPC plugin:

```js
exports.sofaRpc = {
  enable: true,
  package: 'egg-sofa-rpc',
};
```

### RPC Service Discovery

By default, We use zookeeper for service discovery. Therefore you need to configure the zk address:

```js
// ${app_root}/config/config.${env}.js
config.sofaRpc = {
  registry: {
    address: '127.0.0.1:2181', // configure your real zk address
  },
};
```

We plan to provide more implementations of service discovery. And also you can implement it by yourself, you can follow this [article](https://github.com/eggjs/egg-sofa-rpc/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%E5%AE%9E%E7%8E%B0)

### RPC Client

By using the plugin, you can call rpc services provided by other system.

#### 1. Get the RPC Interface Definition

We use [protobuf interface definition lanaguge](https://developers.google.com/protocol-buffers/docs/proto3) to describe the RPC service. So you need to get the \*.proto files and put them into `${app_root}/proto` folder

#### 2. Global RPC Client Configuration

Configure RPC Client information in ${app_root}/config/config.{env}.js:

```js
// ${app_root}config/config.${env}.js
exports.sofaRpc = {
  client: {
    responseTimeout: 3000,
  },
};
```

- `responseTimeout`(optional): RPC timeout in milliseconds, default value is 3000

#### 3. Configure the Interface in proxy.js

`${app_root}/config/proxy.js` is a very important config file for rpc client, you should configure the services you needed, then executing the `egg-rpc-generator` tool to generate the proxy files.

Let's see a simple example of proxy.js. It declare a interface named: `com.alipay.sofa.rpc.test.ProtoService` provided by `sofarpc` application

```js
'use strict';

module.exports = {
  services: [{
    appName: 'sofarpc',
    api: {
      ProtoService: 'com.alipay.sofa.rpc.test.ProtoService',
    },
  }],
};
```

Refer this [acticle](https://github.com/eggjs/egg-sofa-rpc/wiki/RPC-%E4%BB%A3%E7%90%86%EF%BC%88Proxy%EF%BC%89%E9%85%8D%E7%BD%AE) for more details

#### 4. Generate the Proxy

Run `egg-rpc-generator` to generate the proxy files. After running success, it will generate a file: `ProtoService.js` under `${app_root}/app/proxy`

```bash
$ egg-rpc-generator

[EggRpcGenerator] framework: /egg-rpc-demo/node_modules/egg, baseDir: /egg-rpc-demo
[ProtoRPCPlugin] found "com.alipay.sofa.rpc.test.ProtoService" in proto file
[ProtoRPCPlugin] save all proto info into "/egg-rpc-demo/run/proto.json"
```

#### 5. Call the Service

You can call the RPC service by using `ctx.proxy.proxyName`. The proxyName is `key` value of api object you configure in proxy.js. In our example, it's ProtoService, and proxyName using lower camelcase, so it's `ctx.proxy.protoService`

```js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const res = await ctx.proxy.protoService.echoObj({
      name: 'gxcsoccer',
	    group: 'A',
    });
    ctx.body = res;
  }
}

module.exports = HomeController;
```

As above, you can call remote service as a local method.

### RPC Server

By using the plugin, you also can publish your own RPC service to other system.

#### 1. Define the RPC Interface

Writing the \*.proto files, and put them into `${app_root}/proto` folder

```
# ProtoService.proto
syntax = "proto3";

package com.alipay.sofa.rpc.protobuf;
option java_multiple_files = true; // 可选
option java_outer_classname = "ProtoServiceModels"; // 可选

service ProtoService {
    rpc echoObj (EchoRequest) returns (EchoResponse) {}
}

message EchoRequest {
    string name = 1;
    Group group = 2;
}

message EchoResponse {
    int32 code = 1;
    string message = 2;
}

enum Group {
    A = 0;
    B = 1;
}
```

#### 2. Global RPC Server Configuration

Configure RPC Server information in ${app_root}/config/config.{env}.js:

```js
module.exports = {
	sofaRpc: {
    server: {
      namespace: 'com.nodejs.rpc',
    },
	},
},
```

- `namespace`(required): the default namespace of all rpc service
- `selfPublish`(optional): whether every node process publish service independent, default is true
- `port`(optional): the TCP port will be listen on
- `maxIdleTime`(optional): server will disconnect the socket if idle for long time
- `responseTimeout`(optional): Number of milliseconds to wait for a response to begin arriving back from the remote system after sending a request
- `codecType`(optional): recommended serialization method，default is protobuf

#### 3. Implemenation the RPC Interface

Put your implementation code under `${app_root}/app/rpc` folder

```js
// ${app_root}/app/rpc/ProtoService.js
exports.echoObj = async function(req) {
  return {
    code: 200,
    message: 'hello ' + req.name + ', you are in ' + req.group,
  };
};
```

#### 4. RPC Unittest in Eggjs

```js
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
});
```

For more details of `app.rpcRequest`, you can refer to this [acticle](https://github.com/eggjs/egg-sofa-rpc/wiki/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95-RPC-%E6%9C%8D%E5%8A%A1%E7%9A%84%E6%96%B9%E6%B3%95)

## Docs

- [RPC in Nodejs Part One](https://github.com/alipay/sofa-rpc-node/wiki/%E8%81%8A%E8%81%8A-Nodejs-RPC%EF%BC%88%E4%B8%80%EF%BC%89)
- [Cross-Language Interoperability between Eggjs & SOFA](https://github.com/eggjs/egg-sofa-rpc/wiki/Eggjs-%E5%92%8C-SOFA-%E7%9A%84%E8%B7%A8%E8%AF%AD%E8%A8%80%E4%BA%92%E8%B0%83)
- [Custom Service Discovery in Eggjs](https://github.com/eggjs/egg-sofa-rpc/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%E5%AE%9E%E7%8E%B0)
- [RPC Proxy Configuration in Eggjs](https://github.com/eggjs/egg-sofa-rpc/wiki/RPC-%E4%BB%A3%E7%90%86%EF%BC%88Proxy%EF%BC%89%E9%85%8D%E7%BD%AE)
- [RPC Unittest in Eggjs](https://github.com/eggjs/egg-sofa-rpc/wiki/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95-RPC-%E6%9C%8D%E5%8A%A1%E7%9A%84%E6%96%B9%E6%B3%95)

## How to Contribute

Please let us know how can we help. Do check out [issues](https://github.com/eggjs/egg/issues) for bug reports or suggestions first.

To become a contributor, please follow our [contributing guide](https://github.com/eggjs/egg/blob/master/CONTRIBUTING.md).

## License

[MIT](LICENSE)
