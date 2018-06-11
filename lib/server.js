'use strict';

const http = require('http');
const path = require('path');
const is = require('is-type-of');
const assert = require('assert');
const cluster = require('cluster');
const { RpcServer } = require('sofa-rpc-node').server;

class EggRpcServer extends RpcServer {
  constructor(app) {
    const options = app.config.sofaRpc && app.config.sofaRpc.server;
    const selfPublish = options.selfPublish && cluster.isWorker;

    let registry = app.sofaRegistry;
    if (selfPublish && app.sofaRegistry) {
      registry = new app.sofaRegistry.DataClient(app.sofaRegistry.options);
    }
    super(Object.assign({
      appName: app.name,
      // 如果是 selfPublish 单独创建 registry 连接来发布服务
      registry,
      logger: app.coreLogger,
    }, options));

    this.app = app;
    this.selfPublish = selfPublish;

    // 等 app 已经 ready 后才向注册中心注册服务
    app.ready(err => {
      if (!err) {
        this.load();
        this.publish();
        this.logger.info('[egg-sofa-rpc#server] publish all rpc services after app ready');
      }
    });
  }

  get listenPorts() {
    let port = this.options.port;
    if (this.selfPublish) {
      port = port + cluster.worker.id;
      this.publishPort = port;
      return [ port, this.options.port ];
    }
    return [ port ];
  }

  load() {
    const { app } = this;
    const { namespace } = app.config.sofaRpc.server;
    const paths = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/rpc'));
    app.loader.loadToApp(paths, 'rpcServices', {
      call: true,
      caseStyle: 'camel', // 首字母不变
    });
    // load apiMeta
    for (const name in app.rpcServices) {
      let delegate = app.rpcServices[name];

      const interfaceName = `${namespace}.${name}`;
      const service = Object.assign({ interfaceName }, app.config.sofaRpc.server);
      if (delegate.interfaceName || delegate.namespace) {
        service.interfaceName = delegate.interfaceName ? delegate.interfaceName : `${delegate.namespace}.${name}`;
        service.uniqueId = delegate.uniqueId || '';
        service.version = delegate.version || service.version;
        service.group = delegate.group || service.group;
      }

      if (is.class(delegate)) {
        delegate = wrap(app, delegate);
      } else {
        for (const key of Object.keys(delegate)) {
          delegate[key] = app.toAsyncFunction(delegate[key]);
        }
      }
      this.addService(service, delegate);
    }
  }

  /**
   * @param {HSFRequest} req
   *   - @param {Object} requestProps
   *   - @param {Number} packetId
   *   - @param {String} packetType
   *   - @param {String} methodName
   *   - @param {String} serverSignature interfaceName
   *   - @param {Array} args
   * @param {HSFResponse} res
   *   - @param {Function} send
   * @return {Context} ctx
   */
  createContext(req, res) {
    assert(req && req.data, '[egg-sofa-rpc#server] req && req.data is required');
    const reqData = req.data;
    const { serverSignature, methodName, args } = reqData;
    const httpReq = {
      method: 'RPC',
      url: '/rpc/' + serverSignature + '/' + methodName,
      headers: {},
      socket: res.socket,
    };
    const ctx = this.app.createContext(httpReq, new http.ServerResponse(httpReq));
    ctx.params = args;
    return ctx;
  }

  addService(service, delegate) {
    assert(service && delegate, '[egg-sofa-rpc#server] addService(service, delegate) service & delegate is required');
    if (is.string(service)) {
      service = {
        id: service,
        group: this.options.group,
      };
    }
    // 将 app 传入
    service.app = this.app;
    return super.addService(service, delegate);
  }

  _handleUncaughtError() {
    if (this.selfPublish) {
      this.unPublish();
      this.logger.warn('[egg-sofa-rpc#server] unPublish all rpc services for uncaughtException in this process %s', process.pid);
    } else {
      this.logger.warn('[egg-sofa-rpc#server] rpc server is down, cause by uncaughtException in this process %s', process.pid);
    }
  }
}

function wrap(app, Class) {
  const proto = Class.prototype;
  const result = {};
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (!is.asyncFunction(proto[key]) && !is.generatorFunction(proto[key])) {
      continue;
    }

    proto[key] = app.toAsyncFunction(proto[key]);
    result[key] = async function(...args) {
      const instance = new Class(this);
      return await instance[key](...args);
    };
  }
  return result;
}

module.exports = EggRpcServer;
