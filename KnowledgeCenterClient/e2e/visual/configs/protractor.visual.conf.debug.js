let config = require('./protractor.visual.conf.js').config;

config.capabilities.chromeOptions.args = [ '--window-size=1250,800' ];
exports.config = config;
