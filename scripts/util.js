import { spawn } from 'child_process';


export function startProcess(command, args) {
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

  child.on('close', function() {
    child.closed = true;
  });

  return child;
}

export function waitForCompletion(child, cb) {
  if (child.closed) {
    return cb();
  }

  child.kill();

  child.on('close', function() {
    return cb();
  });
}
