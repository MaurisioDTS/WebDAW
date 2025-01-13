$(document).ready(function () {
    // Array de rutas de samples
    const samplePaths = [
      "dibass.mp3",
      "drums.wav",
    ];

    // Inicialización del contexto de audio
    $('#start').click(async () => {
      await Tone.start();
      console.log("Audio context initialized");

      const sampleControllers = [];

      // Generar controles para cada sample
      samplePaths.forEach((path, index) => {
        // Crear elementos de Tone.js
        var player = new Tone.Player({
            "url" : path,
        }).toMaster();

        const panner = new Tone.Panner(0).toDestination();
        const volume = new Tone.Volume(0).connect(panner);
        const muteGain = new Tone.Gain(1).connect(volume); // Control de mute
        player.connect(muteGain);

        // Almacenar los elementos en un objeto
        sampleControllers.push({ player, panner, volume, muteGain, isMuted: false, isSoloed: false });

        // Crear estructura de controles con jQuery
        const sampleDiv = $(`
          <div class="sample-controls">
            <div class="sliders">
                <label>Volume: <input class="volume-slider" type="range" orient="vertical" min="-96" max="6" value="0"></label>
                <label>Pan: <input class="pan-slider" type="range" min="-1" max="1" step="0.01" value="0"></label>
            </div>
            
            <div class="buttons">
                <button class="play-btn">Play</button>
                <button class="mute-btn">Mute</button>
                <button class="solo-btn">Solo</button>
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
          $(this).text(controller.isMuted ? "Unmute" : "Mute");
        });

        // Botón Solo
        sampleDiv.find('.solo-btn').click(function () {
          const controller = sampleControllers[index];
          controller.isSoloed = !controller.isSoloed;

          // Ajustar solo/mute para todos los samples
          sampleControllers.forEach((c, i) => {
            c.muteGain.gain.value = controller.isSoloed && i !== index ? 0 : (c.isMuted ? 0 : 1);
          });

          $(this).text(controller.isSoloed ? "Unsolo" : "Solo");
        });

        // Slider de Volumen
        sampleDiv.find('.volume-slider').on('input', function () {
          volume.volume.value = $(this).val();
        });

        // Slider de Panorama
        sampleDiv.find('.pan-slider').on('input', function () {
          panner.pan.value = $(this).val();
        });

        $('#play-all').click(() => {
            sampleControllers.forEach(({ player }) => {
              player.start();
            });
        });
        
        $('#stop-all').click(() => {
            sampleControllers.forEach(({ player }) => {
              player.stop();
            });
        });

        $(function() {
            $(".dial").knob({
                'min':-50,
                'max':50
            });
        });

        // Añadir los controles al contenedor
        $('#controls').append(sampleDiv);
      });
    });
  });