import config from 'config';

import { startProcess, waitForCompletion } from './util';


function start(options) {
  const { command, args } = options;
  return startProcess(command, args);
}

function shutdown(err) {
  if (err) {
    console.error(err.stack);
  }

  waitForCompletion(tunnel, () => {});
}

const options = config.get('tunnel');
const tunnel = start(options);

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('uncaughtException', shutdown);
