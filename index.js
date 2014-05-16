var http = require('http'),
    fs = require('fs'),
    sio = require('socket.io');

var colorTheme = ['grey', 'green', 'yellow', 'red', 'blue', 'rainbow', 'cyan'];

require('colors');

function Log(app, mode) {
    this.app = app;
    this.mode = (mode || 'DEVELOPMENT').toUpperCase();
    this.env = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
}

Log.prototype.listen = function () {
    var app = this.app;
    if (this.env === this.mode) {

        app.get('/uc-logger/log.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/log/logger.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/uc-logger/jquery.min.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/cpu/js/jquery-lastest.min.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/uc-logger/smoothie.min.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/cpu/js/smoothie.min.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/uc-logger/cpu.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/cpu/js/cpu.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/cpu', function (req, res) {
            res.sendfile(__dirname + '/lib/cpu/index.html');
        });

        var serv = http.createServer(app),
            io = sio.listen(serv),
            viewerStatus = false;

        io.set('log level', 1);
        serv.listen(app.get('port'));

        io.sockets.on('connection', function (socket) {
            socket.on('Log msg', function (data) {
                data = JSON.parse(data);
                var infos = data['args'];
                infos.unshift('   Page info :: ');
                for (var i = 0, len = infos.length; i < len; i++) {
                    infos[i] = JSON.stringify(infos[i])[colorTheme[data['level']]];
                }
                console.log.apply(console, infos);
            });
        });

        var monitor = io.of('/monitor').on('connection', function (socket) {
            socket.on('Monitor Ready', function () {
                if (viewerStatus) {
                    socket.emit('Monitor Engine Start');
                    viewer.emit('CPU Viewer Switch Turn On');
                }
            });
            socket.on('CPU monitor msg', function (data) {
                if (viewerStatus) {
                    viewer.emit('CPU mark msg', data);
                }
            });
        });

        var viewer = io.of('/cpu-viewer').on('connection', function (socket) {
            socket.on('CPU Viewer Turn On', function (data) {
                viewerStatus = true;
                monitor.emit('Monitor Engine Start');
            });
            socket.on('CPU Viewer Turn Off', function (data) {
                viewerStatus = false;
                monitor.emit('Monitor Engine Cut');
            });

        });
    }
};

module.exports = Log;