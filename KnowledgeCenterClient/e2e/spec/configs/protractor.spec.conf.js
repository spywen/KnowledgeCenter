// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const { JUnitXmlReporter } = require('jasmine-reporters');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './../**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [ '--headless', '--window-size=1250,800' ]
    }
  },
  SELENIUM_PROMISE_MANAGER: false, // ENABLE ASYNC EXECUTION
  directConnect: true,
  baseUrl: 'http://localhost:4200',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './../../configs/tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    var junitReporter = new JUnitXmlReporter({
      savePath: require('path').join(__dirname, './../../../reports/e2e/spec'),
      consolidateAll: true
    });
    jasmine.getEnv().addReporter(junitReporter);
  }
};
