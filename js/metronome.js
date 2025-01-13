/*
var isRunning = false;
    var intervalId = null;
    
    function playClick(a) {
        alert(a.src);
        a.src="res/aud/drums/"+document.getElementById("drum").value+".wav";
        a.play();
    }
    
    function toggleMetronome() {
        var tempo = document.getElementById('tempoSlider');
        if (isRunning) {
            clearInterval(intervalId);
            isRunning = false;
        } else {
            intervalId = setInterval(playClick, (60 / tempo));
            isRunning = true;
        }
    }
    function changeDrum(){
        tempo = e.target.value;
        
        if (isRunning) {
            clearInterval(intervalId);
            intervalId = setInterval(playClick, (60 / tempo));
    }
}
*/

blip.sampleLoader()
    .samples({
    'uke': "res/aud/drums/"+document.getElementById("drum").value+".wav"
})
    .done(loaded)
    .load();

function loaded() {

    var clip = blip.clip()
        .sample('uke');
 
    var monotonous = blip.loop()
        .tempo(document.getElementById("tempoSlider").value)
        .tick(function (t) {
        clip.play(t)
    });



    /* click events */
    document.getElementById('play').addEventListener('click', function () {
        monotonous.start();
    });
    document.getElementById('pause').addEventListener('click', function () {
        monotonous.stop();
    });
}

window.onload = function(){

    /* click events */
    document.getElementById('play').addEventListener('click', function () {
        monotonous.start();
    });
    document.getElementById('pause').addEventListener('click', function () {
        monotonous.stop();
    });
}
    //document.getElementById('tempoSlider').addEventListener('change', changeDrum);
