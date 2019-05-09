"use strict";

var path = require('path');

var defineConfig = {};

try {
  defineConfig = require(path.resolve(process.cwd(), 'config/config'));
} catch (e) {}

module.exports = defineConfig;