# Introduction 
The aim of Knowledge Center Portal is to gather multiple modules in order to share to users/employees: knowledge.
This portal is also a way to practice and put in place together multiple new technologies by allowing everyone to participate to its development.  

# Technologies
* Back-End: Microsoft .NET Core
* Front-End: Angular
* Style: Less & Angular material

# Requirements
* NodeJS >= 10.16.0 (https://nodejs.org/en/)
* Git >= 2.17.1.windows.2 (https://git-scm.com/)
* .NET core 2.2 (https://dotnet.microsoft.com/download)
* Visual Studio code (https://visualstudio.microsoft.com/fr/) (Visual Studio if you prefer and have the license... Trainees go your way ;))
    * (MANDATORY) Plugin C#
    * (MANDATORY) Plugin .NET Core Test Explorer
    * (MANDATORY) Plugin TSLint

# Getting Started
### Git
* Clone git repository: `git clone https://capgeminisophia@dev.azure.com/capgeminisophia/KnowledgeCenter/_git/KnowledgeCenter`

### Front-End (FE)
* Open KnowledgeCenterClient folder thanks to Visual Studio code
* Open View > Terminal
* Execute command `npm i`
* Execute command `npm run serve`. Will watch on Client modifications and reload the web page for any modification (saved) done inside client code.

### Back-End (BE)
Thanks to C# Plugin you will be able to build and run the website from Visual Studio code.
* Open KnowledgeCenterServer thanks to Visual Studio code
* Click on "Debug" button on the left of Visual Studio code window
* Verify that configuration "Development" is selected
* Run by clicking on "play" green icon
**IMPORTANT: the website is automatically launched on port: 44362 (http://localhost:44362). !!! CLOSE THIS WEB PAGE ELSE NPM RUN SERVE COMMAND WILL NOT WORK !!!** 

Open web page: http://localhost:4200 --> You can now use and work on Knowledge Center portal! 

# Build and Test
### Front-End
Several commands enable us to work with Angular client:
* `npm i` (<=> npm install) to install all NPM dependencies
* (NOT RECOMMANDED) `npm start` to build the client and copy paste sources to the wwwroot folder of Back-End application. Moreover, this command will watch all your modifications on Front-End side in order to live copy paste sources to wwwroot folder (don't forget to refresh each time the website thanks to CTRL+R with inspector open to avoid cache issue). With this command open website with address: http://localhost:44362.
* `npm run serve` to run the client and enjoy benefit of live reload of web page when we are doing saving modifications on client. With this command open website with address: http://localhost:4200.
* `npm run build` to build the client and copy paste minified sources to wwwroot folder of Back-End application (sources generated like for production)
* `npm run validation` to run lint (quality/syntax verifications) + unit tests (one shot without browser) + run a production build of UI.
* `npm run lint` to run lint (quality/syntax verifications)
* `npm run test` to run unit tests in watch mode (trick: run only one test file by prefixing 'describe' with 'f': 'fdescribe')
* `npm run e2e` (WARNING: be sure to run BE in E2e environment) to run regression tests (SPEC + VISUAL)
* `npm run e2e:spec` (!!WARNING!!: be sure to run BE in E2e environment) to run SPECIFICATION regression tests <=> flows
* `npm run e2e:spec:headwith` (!!WARNING!!: be sure to run BE in E2e environment) to run SPECIFICATION regression tests <=> flows with visible Chrome windows
* `npm run e2e:visual` (!!WARNING!!: be sure to run BE in E2e environment) to run VISUAL regression tests <=> screenshots comparison (reference are 'goldens' -> see goldens folder)
* `npm run e2e:visual:update-goldens` (!!WARNING!!: be sure to run BE in E2e environment) to update goldens for VISUAL regression tests <=> will take screenshots of all screen tested with visual regression testing and replace old goldens by new goldens!

### Back-End
* Thanks to C# Plugin you will be able to build and run the website from Visual Studio code. You can go to Debug menu of Visual Studio code and you just need to select 'Development' (to dev) or 'E2e' (to execute e2e regression tests with a fake SQLLite db) then click on "play" button to build and run the website. 
* Thanks to .NET Core Test Explorer Plugin you will be able to see and run your unit tests. After installing this plugin you will see a new button on the left of Visual Studio code window in order to go through all your tests. 

### E2E tests 
All E2E tests could be found inside 'e2e' folder on the root of client project. 
4 folders are present: 
* configs: you don't care
* helpers: where are stored all the helpers that can be reused for any new module to test (especially form helper !!)
* spec: contains all SPEC tests -> avoid flow regressions thanks to simulation of user actions on application. 
* visual: contains all VISUAL tests -> avoid visual regressions thanks to comparison of screenshots. 

All the npm commands are prefixed with 'e2e' (ex: e2e, e2e:serve, e2e:spec, e2e:visual:debug etc...)
All tests are scripted inside spec and visual folders which contains one file per module.
All the tests and helpers methods should be developped as async for debug purpose (TBC). 

#### Tips
* You can run one test file ONLY by prefixing 'describe' with 'f': 'fdescribe'. 
* You can run one test ONLY by prefixing 'it' with 'f': 'fit'. 
* In order to slow down you tests you can use command `await browser.sleep(5000)`. 

***IMPORTANT*** : 
* **In order to run locally successfully E2E tests -> BE should be runned in E2E mode!!!!! (from Visual studio code / Debug / Run E2E)**
* Those tests are really interacting with back-end. Only database is mocked thanks to a memory database. Of course, data should be configured. In order to configure those data just have a look on COnfigurationProvider on be side. 

#### Work with VISUAL E2E tests (spec folder)
SPEC E2E tests are simulating real flow of action on the web application. 
The idea is to be sure that there is no regressions. 
The spec folder contains mainly all modules test files. 

In order to spec test a new module: 
* copy paste existing test file
* rename this file by [module].module.e2e-spec.ts
* script your tests thanks to helpers
* execute you tests... (and don't forget to prefix 'describe' or 'it' by 'f' if you want to avoid to execute all existing tests !)

Here several ways to proceed:
* [NOT ADVISED] you can simply run them with command: `npm run e2e:spec` (this command will start for you new instance of web app on port 5000)
* [ADVISED] you can also run an instance of the web app thanks to `npm run e2e:serve` (port 4200) and use Visual Studio code launcher: 'E2E - SPEC - Debug'.
By proceeding like that -> you just need to start once the web app!! Then you will be able to execute efficiently dozen of times execution of your tests. Moreover, have open wep app is cool in order to know what you want next to test ;) 

#### Work with VISUAL E2E tests (visual folder)
VISUAL E2E tests are comparing current screen of the application with what we called: 'goldens'. 
The idea is to be sure that there is no visual regressions. 
The visual folder contains: 
* configs
* goldens: reference screenshots
* (temp): once tests are running this folder will appeared with diff detected accross screenshots
* all modules test files...

In order to visual test a new module: 
* copy paste existing test file
* rename this file by [module].module.e2e-visual.ts
* script your tests thanks to helpers in order to have the page that you want to test in the state that you want to test
* at the end of each of your tests you should have something like: `await _.visualComparison.compareScreens('[module].[id of the test]');` in order to take screenshot.
* run your tests thanks to the command: `npm run e2e:visual:update-goldens`: this command will create for you goldens as you can see insie goldens folder.

Remarks: if you want to regenerate goldens -> remove them manually from golden folder.

Then you can use following command to run tests whioch will compare your goldens with current screen of the application: `npm run e2e:visual`

**WARNING**: for now don't know how to debug E2E tests without generating breaking goldens with invalid windows size...

# Contribute
0. Found a Work Item on Azure DevOps (or propose it!!): https://dev.azure.com/capgeminisophia/KnowledgeCenter/_boards/board/t/KnowledgeCenter%20Team
1. Follow "Getting Started" section, then Create a branch thanks to git
2. Implement your feature
3. Add unit tests (FE & BE)
4. Be sure that BE & FE is building and unit tests are all green (for FE prefer command `npm run validation`)
5. Commit and push your modifications
6. Open Azure DevOps: https://dev.azure.com/capgeminisophia and create a Pull Request (PR)
    * Add a clear title and a clear description to your PR
    * Link a Work item / Task
    * Be sure that Continuous Intergation (CI) build is succeeded
    * Search for one vote of a mandatory reviewer

# Sources
* Angular: https://angular.io/
* Angular CLI: https://cli.angular.io/ (can be used without any global installation thanks to command npm run ng [COMMAND])
* Angular Material: https://material.angular.io/
* Material icons: https://material.io/tools/icons/?style=baseline 
* Material colors: https://material-ui.com/customization/color/
* .NET core: https://docs.microsoft.com/fr-fr/dotnet/core/ 