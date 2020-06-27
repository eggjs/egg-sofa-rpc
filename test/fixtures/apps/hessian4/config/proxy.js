module.exports = {
  group: 'SOFA',
  version: '1.0',
  services: [{
    appName: 'hessian4',
    api: {
      HelloService: {
        interfaceName: 'com.alipay.nodejs.rpc.HelloService',
      },
    },
    dependency: [{
      groupId: 'com.eggjs.facade',
      artifactId: 'hessian4-facade',
      version: '1.0.0',
    }],
  }],
};
