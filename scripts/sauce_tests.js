import fs from 'fs';

import superagent from 'superagent';
import _ from 'lodash';
import config from 'config';

import info from '../package.json';

const HALF_SECOND = 500;

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
  if (stop) {
    return;
  }

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

      const jobDetails = res.body['js tests'];
      const progress = processProgress(jobDetails);

      console.log(progress);

      if (progress['test session in progress']
       || progress['test queued']
       || progress['test new']) {
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

  return summary;
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

  stop = true;

  process.exitCode = testReturnCode;
}

const options = config.get('sauce');
let testReturnCode = 1;
let stop = false;

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
