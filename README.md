uc-logger
========

log on web page run at node

Installation
========

    $ npm install uc-logger

Quick Start
========

Client page or page what you want to listen add this code in head selector:

    <script src="socket.io/socket.io.js"></script>
    <script src="uc-logger/log.js"></script>

You can use log.log/info/warn/error method. For example,

	log.log('Hello world!');

Then the server will receive and output:

 	Page info :: Hello world!

