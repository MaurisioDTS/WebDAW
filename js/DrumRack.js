$(document).ready(function () {
    const $grid = $('#grid');
    const $notes = $('#notes');
    const noteLabels = ["crash", "shaker", "cowbell", "ride", "hihat", "rimshot", "snare", "kick"];
    const bpm = 120*2;
    const intervalTime = (60 / bpm) * 1000;
    let intervalId;
    let currentColumn = 0;

    // Generar etiquetas de notas
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
        new Audio(`res/aud/drums/${note}.wav`).play();
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

    // Manejar botones
    $('.button.play').on('click', playSequence);
    $('.button.stop').on('click', stopSequence);
});

// Crear una barra de progreso
const progressBar = document.createElement('div');
progressBar.style.position = 'absolute';
progressBar.style.width = '40px';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
progressBar.style.transition = `transform ${intervalTime}ms linear`;
progressBar.style.pointerEvents = 'none';
grid.parentElement.appendChild(progressBar); // Agregar la barra al contenedor del grid

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
