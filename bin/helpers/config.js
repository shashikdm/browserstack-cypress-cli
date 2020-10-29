var config = require('./config.json');

config.env = process.env.BSTACK_CYPRESS_NODE_ENV || "production";

if(config.env !== "production") {
  // load config based on env
  require('custom-env').env(config.env);

  config.uploadUrl = process.env.UPLOAD_URL;
  config.rails_host = process.env.RAILS_HOST;
  config.dashboardUrl = process.env.DASHBOARD_URL;
  config.usageReportingUrl = process.env.USAGE_REPORTING_URL;
}

config.cypress_v1 = `${config.rails_host}/automate/cypress/v1`;
config.buildUrl = `${config.cypress_v1}/builds/`;
config.buildStopUrl = `${config.cypress_v1}/builds/stop/`;
config.fileName = "tests.zip";

module.exports = config;
