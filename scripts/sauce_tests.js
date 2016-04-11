import fs from 'fs';

import { startProcess, waitForCompletion } from './util';
import superagent from 'superagent';
import _ from 'lodash';
import config from 'config';


function startServer(options) {
  const { command, args } = options;
  const server = startProcess(command, args);

  server.on('close', function(code) {
    console.log(`sauce-tests: server exited with code ${code}`);
  });

  return server;
}

function startTunnel(options) {
  const { command, args } = options;
  const tunnel = startProcess(command, args);

  tunnel.on('close', function(code) {
    console.log(`sauce-tests: tunnel exited with code ${code}`);
  });

  return tunnel;
}

function startTests(options, cb) {
  const {username, key, url, platforms, timeout, framework} = options;
  const target = `https://saucelabs.com/rest/v1/${username}/js-tests`;
  const payload = {
    platforms,
    url,
    timeout,
    framework
  };

  superagent
    .post(target)
    .send(payload)
    .auth(username, key)
    .end(function(err, res) {
      if (err) {
        return cb(err);
      }

      const jobs = res.body['js tests'];
      console.log(`queued ${jobs.length} tests`);

      return cb(null, jobs);
    });
}

function pollForTestCompletion(jobs, options, cb) {
  const {username, key, pollTimeout} = options;
  const target = `https://saucelabs.com/rest/v1/${username}/js-tests/status`;
  const payload = {
    'js tests': jobs
  };

  var next = function () {
    setTimeout(function() {
      pollForTestCompletion(jobs, options, cb);
    }, pollTimeout);
  };

  superagent
    .post(target)
    .send(payload)
    .auth(username, key)
    .end(function(err, res) {
      if (err) {
        console.log('Error pulling completion status: ' + err.stack);
        return next();
      }

      const result = res.body;
      const jobDetails = res.body['js tests'];

      if (!result.completed) {
        processProgress(jobDetails);
        return next();
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

  return testResult.tests === 0;
}

function processProgress(results) {

  const summary = _.countBy(results, function(result) {
    result = result || {};
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

  waitForCompletion(server, function() {
    waitForCompletion(tunnel, function() {
      process.exit(testReturnCode);
    });
  });
}


const options = config.get('sauce');
const server = startServer(options.serverOptions);
const tunnel = startTunnel(options.tunnelOptions);
let testReturnCode = 1;

setTimeout(function() {
  startTests(options, function(err, jobs) {
    if (err) {
      return shutdown(err);
    }

    pollForTestCompletion(jobs, options, function(err, result) {
      if (err) {
        return shutdown(err);
      }

      testReturnCode = processResults(result);

      return shutdown();
    });
  });
}, 500);

// TODO: cancel outstanding jobs on cancel? starting a full run takes a long time!
//   https://github.com/axemclion/grunt-saucelabs/blob/master/src/Job.js#L181

process.on('SIGTERM', function() {
  console.log('sauce-tests: got SIGTERM!');
  shutdown();
});

process.on('SIGINT', function() {
  console.log('sauce-tests: got SIGINT!');
  shutdown();
});

process.on('uncaughtException', function(err) {
  shutdown(err);
});

process.on('exit', function() {
  console.log('sauce-tests: shutting down');
});
