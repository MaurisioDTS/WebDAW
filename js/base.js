$(document).ready(function () {
    // Al hacer clic en un botón de pestaña
    $(".tab-buttons button").on("click", function () {
        // Obtener el ID del tab relacionado
        const tabId = $(this).data("tab");

        // Cambiar la pestaña activa
        $(".tab-buttons button").removeClass("active"); // Quitar la clase activa de los botones
        $(this).addClass("active"); // Agregar clase activa al botón clicado

        // Mostrar el contenido relacionado
        $(".tab-content").removeClass("active"); // Ocultar todo el contenido
        $("#" + tabId).addClass("active"); // Mostrar el contenido relacionado
    });
});