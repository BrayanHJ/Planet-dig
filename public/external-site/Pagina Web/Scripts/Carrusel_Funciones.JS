const dias = document.querySelectorAll('.dia');
const nombreDiaTexto = document.getElementById('nombre-dia');
let index = 0;

function mostrarDia(nuevoIndex, direccion = 'derecha') {
if (nuevoIndex === index) return;

const actual = dias[index];
const siguiente = dias[nuevoIndex];

dias.forEach(d => {
    d.classList.remove('active', 'slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
});

    if (direccion === 'derecha') {
    actual.classList.add('slide-out-left');
    siguiente.classList.add('slide-in-right');
    } 
else {
    actual.classList.add('slide-out-right');
    siguiente.classList.add('slide-in-left');
}

    siguiente.classList.add('active');
    nombreDiaTexto.textContent = siguiente.dataset.dia;
    index = nuevoIndex;
}

document.getElementById('btn-prev').addEventListener('click', () => {
    const nuevo = (index - 1 + dias.length) % dias.length;
    mostrarDia(nuevo, 'izquierda');
});

document.getElementById('btn-next').addEventListener('click', () => {
    const nuevo = (index + 1) % dias.length;
    mostrarDia(nuevo, 'derecha');
});

// Mostrar el día actual automáticamente
const diaActual = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
const mapeoDias = [6, 0, 1, 2, 3, 4, 5]; // Ajuste al orden en el HTML (Lunes = 0 en el array)
index = mapeoDias[diaActual];
dias[index].classList.add('active');
nombreDiaTexto.textContent = dias[index].dataset.dia;
