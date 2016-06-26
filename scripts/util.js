import { spawn } from 'child_process';


export function startProcess(command, args) {
  const child = spawn(command, args, {
    // silent: true,
    stdio: 'pipe',
  });

  child.stdout.on('data', data => process.stdout.write(data.toString()));
  child.stderr.on('data', data => process.stderr.write(data.toString()));
  child.on('close', () => {
    child.closed = true;
  });

  return child;
}

export function waitForCompletion(child, cb) {
  if (child.closed) {
    return cb();
  }

  child.kill();
  child.on('close', cb);
}
