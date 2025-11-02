document.addEventListener("DOMContentLoaded", function() {
    // Animación fade-in solo una vez para todos los elementos del carrusel de actividades
    const actividades = document.querySelectorAll('.actividad');
    const btns = document.querySelectorAll('.Actividades_Btn');
    actividades.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('fade-in-once');
        }, 100 + i * 120);
    });
    btns.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('fade-in-once');
        }, 400 + i * 120);
    });
});

const carrusel = document.querySelector('.Actividades_Carrusel');
const actividades = carrusel.querySelectorAll('.actividad');
const prevBtn = carrusel.querySelector('.Actividades_Btn.prev');
const nextBtn = carrusel.querySelector('.Actividades_Btn.next');
let current = 0;

function showActividad(idx) {
    actividades.forEach((act, i) => {
        act.classList.toggle('active', i === idx);
    });
}

prevBtn.addEventListener('click', () => {
    current = (current - 1 + actividades.length) % actividades.length;
    showActividad(current);
});

nextBtn.addEventListener('click', () => {
    current = (current + 1) % actividades.length;
    showActividad(current);
});