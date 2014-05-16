var socket = io.connect('http://' + location.host + '/monitor');
(function () {
    var cpu, now;

    /**
     * 计算当前的实际百分比，然后限制在最高100%的时候需要补画多少个点，确保面积不受影响
     * @param {Number} time 当前这个点的时间
     * @param {Number} per  当前的CPU百分比
     */
    function getStepPer(time, per) {
        cpu.time_line.push(time);
        var cd;
        cpu.per_line.push(per);
        var len = cpu.time_line.length;
        if (cpu.time_line.length == 1) {
            cd = cpu.averageTime;
        } else {
            cd = time - cpu.time_line[len - 2];
        }
        if (cd < cpu.averageTime) {
            cd = cpu.averageTime;
        }
        var _stepPer = (cd - cpu.averageTime) / cpu.averageTime;
        if (len >= 2) {
            cpu.totalSize += ((cpu.per_line[len - 1] + cpu.per_line[len - 2]) * (cpu.time_line[len - 1] - cpu.time_line[len - 2]) / 2);
            cpu.size_line.push(cpu.totalSize);
        } else {
            cpu.size_line.push(0);
        }
        if (cpu.per_line.length > 2) {//省内存，最多保存两个值
            cpu.per_line.shift();
            cpu.time_line.shift();
        }
        return _stepPer;
    }

    function listen() {
        cpu = {
            per_line: [],//记录每个点对应的cpu开销
            time_line: [],//没个点的时间坐标记录下来
            size_line: [],//记录每个店对应的cpu开销面积
            averageTime: 250,//如果cpu一直是0%，那就是200ms打一个点
            totalSize: 0,//从启动到现在累计的总开销
        };
        setTimeout(function () {
            now = Date.now();
            cpu.currentTime = now;
            per = ((cpu.currentTime - cpu.lastTime) - 250) / 250;
            if (per < 0) {
                per = 0;
            }
            if (per > 1) {
                per = 1;
            }
            cpu.lastTime = cpu.currentTime;
            var stepPer = getStepPer(now, per);
            var n = Math.floor(stepPer / 0.5) + 1;
            var _per = per;
            if (n > 1) {
                _per = 1;
            }
            if (cpu.resumeFlag) {
                cpu.resumeFlag = false;
            } else {
                //0.5是因为CPU开销达到50%时从时间延时上来看是CPU0%时的1.5倍
                for (var i = 0; i < n; i++) {//当出现卡的时候会根据实际延时来考虑一次性多打几个点，这里只是假设每次实际超过100%时它前一个点都是100%，这样来适当补画多几个100%的点，来避免实际面积误差太大。但这里的算法只是采取粗略的拟补，目的是为了cpu曲线画起来点之间的步长一致，总体看起来更协调，而减少了这里的精度。
                    socket.emit('CPU monitor msg', per);
                }
            }
            cpu.timerID = setTimeout(arguments.callee, 250);
        }, 250);
    }

    function stop() {
        clearTimeout(cpu.timerID);
    }

    window.CPUListen = listen;
    window.CPUStop = stop;
})();
socket.emit('Monitor Ready');

socket.on('Monitor Engine Start', function () {
    CPUListen();
});

socket.on('Monitor Engine Cut', function () {
    CPUStop();
});
