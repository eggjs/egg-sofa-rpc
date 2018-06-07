'ues strict';

module.exports = {
  write: true,
  plugin: 'autod-egg',
  prefix: '^',
  devprefix: '^',
  exclude: [
    'test/fixtures',
  ],
  devdep: [
    'autod',
    'autod-egg',
    'egg-bin',
    'egg-ci',
    'eslint',
    'eslint-config-egg',
    'contributors',
  ],
  keep: [],
  semver: [],
};
