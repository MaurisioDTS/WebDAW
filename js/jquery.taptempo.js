(function($) {
    $.fn.tapTempo = function(options) {
        const defaults = {
            displaySelector: null, 
            maxInterval: 2000,
        };
        
        const settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            let tapTimes = [];
            $(this).on('click', function() {
                // variables
                const currentTime = Date.now();
                tapTimes = tapTimes.filter(time => currentTime - time <= settings.maxInterval);
                tapTimes.push(currentTime);

                // lógica
                if (tapTimes.length > 1) {
                    const intervals = [];
                    for (let i = 1; i < tapTimes.length; i++) {
                        intervals.push(tapTimes[i] - tapTimes[i - 1]);
                    }

                    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                    const frequency = 1000 / avgInterval; // pulsaciones por segundo

                    // print en pantalla
                    if (settings.displaySelector) {
                        $(settings.displaySelector).text( (frequency*60).toFixed(0) + " bpm");
                    } else {
                        console.log((frequency*60).toFixed(0) + " bpm");
                    }
                }
            });
        });
    };
})(jQuery);