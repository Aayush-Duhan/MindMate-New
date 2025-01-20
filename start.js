const { spawn } = require('child_process');
const path = require('path');

// Start the server
const server = spawn('node', ['src/server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Start the client
const client = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit();
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  client.kill();
  process.exit(code);
});

client.on('close', (code) => {
  console.log(`Client process exited with code ${code}`);
  server.kill();
  process.exit(code);
}); 