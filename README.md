uc-logger
========

log on web page run at node depend on express

Installation
========

    $ npm install uc-logger

Quick Start
========

Client page or page what you want to listen add this code in head selector:

    <script src="socket.io/socket.io.js"></script>
    <script src="uc-logger/log.js"></script>
    <script src="uc-logger/cpu.js"></script>

Server page can use:

    var UC_log = require('uc-logger'),
        uc_log = new UC_log(require('express')(), 'development');

You can use log.log/info/warn/error method. For example,

	log.log('Hello world!');

Then the server will receive and output:

 	Page info :: Hello world!

When you add cpu.js file, you can visit x.x.x.x:port/cpu to the monitor viewer page.  	

License
=======

(The MIT License)

Copyright (c) 2014 Zack Lin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.