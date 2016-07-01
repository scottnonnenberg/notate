import { spawn } from 'child_process';


export function startProcess(command, args) {
  const child = spawn(command, args, {
    // silent: true,
    stdio: 'pipe',
  });

  child.stdout.on('data', data => process.stdout.write(data.toString()));
  child.stderr.on('data', data => process.stderr.write(data.toString()));
  child.on('exit', () => {
    child.exit = true;
  });

  return child;
}

export function waitForCompletion(child, cb) {
  if (child.exit) {
    return cb();
  }

  child.kill();
  child.on('exit', cb);
}
