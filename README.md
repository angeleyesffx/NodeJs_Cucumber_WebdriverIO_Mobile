# Prepare Your Environment Guide:

If you already have NodeJS environment, you can skip the Prepare your environment Guide,
however if it´s the first time that you configure a NodeJS development environment make sure to follow the instructions bellow:


# Installation Guide for MacOS:

#### Step 1: Download and Install NodeJS on the stable version: - [NodeJS](https://nodejs.org/en/download)

#### Step 2: To avoid issues with zsh, install HomeBrew: -[HomeBrew Installation Guide](http://docs.brew.sh/Installation)

#### Step 3: Install JAVA JDK: -[Open JDK](https://www.oracle.com/in/java/technologies/downloads/)

#### Step 4: Setup Enviroment Variables:

### NOTE:

On MacOS 10.15 Catalina or later, the default Terminal shell switch from bash(Bourne-again shell) to zsh( Z shell).

> For bash, the environment variables are setup at ~/.bash_profile or ~/.bashrc .
> 
> For zsh, the environment variables are setup at ~/.zshenv or ~/.zshrc .
> 
> Run `$SHELL` command line to check enviroment variable to determine the current shell is in use.


In older MacOS version you can find more details here: [guide](https://mkyong.com/java/how-to-set-java-home-environment-variable-on-mac-os-x)

##### Step 4.1: Open the environment configuration file:

```sh
nano ~/.zshenv 
```
or 
```sh
nano ~/.zshrc
```
##### Step 4.2: Edit the file adding the following information:

`export JAVA_HOME=$(/usr/libexec/java_home)`

##### Step 4.3: Check the changes

```sh
echo $JAVA_HOME
```

#### Step 5: Start the Testware Project

##### For a New Project:  Step 5.1: Install WebdriverIO

```sh
npm init wdio@latest .
```

If you intend to start a new project using WebdriverIO with the same configuration used in this project, make sure to answer the WDIO Configuration Wizard with the following information:

	===============================
	🤖 WDIO Configuration Wizard 🧙
	===============================
	
	? A project named "NodeJs_Cucumber_WebdriverIO_Mobile" was detected at "/Users/angeleyes/dev/NodeJs_Cucumber_WebdriverIO_Mobile", correct? Yes
	? What type of testing would you like to do? E2E Testing - of Web or Mobile Applications
	? Where is your automation backend located? On my local machine
	? Which environment you would like to automate? Mobile - native, hybrid and mobile web apps, on Android or iOS
	? Which mobile environment you'ld like to automate? Android - native, hybrid and mobile web apps, tested on emulators and real devices
	    > using UiAutomator2 (https://www.npmjs.com/package/appium-uiautomator2-driver)
	? Which framework do you want to use? Cucumber (https://cucumber.io/)
	? Do you want to use a compiler? Babel (https://babeljs.io/)
	? Do you want WebdriverIO to autogenerate some test files? Yes
	? What should be the location of your feature files? /Users/angeleyes/dev/NodeJs_Cucumber_WebdriverIO_Mobile/features/**/*.feature
	? What should be the location of your step definitions? /Users/angeleyes/dev/NodeJs_Cucumber_WebdriverIO_Mobile/features/step-definitions/steps.js
	? Do you want to use page objects (https://martinfowler.com/bliki/PageObject.html)? Yes
	? Where are your page objects located? /Users/angeleyes/dev/NodeJs_Cucumber_WebdriverIO_Mobile/features/pageobjects/**/*.js
	? Which reporter do you want to use? spec, json, cucumber-json, testrail
	? Do you want to add a plugin to your test setup? wait-for: utilities that provide functionalities to wait for certain conditions till a defined task 
	is complete.
	   > https://www.npmjs.com/package/wdio-wait-for, angular-component-harnesses: support for Angular component test harnesses
	   > https://www.npmjs.com/package/@badisi/wdio-harness, Testing Library: utilities that encourage good testing practices laid down by 
	dom-testing-library.
	   > https://testing-library.com/docs/webdriverio-testing-library/intro
	? Do you want to add a service to your test setup? appium, slack, cucumber-viewport-logger
	? Do you want me to run `npm install` Yes

##### For a Existent Project: Step 5.1: Clone the project

    ```sh
	git clone YOUR_PROJECT_GIT
    ```

##### Step 5.2: Install the dependencies

```sh
npm install
```

#### Step 6: Install and Step Appim Inspector: -[Appium Inspector](https://github.com/appium/appium-inspector)

#### Step 7: Testing the .apk or .app

- Download the test version of the .apk(Android) or .app(iOS)
- Move the system under test to the appropriate folder Android(./application/android) or iOS(./application/ios) 

#### Step 8: Executing the Test Cases

#### Execution Guide

## To push a result to Test Rail you should add a Tag with the Test Case ID, like the following example:

> Feature: Login on the Application
> 
>    @C123456 @ios @android
>    Scenario: As a user, I want to login
>         Given ... 


## To run a test with a special tag:

##### android:

```bash
PLATFORM=android npm run test_android "@tag"
   ```
##### iOS:

```bash
PLATFORM=ios npm run test_ios "@tag"
```
