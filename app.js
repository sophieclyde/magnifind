var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// if port isn't working try /dev/cu.wlan-debug or try the
// command ls /dev/{tty,cu}.* in terminal after
// connecting the arduino and add the new port
var port = new SerialPort({ path: '/dev/tty.usbmodem101', baudRate: 9600 });

var parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

var app = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
});

var io = require('socket.io')(app);

io.on('connection', function (socket) {

    console.log('Node is listening to port');

});

parser.on('data', function (data) {

    console.log('Received data from port: ' + data);

    io.emit('data', data);

});

app.listen(3000);
