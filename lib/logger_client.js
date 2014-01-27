(function(win){
    var Log = function() {},
        socket = io.connect(location.href.replace(location.hash, '')),
        nativeConsole = win.nativeConsole || (win.nativeConsole = win.console);

    function toArray(obj) {
        return Array.prototype.slice.call(obj);
    }

    ['log', 'info', 'warn', 'error'].forEach(function(i, k){
        Log.prototype[i] = function () {
            nativeConsole[i].apply(nativeConsole, arguments);
            arguments = toArray(arguments);
            arguments.unshift(k);
            this.send.apply(this, arguments); 
        };
    });

    Log.prototype.send = function() {
        var level = arguments[0],
            args = toArray(arguments).slice(1),
            data = {level: level, args: args},
            message = JSON.stringify(data);
        socket.emit('Log msg', message);
    };

    win.log = new Log();

    win.addEventListener('error', function (event) {
        log.warn('window error: ');
        log.error(event.message);
        log.error(event.filename + ' :' + event.lineno);
    }, false);
})(window);



