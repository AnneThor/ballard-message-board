const express = require("express");
const app = express();

const appConfig = require("./config/main-config.js");
appConfig.init();

const routeConfig = require("./config/route-config.js");
routeConfig.init(app);

module.exports = app;
