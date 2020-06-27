'use strict';

const fs = require('fs');
const path = require('path');
const antpb = require('antpb');
const protocol = require('sofa-bolt-node');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    const { baseDir, rpc } = this.app.config;
    const protoPath = path.join(baseDir, 'run/proto.json');
    const hessianVersion = rpc.hessianVersion || '3.0';
    protocol.setOptions({ hessianVersion });

    // 加载 proto
    if (fs.existsSync(protoPath)) {
      const proto = antpb.fromJSON(require(protoPath));
      protocol.setOptions({ proto });
    }
  }
}

module.exports = AppBootHook;
