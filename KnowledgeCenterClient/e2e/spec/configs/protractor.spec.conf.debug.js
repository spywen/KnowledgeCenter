let config = require('./protractor.spec.conf.js').config;

config.capabilities.chromeOptions.args = [ '--window-size=1250,800' ];
exports.config = config;
