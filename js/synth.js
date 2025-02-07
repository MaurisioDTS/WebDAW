$(document).ready(function () {

    const synth1 = new Tone.Channel().toDestination();
    const synth2 = new Tone.Channel().toDestination();
    const synth3 = new Tone.Channel().toDestination();
    const synth4 = new Tone.Channel().toDestination();

    const synthDiv =$(`
                            <div class="synth">
                                <div class="module adsr-controls">
                                    <label for="attack">A</label>
                                    <input type="range" id="attack" step="0.1" min="0" max="5" value="0.5" orient="vertical">

                                        <label for="decay">D</label>
                                        <input type="range" id="decay" step="0.1" min="0" max="5" value="0.5" orient="vertical">

                                            <label for="sustain">S</label>
                                            <input type="range" id="sustain" step="0.1" min="0" max="1" value="0.5" orient="vertical">

                                                <label for="release">R</label>
                                                <input type="range" id="release" step="0.1" min="0" max="5" value="0.5" orient="vertical">
                                </div>

                                <div class="module distortion-controls">
                                    <h3>Distorsión</h3>
                                    <input type="range" id="distortion" step="0.1" min="0" max="10" value="0">
                                </div>

                                <div class="module filter-controls">
                                    <h3>Filtro</h3>
                                    <div>
                                        <label for="filter-frequency">Hz</label>
                                        <input type="range" id="filter-frequency" step="100" min="100" max="10000" value="1000">
                                            <span id="filter-frequency-display">10000 Hz</span>
                                    </div>
                                    <label for="filter-resonance">Q</label>
                                    <input type="range" id="filter-resonance" step="0.1" min="0" max="10" value="1">
                                </div>

                                <div class="module oscillator-controls">
                                    <h3>Oscilador</h3>
                                    <label for="oscillator-type">Tipo:</label>
                                    <select id="oscillator-type">
                                        <option value="sawtooth">Saw</option>
                                        <option value="square">Square</option>
                                        <option value="pwm">Triangle (PWM)</option>
                                        <option value="fatsawtooth">Super Saw</option>
                                        <option value="amtriangle">Triangle Mod</option>
                                    </select>
                                </div>
                            </div>
                    `)

    const synth = new Tone.Synth({
        oscillator: {
            type: "sawtooth"
        },
        envelope: {
            attack: 0.5,
            decay: 0.5,
            sustain: 0.5,
            release: 0.5
        }
    });

    //  filtro
    const filter = new Tone.Filter({
        type: "lowpass",
        frequency: 10000,
        Q: 1
    });

    // distorsion
    const distortion = new Tone.Distortion(0.0);

    // ruta: sintetizador -> distorsión -> filtro -> canal 1 -> master
    synth.chain(distortion, filter, synth1);

    //  controles en el html ======================================00

    $('.adsr-controls input').on('input', function () {
        const attack = parseFloat($('#attack').val());
        const decay = parseFloat($('#decay').val());
        const sustain = parseFloat($('#sustain').val());
        const release = parseFloat($('#release').val());

        synth.envelope.attack = attack;
        synth.envelope.decay = decay;
        synth.envelope.sustain = sustain;
        synth.envelope.release = release;
    });

    $('#distortion').on('input', function () {
        const amount = parseFloat($(this).val());
        distortion.distortion = amount;
    });

    $('#filter-frequency').on('input', function () {
        const frequency = parseFloat($(this).val());
        filter.frequency.value = frequency;
    });

    $('#filter-resonance').on('input', function () {
        const resonance = parseFloat($(this).val());
        filter.Q.value = resonance;
    });

    $('#oscillator-type').on('change', function () {
        const type = $(this).val();
        synth.oscillator.type = type;
    });

    $('.key-key').on('mousedown', function () {
        const note = $(this).data('note');
        synth.triggerAttack(note);
        console.log(note);
    });

    $('.key-key').on('mouseup', function () {
        synth.triggerRelease();
    });

    $('#filter-frequency').on('input', function () {
        const frequency = parseFloat($(this).val());
        filter.frequency.value = frequency;
        $('#filter-frequency-display').text(frequency + ' Hz');
    });
});