document.addEventListener('DOMContentLoaded', () => {
    const contenedorFunciones = document.querySelector('.Contenedor_Funciones');
    const funcionesHorario = document.querySelector('.Funciones_Horario');

    contenedorFunciones.addEventListener('click', () => {
        contenedorFunciones.classList.toggle('expandida');
        funcionesHorario.classList.toggle('expandida');
    });
});

