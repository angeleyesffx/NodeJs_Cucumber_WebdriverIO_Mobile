const WDIOReporter = require('@wdio/reporter').default;
const { TestStats, SuiteStats, RunnerStats, Tag } = require('wdio/reporter');
const axios = require('axios');

class TestRailApi {
     constructor(options) {
         this.config = {};
         this.baseUrl = ``;
         this.projectId = options.projectId;
         this.includeAll = options.includeAll;
         this.config.auth = {
             username: options.username,
             password: options.password
         };
     }
    async updateTestRunResults(runId, results) {
            try {
                const resp = await axios.post(
                    `${this.baseUrl}/add_results_for_cases/${runId}`,
                    { results },
                    this.config,
                );
                return resp;
            } catch (err) {
                console.logger('TestrailReporter').error(`Failed to update test run results: ${err.message}`);
            }
        }

        async updateTestRun(runId, case_ids) {
            const addCaseIds = [];
            try {
                const res = await axios.get(
                    `${this.baseUrl}/get_tests/${runId}`,
                    this.config
                );
                if (res.data.tests.length > 0) {
                    addCaseIds.push(...res.data.tests.map((tests) => tests.case_id));
                }
            } catch (err) {
                logger('TestrailReporter').error(`Error getting test run: ${err.message}`);
            }

            try {
                const resp = await axios.post(
                    `${this.baseUrl}/update_run/${runId}`,
                    { 'case_ids': addCaseIds.concat(case_ids) },
                    this.config
                );
                return resp;
            } catch (err) {
                logger('TestrailReporter').error(`Failed to update test run: ${err.message}`);
            }
        }

        async pushResults(runId, testId, results) {
            try {
                const resp = axios.post(
                    `${this.baseUrl}/add_result_for_case/${runId}/${testId}`,
                    results,
                    this.config,
                );
                return resp;
            } catch (err) {
                logger('TestrailReporter').error(`Failed to push results: ${err.message}`);
            }
        }

        async createTestRun(test, runName) {
            const now = new Date();
            test.name = `${runName} ${now.getDate()}.${now.getMonth()} ${now.getHours()}:${now.getMinutes()}`;

            const resp = await axios.post(
                `${this.baseUrl}/add_run/${this.projectId}`,
                test,
                this.config,
            );
            logger('TestrailReporter').info(`Create new run '${test.name}' with id: ${resp.data.id}`);
            return resp.data.id;
        }

        async getLastTestRun(suiteId, runName) {
            const thirtyMinAgo = new Date();
            thirtyMinAgo.setMinutes(thirtyMinAgo.getMinutes() - 30);
            const date = new Date(thirtyMinAgo);

            const unixTimeStamp = Math.floor(date.getTime() / 1000);
            try {
                const resp = await axios.get(
                    `${this.baseUrl}/get_runs/${this.projectId}&is_completed=0&created_after=${unixTimeStamp}&suite_id=${suiteId}`,
                     this.config
                );
                //const thisrun = resp.data.runs.filter(function (run) {
                //    return run.name.startsWith(runName);
                //});

                //const runId = thisrun.length > 0
                //    ? thisrun[0].id
                //    : await this.createTestRun({
                const runId = await this.createTestRun({
                        suite_id: suiteId,
                        name: runName,
                        include_all: this.includeAll
                    }, runName);

                return runId;
            } catch (err) {
                logger('TestrailReporter').error(`Failed to get last test run: ${err.message}`);
            }
        }
    }
}

const WDIOReporter = require('@wdio/reporter').default;
const logger = require('@wdio/logger');
const TestRailAPI = require('./api.js');
const { ReporterOptions, TestCase, TestResults } = require('./types');

class TestRailReporter extends WDIOReporter {
    constructor(options) {
        options = Object.assign(options, { stdout: false });
        super(options);
        this.api = new TestRailAPI(options);
        this.options = options;
        this.synced = false;
        this.testCases = [];
        this.requestPromises = [];
        this.caps = {};
        this.interval = null;
        this.runId = '';
        this.checkForRun = this.checkForRun.bind(this);

        this.interval = setInterval(this.checkForRun, 1000);
    }

    get isSynchronised() {
        return this.synced;
    }

    checkForRun() {
        if (this.runId !== '') {
            clearInterval(this.interval);
        }
    }

    onRunnerStart(runner) {
        this.caps = runner.capabilities;
    }

    onTestPass(test) {
        if (!this.options.useCucumber) {
            const caseIds = test.title.match(/C\d+/g) || [];
            const comment = `This test case is passed.\n${JSON.stringify(this.caps)}`;
            caseIds.forEach(caseId => {
                this.testCases.push({
                    case_id: caseId.replace('C', ''),
                    status_id: '1',
                    comment,
                    elapsed: test._duration / 1000 + 's'
                });
            });
        }
    }

    onTestFail(test) {
        const caseIds = test.title.match(/C\d+/g) || [];
        const comment = `This test case is failed:\n${JSON.stringify(this.caps)}\n${JSON.stringify(test.errors)}`;
        caseIds.forEach(caseId => {
            this.testCases.push({
                case_id: caseId.replace('C', ''),
                status_id: '5',
                comment,
                elapsed: test._duration / 1000 + 's'
            });
        });
    }

    onTestSkip(test) {
        const caseIds = test.title.match(/C\d+/g) || [];
        const comment = `This test case is skipped.\n${JSON.stringify(this.caps)}`;
        caseIds.forEach(caseId => {
            this.testCases.push({
                case_id: caseId.replace('C', ''),
                status_id: '4',
                comment,
            });
        });
    }

    onSuiteEnd(suiteStats) {
        if (suiteStats.type === 'scenario') {
            const promise = this.updateSuite(suiteStats);
            if (promise) {
                this.requestPromises.push(promise);
            }
        }
    }

    onRunnerEnd() {
        this.requestPromises.push(this.updateTestRun());
        Promise.resolve(this.sync());
    }

    async sync() {
        await Promise.all(this.requestPromises);
        this.synced = true;
    }

    getRunId() {
        return this.options.oneReport
            ? this.api.getLastTestRun(this.options.suiteId, this.options.runName)
            : this.api.createTestRun({
                suite_id: this.options.suiteId,
                name: this.options.runName,
                include_all: this.options.includeAll
            });
    }

    async updateSuite(suiteStats) {
        const values = {
            'general': 0,
            'passed': 0,
            'failed': 0,
            'skipped': 0,
            'errors': []
        };

        for (const test of suiteStats.tests) {
            switch (test.state) {
                case 'failed':
                    values.failed += 1;
                    values.errors.push(`Failed on: ${test.title} \n ${JSON.stringify(test.errors, null, 1)}`);
                    break;
                case 'passed':
                    values.passed += 1;
                    break;
                case 'skipped':
                    values.skipped += 1;
                    break;
            }
        }

        if (values.failed > 0) {
            values.general = 5;
        } else if (values.passed === 0 && values.skipped !== 0) {
            values.general = 4;
        } else {
            values.general = 1;
        }

        const results = {
            status_id: values.general.toString(),
            comment: JSON.stringify(values, null, 1)
        };

        let testId = '-1';
        if (this.options.useCucumber && suiteStats.type === 'scenario') {
            if (this.options.caseIdTagPrefix && suiteStats.tags) {
                for (let i = 0; i < suiteStats.tags.length; i++) {
                    const tag = suiteStats.tags[i];
                    const tagName = JSON.parse(JSON.stringify(tag)).name;
                    if (tagName.includes(this.options.caseIdTagPrefix)) {
                        testId = tagName.replace(`@${this.options.caseIdTagPrefix}`, '').replace('C', '');
                        break;
                    }
                }
            } else {
                testId = suiteStats.title.split(' ')[0].replace('C', '');
            }
        } else {
            testId = suiteStats.fullTitle.split(' ')[0].replace('C', '');
        }
        return this.api.pushResults(this.runId, testId, results);
    }

    async updateTestRun() {
        const caseIds = this.testCases.map((test) => test.case_id);
        if (caseIds.length > 0) {
            await this.api.updateTestRun(this.runId, caseIds);
            await this.api.updateTestRunResults(this.runId, this.testCases);
        }
    }

    getTestCasesArray() {
        return this.testCases;
    }
}
