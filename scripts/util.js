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

  return child;
}
