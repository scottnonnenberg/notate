import fs from 'fs';

import superagent from 'superagent';
import _ from 'lodash';
import config from 'config';

import info from '../package.json';
import { startProcess, waitForCompletion } from './util';


const HALF_SECOND = 500;

function startServer(options) {
  const { command, args } = options;
  const server = startProcess(command, args);

  server.on('close', code => console.log(`sauce-tests: server exited with code ${code}`));

  return server;
}

function startTunnel(options) {
  const { command, args } = options;
  const tunnel = startProcess(command, args);

  tunnel.on('close', code => console.log(`sauce-tests: tunnel exited with code ${code}`));

  return tunnel;
}


function startTests(options, cb) {
  // https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods
  const { username, key, name, url, platforms, timeout, framework } = options;
  const target = `https://saucelabs.com/rest/v1/${username}/js-tests`;
  const payload = {
    platforms,
    url,
    timeout,
    framework,
    name,
    build: info.version,
  };

  superagent
    .post(target)
    .send(payload)
    .auth(username, key)
    .end((err, res) => {
      if (err) {
        return cb(err);
      }

      const jobs = res.body['js tests'];
      console.log(`queued ${jobs.length} tests`);

      return cb(null, jobs);
    });
}

function delayRecurse(fn, pollTimeout, args) {
  const array = Array.prototype.slice.call(args, 0);
  setTimeout(() => fn(...array), pollTimeout);
}

function pollForTestCompletion(jobs, options, cb) {
  const args = arguments; // eslint-disable-line
  const { username, key, pollTimeout } = options;
  const target = `https://saucelabs.com/rest/v1/${username}/js-tests/status`;
  const payload = {
    'js tests': jobs,
  };

  superagent
    .post(target)
    .send(payload)
    .auth(username, key)
    .end((err, res) => {
      if (err) {
        console.log(`Error pulling completion status: ${err.stack}`);
        return delayRecurse(pollForTestCompletion, pollTimeout, args);
      }

      const result = res.body;
      const jobDetails = res.body['js tests'];

      if (!result.completed) {
        processProgress(jobDetails);
        return delayRecurse(pollForTestCompletion, pollTimeout, args);
      }

      return cb(null, jobDetails);
    });
}

function isFailure(result) {
  const testResult = result.result || {};

  const failure = _.isString(testResult) || testResult.stackTrace || testResult.failures;
  if (failure) {
    return true;
  }

  // if the page never reports results, we might get zeros across the board
  // also allows for a totally empty object
  return !testResult.tests;
}

function processProgress(results) {
  const summary = _.countBy(results, providedResult => {
    const result = providedResult || {};
    return result.status || (isFailure(result) ? 'failed' : 'succeeded');
  });

  console.log(summary);
}

function processResults(results) {
  fs.writeFileSync('sauce_results.json', JSON.stringify(results, null, '  '));

  const failures = _.filter(results, isFailure);

  if (failures.length) {
    console.log('Failures:');
    console.log(failures);
  }
  else {
    console.log('All tests succeeded!');
  }

  return failures.length ? 1 : 0;
}


function shutdown(err) {
  if (err) {
    console.error(err.stack);
  }

  waitForCompletion(server, () => {
    waitForCompletion(tunnel, () => {
      process.exitCode = testReturnCode;
    });
  });
}


const options = config.get('sauce');
const server = startServer(options.serverOptions);
const tunnel = startTunnel(options.tunnelOptions);
let testReturnCode = 1;

setTimeout(() => {
  startTests(options, (err, jobs) => {
    if (err) {
      return shutdown(err);
    }

    pollForTestCompletion(jobs, options, (err, result) => {
      if (err) {
        return shutdown(err);
      }

      testReturnCode = processResults(result);

      return shutdown();
    });
  });
}, HALF_SECOND);

process.on('SIGTERM', () => {
  console.log('sauce-tests: got SIGTERM!');
  shutdown();
});

process.on('SIGINT', () => {
  console.log('sauce-tests: got SIGINT!');
  shutdown();
});

process.on('uncaughtException', err => shutdown(err));

process.on('exit', () => console.log('sauce-tests: shutting down'));
