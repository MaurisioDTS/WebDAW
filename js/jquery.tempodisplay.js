(function ($) {
    $.fn.tempoDisplay = function () {
        return this.each(function () {
            var $tempoDisplay = $(`
                                    <div class="metronome-container tap-tempo">
                                        <div class="bpm-display" id="display-tap">120</div>
                                        <button class="ssl-button" id="boton-tap">Tap</button>
                                    </div>
                                `);

            $(this).replaceWith($tempoDisplay);
        });
    };
})(jQuery);