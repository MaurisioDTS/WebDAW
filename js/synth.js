$(document).ready(function () {

    const synth1 = new Tone.Channel().toDestination();
    const synth2 = new Tone.Channel().toDestination();
    const synth3 = new Tone.Channel().toDestination();
    const synth4 = new Tone.Channel().toDestination();

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
    synth.chain(distortion, filter, synthChannel);

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