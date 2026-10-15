const net = require('net');
const client = net.createConnection({ port: 27017, host: '127.0.0.1' }, () => {
    console.log('MongoDB port 27017 is accessible!');
    client.end();
    process.exit(0);
});
client.on('error', (err) => {
    console.log('MongoDB connection error:', err.message);
    process.exit(1);
});
