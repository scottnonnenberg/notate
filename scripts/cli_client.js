import { startProcess } from './util';


function startServer() {
  const server = startProcess('npm', ['run', 'serve']);

  server.on('close', function(code) {
    console.log(`cli-client: server exited with code ${code}`);
  });

  return server;
}

function startTests(url, cb) {
  const tests = startProcess('npm', ['run', 'test-client', '--', url]);

  tests.on('close', function(code) {
    console.log(`cli-client: tests exited with code ${code}`);
    return cb(null, code);
  });

  return tests;
}

function shutdown(err) {
  if (err) {
    console.error(err.stack);
  }

  server.kill();
  tests.kill();

  setTimeout(function() {
    process.exit(testReturnCode);
  }, 2000);
}


const url = process.argv[2];
const server = startServer();
let tests;
let testReturnCode = 1;

setTimeout(function() {
  tests = startTests(url, function(err, code) {
    if (err) {
      return shutdown(err);
    }

    testReturnCode = code;
    shutdown();
  });
}, 500);

process.on('SIGTERM', function() {
  console.log('cli-client: got SIGTERM!');
  shutdown();
});

process.on('SIGINT', function() {
  console.log('cli-client: got SIGINT!');
  shutdown();
});

process.on('uncaughtException', function(err) {
  shutdown(err);
});

process.on('exit', function() {
  console.log('cli-client: shutting down');
});
