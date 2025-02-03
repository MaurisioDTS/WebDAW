/*const playSequence = () => {
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
};*/
async function crearTodo(noteLabels) {

    //  =====================================================0
    //      VARIABLES PADALUSTRAS
    const $notes = $('#notes');
    let intervalId;
    let currentColumn = 0;
    let bpm = 120 * 2; // beats per minute
    let intervalTime = (60 / bpm) * 1000; // milisegundos entre pasos
    //const noteLabels = ["crash", "shaker", "cowbell", "ride", "hihat", "rimshot", "snare", "kick"];

    //      labels ===========0
    noteLabels.forEach(note => {
        $notes.append(`<div class="tag" value="` + noteLabels.indexOf(note) + `" class="note-label">${note}</div>`);
    });

    //      creamos la cuadricula   ===========0
    const cells = [];
    for (let row = 0; row < noteLabels.length; row++) {
        const rowCells = [];
        for (let col = 0; col < 32; col++) {
            const cell = document.createElement('div');
            cell.setAttribute('data-value', row);
            cell.classList.add('cell');

            // Alternar entre bloques de 4 columnas oscuras y claras
            if (Math.floor(col / 4) % 2 === 1) {
                cell.classList.add('light');
            }

            // Manejar el clic en la celda
            cell.addEventListener('click', () => {
                cell.classList.toggle('active'); // Cambiar estado activo/inactivo
            });

            cell.val = 1;

            grid.appendChild(cell);
            rowCells.push(cell);
        }
        cells.push(rowCells);
    }


    //  =====================================================0
    //      FUNCIONES

    function aparecerControles() {
        let temp = $(`
                    <button class="ssl-button" id="play">Play</button>
                    <button class="ssl-button" id="stop">Stop</button>
                    <button class="ssl-button" id="rec">Rec</button>
                    <br>
                    <div class="dondeEstaraElMetronomo"></div>
                `);
        $('.controls').append(temp);

        $('.dondeEstaraElMetronomo').tempoDisplay();

        $('#boton-tap').tapTempo({
            displaySelector: '#display-tap',
            maxInterval: 2000,
            onTempoCalculated: function (newBPM) {
                temp = (30 / newBPM) * 1000;
                intervalTime = temp.toFixed(0);
                console.log('newBPM: ' + intervalTime);
            }
        });
    }

    //  ====================================================
    //      se crea la mixer
    //await Tone.start();
    //console.log("comienza! esta noche oscura te tortura la locura");
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

        // almacenar los elementos en un objeto
        sampleControllers.push({player, panner, volume, muteGain, isMuted: false, isSoloed: false});

        // crear estructura de controles (<script>$('.pan-slider').fancyknob();</script>)
        const sampleDiv = $(`
                    <div class="sample-controls">
                        <div class="fader-container">
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
            const controller = sampleControllers[index];
            controller.muteGain.gain.value = controller.muteGain.gain.value*-1;

            if (controller.muteGain.gain.value < 0) {
                $(this).addClass("phase");
            } else {
                $(this).removeClass("phase");
            }
            console.log("phase inverted: " + controller.muteGain.gain.value);
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

        // Añadir los controles al contenedor
        $('.faders').append(sampleDiv);

    });
    // =====================
    //  FIN DE LA GENERACIÓN
    $("#start").hide();

    const playSound = (cell) => {
        console.log(noteLabels[cell.getAttribute("data-value")]);
        sampleControllers[cell.getAttribute('data-value')].player.start();
    };

    const stopSequence = () => {
        clearInterval(intervalId);
        cells.forEach(row => row.forEach(cell => cell.classList.remove('active-column')));
        currentColumn = 0;
    };

    const playSequence = () => {
        console.log("se playea la sequence con un intervalo de "+intervalTime);
        stopSequence();
        intervalId = setInterval(() => {
            // Resetear las columnas anteriores
            if (currentColumn > 0) {
                cells.forEach(row => row[currentColumn-1].classList.remove('active-column'));
            } else {
                cells.forEach(row => row[31].classList.remove('active-column'));
            }

            // Marcar la columna actual
            cells.forEach(row => row[currentColumn].classList.add('active-column'));

            // Reproducir notas activas en la columna actual
            cells.forEach((row, rowIndex) => {
                if (row[currentColumn].classList.contains('active')) {
                    playSound(row[currentColumn]);
                }
            });

            // Avanzar a la siguiente columna
            currentColumn = (currentColumn +1) % 32;

        }, intervalTime);
        cells.forEach(row => row.forEach(cell => cell.classList.remove('active-column')));
    };

    // Manejar botones
    $('#play').click(playSequence);

    $('#stop').click(stopSequence);
}

// =====================================================0
//      aqui es donde surge la magia.
$(document).ready(function () {

    //$("#start").click(function () {
        $.ajax({
            url: '../res/aud/drums/drums.txt',
            type: 'GET',
            success: function(data) {
                noteLabels = data.split(/\s+/);
                crearTodo(noteLabels);
            },
            error: function(xhr, status, error) {
                alert("no se pudo crear, revisa la consola")
                console.error('error fatal: '+xhr, status, error);
            }
      //  });
    });
});