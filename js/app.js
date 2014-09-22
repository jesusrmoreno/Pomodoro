
function keylines() {
    for (var i = 0; i < $(window).width(); i++) {
        if (i % 8 == 0) {
            $('body').append('<div class="v-line" style="height: 100%; top: 0px; z-index:999999999; position:absolute;' + 'left:' + i + 'px; width: 1px; background: rgba(236,63,122, .4);">');
        }
    }
    for (var i = 0; i < $(window).height(); i++) {
        if (i % 8 == 0) {
            $('body').append('<div class="h-line" style="width: 100%; z-index:9999999; left: 0px; position:absolute;' + 'top:' + i + 'px; height: 1px; background: rgba(236,63,122, 1);">');
        }
    }
}

var Timer = (function() {
    var EventEmitter = require('events').EventEmitter;
    var controller   = new EventEmitter();

    var timer = {
        time: 0,
        target: undefined,
        type: undefined,
        pomocount: 0,
        timeoutId: undefined,
        viewTime: undefined,
        shortTime: 5,
        longTime: 15,
        workTime: 25
    };

    function setTarget(val) {
        timer.time = timer.target = val * 60;
    }
    
    function toggleTimer() {
        if (timer.type === undefined) {
            updateState();
        }
        if (typeof timer.timeoutId === 'number') {
            window.clearTimeout(timer.timeoutId);
            timer.timeoutId = undefined;
            controller.emit('toggle', 'paused');
        } else {
            controller.emit('toggle', 'unpaused');
            // controller.emit('stateChange', timer.type);
            tick();
        }
    }

    function tick() {
        timer.timeoutId = window.setTimeout(tick, 1000);
        timer.time -= 1;
        var mins = Math.floor(timer.time / 60);
        var secs = timer.time % 60;

        mins = mins < 10 ? '0' + mins : mins;
        secs = secs < 10 ? '0' + secs : secs;

        timer.viewTime = mins + ':' + secs;

        if (timer.time === 0) {
            updateState();
        }
        controller.emit('tick', timer.viewTime);
    }

    function updateState() {
        if (timer.type === 'pomodoro') {
            if ((timer.pomocount % 4 === 0) && (timer.pomocount !== 0)) {
                timer.type = 'long';
            } else {
                timer.type = 'short';
            }
        } else {
            setTarget(timer.workTime);
            timer.pomocount += 1;
            timer.type = 'pomodoro';
        }

        if (timer.type === 'pomodoro') {
            setTarget(timer.workTime);
        } else if (timer.type === 'long') {
            setTarget(timer.longTime);
        } else {
            setTarget(timer.shortTime);
        }
        controller.emit('stateChange', timer.type);
    }

    controller.toggleTimer = function() {
        toggleTimer();
    };

    return controller;
})();

(function($, pomodoro) {
    var gui        = require('nw.gui');
    var mainWindow = gui.Window.get();

    var ding = new Audio('./audio/Ding.wav');
    var tick = new Audio('./audio/tick.wav');

    var appController = {
        volume: 0.5,
    };






    tick.volume = ding.volume = appController.volume;

    $(window).load(function() {



        // UI Controls and Logic go below this line
        $('#timer-toggle').on('click', function() {
            pomodoro.toggleTimer();
            $('#timer-toggle')
                .toggleClass('icon-material-play-arrow')
                .toggleClass('icon-material-pause');
        });

        $('#sound-toggle').on('click', function() {
            $(this)
                .toggleClass('icon-material-notifications-off')
                .toggleClass('icon-material-notifications');
            if (tick.volume > 0) {
                tick.volume = 0;
                ding.volume = 0;
            } else {
                tick.volume = 0.5;
                ding.volume = 0.5;
            }
        });

        $('#close-button').on('click', function() {
            mainWindow.close();
        })

        pomodoro.on('tick', function(time) {
            $('#current-time').html(time);
            tick.play();
        });

        pomodoro.on('stateChange', function(state) {
            $('#current-state').html(state);
            ding.play();
            if (state === 'pomodoro') {
                $('#current-state-icon')
                    .removeClass('fa fa-coffee')
                    .addClass('icon-material-timer')
                    .animo({
                        animation: 'wiggle',
                        duration: 1
                    });
                
            } else if (state === 'short') {
                $('#current-state-icon')
                    .addClass('fa fa-coffee')
                    .removeClass('icon-material-timer')
                    .animo({
                        animation: 'wiggle',
                        duration: 1
                    });
            } else if (state === 'long') {
                $('#current-state-icon')
                    .addClass('fa fa-coffee')
                    .removeClass('icon-material-timer')
                    .animo({
                        animation: 'wiggle',
                        duration: 1
                    });
            }
        });
    });
})(jQuery, Timer);
