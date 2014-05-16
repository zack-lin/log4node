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

        app.get('/uc-Logger/Log.js', function (req, res) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile(__dirname + '/lib/Logger_client.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
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
                    infos[i] = JSON.stringify(infos[i])[colorTheme[data['level']]];
                }
                console.log.apply(console, infos);
            });
        });
    }
};

module.exports = Log;