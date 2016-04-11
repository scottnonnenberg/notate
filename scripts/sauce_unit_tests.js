import fs from 'fs';

import { startProcess } from './util';
import superagent from 'superagent';
import _ from 'lodash';

// Platforms, in priority order:
//   Chrome
//   Firefox
//   IE 11
//   Mobile Safari
//   Chrome for Android
//   Safari
//   Edge

const username = 'scottnonnenberg';
const key = '3ad04f60-6543-4b06-aede-03c6c5046ea1';
const url = 'https://gammacorvi.ngrok.io/test/all.html';

// Total: 71.47%
//   (from mobile table in spreadsheet)
//   Note: Doesn't capture various OSes very well
//   Also completely blind to issues specific to older browsers and OSes
const platforms = [
  // Chrome
  ['Windows 10', 'chrome', '49'], // 14.17%
  ['Windows 10', 'chrome', '48'], // 13.03%

  // Android - chrome: 14.92%, general: 4.49%
  ['Linux', 'android', '5.1'],
  ['Linux', 'android', '4.4'],

  // Mobile Safari - ipad: 3.13%, iphone: 7.02%
  ['Mac 10.10', 'iphone', '9.2'],
  ['Mac 10.10', 'iphone', '8.4'],

  // Firefox
  ['Windows 10', 'firefox', '45'], // 2.55%
  ['Windows 10', 'firefox', '44'], // 3.74%

  // IE 11 - 5.58%
  ['Windows 10', 'internet explorer', '11'],

  // Safari
  ['Mac 10.11', 'safari', '9'], // 1.56%
  ['Mac 10.10', 'safari', '8'], // 0.29%

  // Edge
  ['Windows 10', 'microsoftedge', '13'] // 0.99%
];

// function getPlatforms(options, cb) {
//   const {username, key} = options;
//   const target = 'https://saucelabs.com/rest/v1/info/platforms/webdriver';

//   superagent
//     .get(target)
//     .auth(username, key)
//     .end(function(err, res) {
//       if (err) {
//         return cb(err);
//       }

//       return cb(null, res.body);
//     });
// }

// function displayPlatforms(platforms) {
//   // eliminate any weird dev/beta versions
//   platforms = _.reject(platforms, platform => isNaN(platform.short_version = parseFloat(platform.short_version)));


//   platforms = _.orderBy(platforms, ['api_name', 'short_version', 'os'], ['asc', 'desc', 'asc']);

//   platforms = _.map(platforms, function(platform) {
//     return `['${platform.os}', '${platform.api_name}', '${platform.short_version}']` +
//       ` (${platform.long_name}, ${platform.long_version})`;
//   });

//   console.log(platforms.join('\n'));
// }

// ---

function startServer() {
  const server = startProcess('npm', ['run', 'serve', '--', '8001']);

  server.on('close', function(code) {
    console.log(`sauce-unit-tests: server exited with code ${code}`);
  });

  return server;
}

function startNGrok() {
  const server = startProcess('npm', ['run', 'ngrok', '--', '8001']);

  server.on('close', function(code) {
    console.log(`sauce-unit-tests: ngrok exited with code ${code}`);
  });

  return server;
}

function startRun(options, cb) {
  const {username, key, url, platforms, timeout} = options;
  const target = `https://saucelabs.com/rest/v1/${username}/js-tests`;
  const payload = {
    platforms,
    url,
    timeout,
    framework: 'mocha'
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

function pollForCompletion(tests, options, cb) {
  const {username, key, pollTimeout} = options;
  const target = `https://saucelabs.com/rest/v1/${username}/js-tests/status`;
  const payload = {
    'js tests': tests
  };

  var next = function () {
    setTimeout(function() {
      pollForCompletion(tests, options, cb);
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

function processProgress(jobs) {
  const summary = _.countBy(jobs, function(job) {
    job = job || {};
    const result = job.result || {};

    return job.status || (result.failures ? 'failed' : 'succeeded');
  });

  console.log(summary);
}

function processResults(results) {
  fs.writeFileSync('sauce_results.json', JSON.stringify(results, null, '  '));

  const failures = _.filter(results, function(item) {
    return item.result.failures > 0;
  });

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

  server.kill();
  ngrok.kill();

  setTimeout(function() {
    process.exit(testReturnCode);
  }, 2000);
}

const options = {
  username,
  key,
  url,
  platforms,
  timeout: 20 * 1000,
  pollTimeout: 10 * 1000
};

// ---

// const rawPlatforms = require('../platforms.json');
// displayPlatforms(rawPlatforms);

// ---

// getPlatforms(options, function(err, platforms) {
//   if (err) {
//     throw err;
//   }

//   displayPlatforms(platforms);
// });

// ---

const server = startServer();
const ngrok = startNGrok();
let testReturnCode = 1;

setTimeout(function() {
  startRun(options, function(err, tests) {
    if (err) {
      return shutdown(err);
    }

    pollForCompletion(tests, options, function(err, result) {
      if (err) {
        return shutdown(err);
      }

      testReturnCode = processResults(result);

      return shutdown();
    });
  });
}, 500);

// TODO: cancel outstanding jobs here? starting a full takes a long time!
//   https://github.com/axemclion/grunt-saucelabs/blob/master/src/Job.js#L181

process.on('SIGTERM', function() {
  console.log('sauce-unit-tests: got SIGTERM!');
  shutdown();
});

process.on('SIGINT', function() {
  console.log('sauce-unit-tests: got SIGINT!');
  shutdown();
});

process.on('uncaughtException', function(err) {
  shutdown(err);
});

process.on('exit', function() {
  console.log('sauce-unit-tests: shutting down');
});
