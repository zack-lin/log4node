var http = require('http'),
    fs = require('fs'),
    sio = require('socket.io'),
    logger = new require('./lib/logger_server')

    log = {},
    colorTheme = ['grey', 'green', 'yellow', 'red', 'blue', 'rainbow', 'cyan'];

require('colors');

log.init = function (app) {
	if(process.env.NODE_ENV==='DEVELOPMENT') {

		app.get('/log4node/log.js', function (req, res) {
	        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
	        fs.readFile('./lib/logger_client.js', function (err, data) {
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
	        	data = JSON.parse(data);
	            console.log('From client page says: '[colorTheme[data['level']]],
	                JSON.stringify(data['args'])[colorTheme[data['level']]]);
	        });
	    });
	}
};

module.exports = log;