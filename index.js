var http = require('http'),
    fs = require('fs'),
    sio = require('socket.io'),

    log = {},
    colorTheme = ['grey', 'green', 'yellow', 'red', 'blue', 'rainbow', 'cyan'];

require('colors');

log.init = function (app) {
	if(app.get('env').toUpperCase()==='DEVELOPMENT') {

		app.get('/log/logger.js', function (req, res) {
	        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
	        fs.readFile('./lib/logger.js', function (err, data) {
	            if (err) throw err;
	            res.end(data);
	        });
	    });
    
	    var serv = http.createServer(app),
	        io = sio.listen(serv);
	    serv.listen(app.get('port'));

	    io.set('log level', 1);

	    //监听来自客户端的 console 消息
	    io.sockets.on('connection', function (socket) {
	        socket.on('Log msg', function (data) {
	            console.log('From client page says: '[colorTheme[JSON.parse(data)['level']]],
	                JSON.stringify(JSON.parse(data)['args'])[colorTheme[JSON.parse(data)['level']]]);
	        });
	    });
	}
};

module.exports = log;