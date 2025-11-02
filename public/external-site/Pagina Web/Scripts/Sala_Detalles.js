document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.querySelector('.Contenedor_Salas');

    contenedor.addEventListener('click', () => {
        contenedor.classList.toggle('expandida');
    });
});

