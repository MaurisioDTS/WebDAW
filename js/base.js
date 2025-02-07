var rain = new Tone.Buffer("../res/aud/rain.mp3");
var lofi = new Tone.Buffer("../res/aud/lofi.mp3");

$(document).ready(function () {

    // variables ===================================
    let rainAudio;
    let lofiAudio;

    // FUNCIONES ===================================

    function createAudio(){

        rainAudio = new Tone.Player({
            "url": rain
        }).toDestination();

        lofiAudio = new Tone.Player({
            "url": lofi
        }).toDestination();

        rainAudio.loop = true;
        lofiAudio.loop = true;

        console.log("lofi cargado");
    }

    function aboutChekcer(target,rain,lofi){


        if(target === "about"){
            rain.start();
            lofi.start();

            rain.volume.rampTo(0, .1);
            lofi.volume.rampTo(0, .1);

            console.log("reproduciendo");
        } else{
            rain.volume.rampTo(-100, .1);
            lofi.volume.rampTo(-100, .1);

            console.log("callando");
        }
    }

    // LA MAGIA ============================================

    function llamarAjax() {
        //  puta basura
        $.ajax({    // para el synth
            url: 'prueba.html',
            method: 'GET',
            success: function (data) { $('#synth').html(data); },
            error: function () { $.toast({
                icon: 'error',
                heading: 'no se pudo cargar',
                text: 'chekea la consola',
                position: 'mid-center',
                stack: false
            }) }
        });

        $.ajax({    // para el synth
            url: 'drums.html',
            method: 'GET',
            success: function (data) { $('#drums').html(data); },
            error: function () { $('#drums').html('<p>error al cargar el modulo, chekea la consola.</p>'); }
        });

        $.ajax({    // para el synth
            url: 'about.html',
            method: 'GET',
            success: function (data) { $('#about').html(data); },
            error: function () { $('#about').html('<p>error al cargar el modulo, chekea la consola.</p>'); }
        });
    }

    $("#startPage").click( function (){

        //$(".leftTitle").show("slide", { direction: "left" }, 1000);
        $(".tab-container").fadeIn('fast');

        Tone.start();
        console.log("comienza! esta noche oscura te tortura la locura");

        llamarAjax();

        document.querySelectorAll('.tab').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                document.querySelectorAll('.tab').forEach(item => item.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.nav-content').forEach(content => {
                    content.style.display = 'none';
                });

                const target = this.getAttribute('data-target');

                aboutChekcer(target,rainAudio,lofiAudio);

                const contentToShow = document.getElementById(target);
                if (contentToShow) {
                    contentToShow.style.display = 'block';
                }
            });
        });
        $('.start-container').remove();
        $('.leftTitle').fadeIn();
        createAudio();
    });
});