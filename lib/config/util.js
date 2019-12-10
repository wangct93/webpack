
exports.isDevEnv = isDevEnv;

function isDevEnv(){
  return process.env.env !== 'pro';
}

