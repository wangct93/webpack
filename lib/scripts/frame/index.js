
const util = require('@wangct/node-util');
const {resolveLib} = require("../../utils/utils");
const {logInfo} = require("@wangct/node-util/lib/log");
const {pathResolve} = require("@wangct/node-util/lib/path");
const {getCmdParams} = require("@wangct/node-util/lib/system");
const {fileCopy} = require("@wangct/node-util/lib/file");

module.exports = {
  start,
};

function start(params = getCmdParams()){
  logInfo('开始拷贝');
  return fileCopy(resolveLib('template/frame'),params.output || 'src/components/frame');
}
