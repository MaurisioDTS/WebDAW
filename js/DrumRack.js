function aparecerControles() {
    let temp = $(`
                    <button class="ssl-button" id="play">Play</button>
                    <button class="ssl-button" id="stop">Stop</button>
                    <button class="ssl-button" id="rec">Rec</button>
                    <br>
                    <button class="ssl-button" id="play-all">Play</button>
                    <button class="ssl-button" id="stop-all">stop</button>
                `);
    $('.controls').append(temp);
}

$(document).ready(function () {
    const $grid = $('#grid');
    const $notes = $('#notes');
    const noteLabels = ["crash", "shaker", "cowbell", "ride", "hihat", "rimshot", "snare", "kick"];
    const bpm = 120 * 2;
    const intervalTime = (60 / bpm) * 1000;
    let intervalId;
    let currentColumn = 0;

    $('#start').click(async () => {
        await Tone.start();
        console.log("comienza! esta noche oscura te tortura la locura");
        const sampleControllers = [];
        let nombrecito = "";

        aparecerControles();
        // Generar controles para cada sample
        noteLabels.forEach((path, index) => {
            // Crear elementos de Tone.js
            var player = new Tone.Player({
                "url": "res/aud/drums/" + path + ".wav",
            });
            nombrecito = path;
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
                                <button class="ssl-button mute-btn">M</button>
                                <button class="ssl-button solo-btn">S</button>
                                <button class="ssl-button phase-btn">Ø</button>
                            </div>
                        </div>
                        <div class="panorama">
                            <input class="pan-slider" type="range" min="-1" max="1" step="0.01" value="0">
                        </div>
                        <div class="tag">${nombrecito + ""}</div>
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
            $('#controls').append(sampleDiv);
        });
        // =====================
        //  FIN DE LA GENERACIÓN
        $("#start").hide();


        // Manejar botones
        $('#play').on('click', function(note) {
            alert("puta");
            console.log(note);

            sampleController[note].player.start();
        });

        $('#stop').click(stopSequence);
    });

    //
    noteLabels.forEach(note => {
        $notes.append(`<div class="note-label">${note}</div>`);
    });

    // Crear la cuadrícula de celdas
    const cells = [];
    for (let row = 0; row < 8; row++) {
        cells[row] = [];
        for (let col = 0; col < 16; col++) {
            const $cell = $('<div class="cell"></div>');
            if (Math.floor(col / 4) % 2 === 1) $cell.addClass('light');

            // Toggle estado activo/inactivo al hacer clic
            $cell.on('click', function () {
                $(this).toggleClass('active');
            });

            $grid.append($cell);
            cells[row].push($cell);
        }
    }

    // Reproducir sonido
    const playSound = (note) => {
        console.log(note);
        sampleController[note].player.start();
    };

    // Reproducir secuencia
    const playSequence = () => {
        stopSequence(); // Detener cualquier secuencia previa
        intervalId = setInterval(() => {
            // Limpiar la columna anterior
            const prevColumn = (currentColumn === 0) ? 15 : currentColumn - 1;
            cells.forEach(row => row[prevColumn].removeClass('active-column'));

            // Marcar la columna actual
            cells.forEach(row => row[currentColumn].addClass('active-column'));

            // Reproducir sonidos activos en la columna actual
            cells.forEach((row, rowIndex) => {
                if (row[currentColumn].hasClass('active')) {
                    playSound(noteLabels[rowIndex]);
                }
            });

            // Avanzar a la siguiente columna
            currentColumn = (currentColumn + 1) % 16;
        }, intervalTime);
    };

    // Detener la secuencia
    const stopSequence = () => {
        clearInterval(intervalId);
        cells.forEach(row => row.forEach(cell => cell.removeClass('active-column')));
        currentColumn = 0;
    };

});

/** Crear una barra de progreso
 const progressBar = document.createElement('div');
 progressBar.style.position = 'absolute';
 progressBar.style.width = '40px';
 progressBar.style.height = '100%';
 progressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
 progressBar.style.transition = `transform ${intervalTime}ms linear`;
 progressBar.style.pointerEvents = 'none';
 grid.parentElement.appendChild(progressBar);  //Agregar la barra al contenedor del grid **/

const playSequence = () => {
    stopSequence();
    intervalId = setInterval(() => {
        // Resetear las columnas anteriores
        if (currentColumn > 0) {
            cells.forEach(row => row[currentColumn - 1].classList.remove('active-column'));
        } else {
            cells.forEach(row => row[15].classList.remove('active-column'));
        }

        // Marcar la columna actual
        cells.forEach(row => row[currentColumn].classList.add('active-column'));

        // Reproducir notas activas en la columna actual
        cells.forEach((row, rowIndex) => {
            if (row[currentColumn].classList.contains('active')) {
                playSound(noteLabels[rowIndex]);
            }
        });

        // Mover la barra de progreso
        progressBar.style.transform = `translateX(${currentColumn * 45}px)`; // 40px celda + 5px gap

        // Avanzar a la siguiente columna
        currentColumn = (currentColumn + 1) % 16;
    }, intervalTime);
};

const stopSequence = () => {
    clearInterval(intervalId);
    cells.forEach(row => row.forEach(cell => cell.classList.remove('active-column')));
    currentColumn = 0;

    // Resetear la posición de la barra de progreso
    progressBar.style.transform = 'translateX(0)';
};
