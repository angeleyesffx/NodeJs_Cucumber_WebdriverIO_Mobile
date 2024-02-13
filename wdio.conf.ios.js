const projectPath = require("path");
const {config} = require("./wdio.conf");
const iosAppPath = projectPath.join(process.cwd(), "application/ios/test.app");

config.port = 4723;
config.specs = ["./tests/features/*.feature"];
config.capabilities = [{
       //This capabilities only works for local Simulation Appium web test
       "appium:platformVersion": "17.2",
       "appium:platformName": "iOS",
       "appium:deviceName": "iPhone 15",
       "appium:automationName": "XCUItest",
       "appium:appium.bundleId": process.env.BUNDLE_ID,
       "appium:app": iosAppPath,
       "appium:unlockType": "pin",
       "appium:unlockKey": "1234",
       "appium:fullReset": true
}]

exports.config = config;