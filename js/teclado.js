function setInstrumento(inst, key){
    var rel = document.getElementById("release");

    for(var i=0;i<key.length;i++){

        temp = key[i].id;

        key[i].onmousedown = function(e){
            var note = new Audio("res/aud/"+inst.value+"/"+e.target.id+".wav");
            lastNote = note;
            note.play();
        }
        key[i].onmouseup = function(e){
            const myTimeout = setTimeout(release, rel.value, lastNote)
        }
    }
}
function release(lastNote){
    lastNote.pause();
}
window.onload = function(){

    var temp = "";
    const key = document.getElementsByClassName("natural");
    var lastNote;
    var inst = document.getElementById("instrument");

    setInstrumento(inst, key);

    inst.onchange = function(){ setInstrumento(inst, key);}
}