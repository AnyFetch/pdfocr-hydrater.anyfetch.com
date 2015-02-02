/**
 * @file Defines the hydrater settings.
 */

// node_env can either be "development" or "production"
var nodeEnv = process.env.NODE_ENV || "development";
var defaultPort = 8000;

// Number of pdf instance to run simultaneously per cluster
var defaultConcurrency = 1;

if(nodeEnv === "production") {
  defaultPort = 80;
}

// Exports configuration
module.exports = {
  env: nodeEnv,
  port: process.env.PORT || defaultPort,

  redisUrl: process.env.REDIS_URL,
  appName: process.env.APP_NAME || "YOUR-APP-NAME",

  concurrency: process.env.HYDRATER_BOILERPLATE_CONCURRENCY || defaultConcurrency,

  opbeat: {
    organizationId: process.env.OPBEAT_ORGANIZATION_ID,
    appId: process.env.OPBEAT_APP_ID,
    secretToken: process.env.OPBEAT_SECRET_TOKEN
  }
};
