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

        app.get('/uc-Logger/log.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/log/logger.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/uc-Logger/jquery.min.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/cpu/js/jquery-lastest.min.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/uc-Logger/canvasjs.min.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/cpu/js/canvasjs.min.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/uc-Logger/cpu.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/cpu/js/cpu.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        app.get('/cpu', function(req, res){
        	res.sendfile(__dirname + '/lib/cpu/index.html');
        });

        var serv = http.createServer(app),
            io = sio.listen(serv, {log: false});

        serv.listen(app.get('port'));

        io.sockets.on('connection', function (socket) {
            socket.on('Log msg', function (data) {
                data = JSON.parse(data);
                var infos = data['args'];
                infos.unshift('   Page info :: ');
                for(var i = 0, len = infos.length; i<len;i++){
                    infos[i] = infos[i][colorTheme[data['level']]];
                }
                console.log.apply(console, infos);
            });
        });

        var monitor = io.of('/monitor').on('connection', function (socket) {
    		socket.on('CPU monitor msg', function(data){
            	viewer.emit('CPU mark msg', data);
            });
		});

		var viewer = io.of('/cpu-viewer').on('connection', function (socket) {});
    }
};

module.exports = Log;