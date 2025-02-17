$(document).ready(function () {
    const noteLabels = ["dibass.mp3", "dibass.mp3",];

    $('#start').click(async () => {
        await Tone.start();
        console.log("comienza! esta noche oscura te tortura la locura");
        const sampleControllers = [];

        // Generar controles para cada sample
        noteLabels.forEach((path, index) => {
            // Crear elementos de Tone.js
            var player = new Tone.Player({
                "url": path,
            });

            const panner = new Tone.Panner(0).toDestination();
            const volume = new Tone.Volume(0).connect(panner);
            const muteGain = new Tone.Gain(1).connect(volume); // Control de mute
            player.connect(muteGain);

            // Almacenar los elementos en un objeto
            sampleControllers.push({player, panner, volume, muteGain, isMuted: false, isSoloed: false});

            // Crear estructura de controles con jQuery (<script>$('.pan-slider').fancyknob();</script>)
            const sampleDiv = $(`
                    <div class="sample-controls">
                        <div class="container">
                            <div class="slider">
                                <input class="volume-slider" type="range" orient="vertical" min="-96" max="6" value="0">
                                <div class="vca">
                                <div class="vca__meter"></div>
                                <div class="vca__markers">
                                    <div>12</div>
                                    <div>6</div>
                                    <div>0</div>
                                    <div>3</div>
                                    <div>6</div>
                                    <div>9</div>
                                    <div>12</div>
                                    <div>15</div>
                                    <div>18</div>
                                    <div>21</div>
                                    <div>24</div>
                                    <div>30</div>
                                    <div>35</div>
                                    <div>40</div>
                                    <div>45</div>
                                    <div>50</div>
                                    <div>60</div>
                              </div>
                             </div>
                            </div>
                            <div class="button-container">
                                <button class="mute-btn">M</button>
                                <button class="solo-btn">S</button>
                                <button class="phase-btn">Ø</button>
                            </div>
                        </div>
                        <div class="panorama">
                            <input class="pan-slider" type="range" min="-1" max="1" step="0.01" value="0">
                        </div>
                        <h4>Sample ${index + 1}</h4>
                    </div>
                `);

            // Botón Play
            sampleDiv.find('.play-btn').click(() => player.start());

            // Botón Mute
            sampleDiv.find('.mute-btn').click(function () {
                const controller = sampleControllers[index];
                controller.isMuted = !controller.isMuted;
                controller.muteGain.gain.value = controller.isMuted ? 0 : 1;
                if (controller.isMuted) {
                    $(this).addClass("mute");
                } else {
                    $(this).removeClass("mute");
                }
            });
            // inversión de fase
            sampleDiv.find('.phase-btn').click(function () {


                player.connect(inverter);
                inverter;

                if (vol > 0) {
                    $(this).addClass("phase");
                } else {
                    $(this).removeClass("phase");
                }
                console.log("phase inverted." + inverter);
            });

            // Botón Solo
            sampleDiv.find('.solo-btn').click(function () {
                const controller = sampleControllers[index];
                controller.isSoloed = !controller.isSoloed;

                // Ajustar solo/mute para todos los samples
                sampleControllers.forEach((c, i) => {
                    c.muteGain.gain.value = controller.isSoloed && i !== index ? 0 : (c.isMuted ? 0 : 1);

                    if (controller.isSoloed) {
                        $(this).addClass("solo");
                    } else {
                        $(this).removeClass("solo");
                    }
                });
            });

            // Slider de Volumen
            sampleDiv.find('.volume-slider').on('input', function () {
                volume.volume.value = $(this).val();
                console.log(player.url + "gain:" + volume.volume.value);
            });

            // Slider de Panorama
            sampleDiv.find('.pan-slider').on('input', function () {
                panner.pan.value = $(this).val();
                console.log("pan:" + volume.volume.value);
            });

            $('#play-all').click(() => {
                sampleControllers.forEach(({player}) => {
                    player.start();
                });
            });

            $('#stop-all').click(() => {
                sampleControllers.forEach(({player}) => {
                    player.stop();
                });
            });

            $(function () {

                /*$(".dial").knob({
                    'min':-50,
                    'max':50
                });*/
            });

            // Añadir los controles al contenedor
            $('.faders').append(sampleDiv);
        });
        // =====================
        //  FIN DE LA GENERACIÓN
        $("#start").hide();
    });
});