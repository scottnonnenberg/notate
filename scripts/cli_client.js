import { startProcess, waitForCompletion } from './util';


const STARTUP_DELAY = 500;


function startServer() {
  const server = startProcess('npm', ['start']);

  server.on('close', code => console.log(`cli-client: server exited with code ${code}`));

  return server;
}

function startTests(url, cb) {
  const tests = startProcess('npm', ['run', 'test-client', '--', url]);

  tests.on('close', code => {
    console.log(`cli-client: tests exited with code ${code}`);
    return cb(null, code);
  });

  return tests;
}

function shutdown(err) {
  if (err) {
    console.error(err.stack);
  }

  waitForCompletion(server, () => {
    waitForCompletion(tests, () => {
      process.exitCode = testReturnCode;
      // wait for the process to die naturally
    });
  });
}

const url = process.argv[2];
const server = startServer();
let tests;
let testReturnCode = 1;

setTimeout(() => {
  tests = startTests(url, (err, code) => {
    if (err) {
      return shutdown(err);
    }

    testReturnCode = code;
    return shutdown();
  });
}, STARTUP_DELAY);

process.on('SIGTERM', () => {
  console.log('cli-client: got SIGTERM!');
  shutdown();
});

process.on('SIGINT', () => {
  console.log('cli-client: got SIGINT!');
  shutdown();
});

process.on('exit', () => {
  console.log('cli-client: shutting down');
});
