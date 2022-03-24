let config = require('./protractor.visual.conf.js').config;

config.plugins[0].options.autoSaveBaseline = true;
exports.config = config;
