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

[SOFARPC](https://github.com/alipay/sofa-rpc) 插件是为 egg 提供调用和发布 RPC 服务的能力

## 安装

```bash
$ npm i egg-sofa-rpc --save
```

## 用法

### 开启插件

通过 `${app_root}/config/plugin.js` 配置启动 SOFARPC 插件:

```js
exports.sofaRpc = {
  enable: true,
  package: 'egg-sofa-rpc',
};
```

### RPC 服务发现

默认的服务发现依赖于 `zookeeper`，所以你需要配置一个 zk 的地址

```js
// ${app_root}/config/config.${env}.js
config.rpc = {
  registry: {
    address: '127.0.0.1:2181', // 根据实际情况配置
  },
};
```

后续我们还会提供更多的服务发现实现，你也可以根据自己的需求实现自己的 registry，详细可以参考：[自定义服务发现实现](https://github.com/eggjs/egg-sofa-rpc/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%E5%AE%9E%E7%8E%B0)

### RPC 客户端

该插件提供调用其他系统暴露的 SOFARPC 接口的能力

#### 1. 获取接口定义

以 protobuf 为例，将 \*.proto 文件放置到 `${app_root}/proto` 目录下

#### 2. 全局配置

可以在 `${app_root}/config/config.${env}.js` 做一些全局性的配置

```js
// ${app_root}config/config.${env}.js
exports.rpc = {
  client: {
    responseTimeout: 3000,
  },
};
```

- `responseTimeout`(可选): RPC 的超时时长，默认为 3 秒

#### 3. 申明要调用的接口

RPC 客户端还有一个重要的配置文件是：`${app_root}/config/proxy.js`，你需要把你调用的服务配置到里面，然后通过 `egg-rpc-generator` 工具帮你生成本地调用代码。

让我们看一个最简单的配置，它的基本含义是：我需要调用 `sofarpc` 应用暴露的 `com.alipay.sofa.rpc.test.ProtoService` 这个服务。

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

详细的配置可以参考 [RPC 代理（Proxy）配置](https://github.com/eggjs/egg-sofa-rpc/wiki/RPC-%E4%BB%A3%E7%90%86%EF%BC%88Proxy%EF%BC%89%E9%85%8D%E7%BD%AE)

#### 4. 生成本地调用代理

配置好了，运行 `egg-rpc-generator` 生成本地调用代理文件。运行成功后，会在 `${app_root}/app/proxy` 目录下生成一个 `ProtoSerivce.js` 文件

```bash
$ egg-rpc-generator

[EggRpcGenerator] framework: /egg-rpc-demo/node_modules/egg, baseDir: /egg-rpc-demo
[ProtoRPCPlugin] found "com.alipay.sofa.rpc.test.ProtoService" in proto file
[ProtoRPCPlugin] save all proto info into "/egg-rpc-demo/run/proto.json"
```

#### 5. 调用服务

通过 `ctx.proxy.proxyName` 来访问生成的 proxy 代码，proxyName 就是上面 proxy.js 配置的 api 键值对中的 key。例如：上面配置的 ProtoService，但是需要特别注意的是 proxyName 会自动转成小驼峰形式，所以就是 `ctx.proxy.protoService`。

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

和调用本地方法体验一模一样。


### RPC 服务端

该插件还可以暴露 SOFARPC 接口给其他应用调用

#### 1. 定义接口

同样以 protobuf 为例，将接口定义放置到 `${app_root}/proto` 目录下。
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

#### 2. 全局配置

在 `${app_root}/config/config.${env}.js` 做一些配置

```js
module.exports = {
	rpc: {
    server: {
      namespace: 'com.nodejs.rpc',
    },
	},
},
```

- `namespace`(必选): 接口的命名空间，所有的暴露的接口默认都在该命名空间下
- `selfPublish`(可选): 是否每个 worker 进程独立暴露服务。nodejs 多进程模式下，如果多个进程共享一个端口，在 RPC 这种场景可能造成负载不均，所以 selfPublish 默认为 true，代表每个进程独立监听端口和发布服务
- `port`(可选): 服务监听的端口（注意：在 selfPublish=true 时，监听的端口是基于这个配置生成的）
- `maxIdleTime`(可选): 客户端连接如果在该配置时长内没有任何流量，则主动断开连接
- `responseTimeout`(可选): 服务端建议的超时时长，具体的超时还是以客户端配置为准
- `codecType`(可选): 推荐的序列化方式，默认为 protobuf

#### 3. 接口实现

在 `${app_root}/app/rpc` 目录下放置接口的具体实现代码
```js
// ${app_root}/app/rpc/ProtoService.js
exports.echoObj = async function(req) {
  return {
    code: 200,
    message: 'hello ' + req.name + ', you are in ' + req.group,
  };
};
```

#### 4. 测试 RPC 接口

在单元测试中，我们可以通过 `app.rpcRequest` 接口来方便的测试我们自己暴露的 RPC 服务，例如：

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

详细 `app.rpcRequest` 的 api 可以参考：[单元测试 RPC 服务的方法](https://github.com/eggjs/egg-sofa-rpc/wiki/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95-RPC-%E6%9C%8D%E5%8A%A1%E7%9A%84%E6%96%B9%E6%B3%95)


## 相关文档

- [《聊聊 Nodejs RPC（一）》](https://github.com/alipay/sofa-rpc-node/wiki/%E8%81%8A%E8%81%8A-Nodejs-RPC%EF%BC%88%E4%B8%80%EF%BC%89)
- [Eggjs 和 SOFA 的跨语言互调](https://github.com/eggjs/egg-sofa-rpc/wiki/Eggjs-%E5%92%8C-SOFA-%E7%9A%84%E8%B7%A8%E8%AF%AD%E8%A8%80%E4%BA%92%E8%B0%83)
- [自定义服务发现实现](https://github.com/eggjs/egg-sofa-rpc/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%E5%AE%9E%E7%8E%B0)
- [RPC 代理（Proxy）配置](https://github.com/eggjs/egg-sofa-rpc/wiki/RPC-%E4%BB%A3%E7%90%86%EF%BC%88Proxy%EF%BC%89%E9%85%8D%E7%BD%AE)
- [单元测试 RPC 服务的方法](https://github.com/eggjs/egg-sofa-rpc/wiki/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95-RPC-%E6%9C%8D%E5%8A%A1%E7%9A%84%E6%96%B9%E6%B3%95)

## 贡献代码

请告知我们可以为你做些什么，不过在此之前，请检查一下是否有[已经存在的Bug或者意见](https://github.com/eggjs/egg/issues)。

如果你是一个代码贡献者，请参考[代码贡献规范](https://github.com/eggjs/egg/blob/master/CONTRIBUTING.md)。

## 开源协议

[MIT](LICENSE)
