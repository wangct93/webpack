





exports.webpackLog = (err,stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.log(info.errors);
  }

  if (stats.hasWarnings()) {
    console.log(info.warnings);
  }
};
