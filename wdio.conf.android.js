const projectPath = require("path");
const {config} = require("./wdio.conf");
const androidAppPath = projectPath.join(process.cwd(), "application/android/test.apk");

config.port = 4723;
config.specs = ["./tests/features/*.feature"];
config.capabilities = [{
       //This capabilities only works for local Simulation Appium web test
       "appium:platformVersion": "13.0",
       "appium:platformName": "Android",
       "appium:deviceName": "sdk_gphone64_arm64",
       "appium:udid": "emulator-5554",
       "appium:automationName": "UIAutomator2",
       "appium:appium.bundleId": process.env.APP_ID,
       "appium:app": androidAppPath,
       "appium:unlockType": "pin",
       "appium:unlockKey": "1234",
       "appium:fullReset": true
}]

exports.config = config;