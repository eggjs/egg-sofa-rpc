'use strict';

module.exports = agent => {
  agent.beforeStart(async function() {
    // 可能不需要 sofaRegistry，比如直连的情况
    if (!agent.sofaRegistry) return;

    await agent.sofaRegistry.ready();
  });
};
