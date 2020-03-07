
const baseWebpackConfig = require('./base');
const {webpackConfigFormat} = require("../utils/utils");

module.exports = webpackConfigFormat({
  mode:'production',
  ...baseWebpackConfig,
});



