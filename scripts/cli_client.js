import { spawn } from 'child_process';


function startProcess(command, args) {
  var child = spawn(command, args, {
    // silent: true,
    stdio: 'pipe'
  });

  child.stdout.on('data', function(data) {
    process.stdout.write(data.toString());
  });

  child.stderr.on('data', function(data) {
    process.stderr.write(data.toString());
  });

  return child;
}


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

function shutdown() {
  server.kill();
  if (tests) {
    tests.kill();
  }
}


const url = process.argv[2];
const server = startServer();
let tests;
let testReturnCode = 1;

server.on('close', function() {
  process.exit(testReturnCode);
});

setTimeout(function() {
  tests = startTests(url, function(err, code) {
    testReturnCode = code;
    server.kill();
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

process.on('exit', function() {
  console.log('cli-client: shutting down');
});
