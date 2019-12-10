
process.env.env = 'pro';
const webpack = require('webpack');
const config = require('../config/build');
const {webpackLog} = require("./utils");
require('../watch').once().then(() => {
  webpack(config,webpackLog);
});
