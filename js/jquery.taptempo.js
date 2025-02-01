(function($) {
    $.fn.tapTempo = function(options) {
        const defaults = {
            displaySelector: null, 
            maxInterval: 2000,
            onTempoCalculated: null // callback
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
                        $(settings.displaySelector).text( (frequency*60).toFixed(0));
                    } else {
                        console.log((frequency*60).toPrecision(3) + " bpm");
                    }

                    // respecto al callback
                    if (settings.onTempoCalculated) {
                        settings.onTempoCalculated((frequency * 60)); // bpm
                    }
                }
            });
        });
    };
})(jQuery);