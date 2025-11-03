// Carrusel dinámico: carga datos desde /external-site/funciones.json
// Similar al carrusel de salas pero adaptado para funciones/horarios

let funcionesData = [];

async function cargarFuncionesData() {
  try {
    const res = await fetch('/external-site/funciones.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    funcionesData = data.dias || [];
    if (!funcionesData.length) console.warn('funciones.json está vacío o no tiene la propiedad dias');
    initCarruselFunciones();
  } catch (err) {
    console.error('No se pudo cargar funciones.json:', err);
    // Fallback mínimo si falla la carga
    funcionesData = [{
      img: 'assets/Horario_Funciones/no_hay_funcion.webp',
      texto: 'Sin funciones disponibles',
      estado: 'no_hay_funcion',
      id: 0
    }];
    initCarruselFunciones();
  }
}

function initCarruselFunciones() {
  let currentIndex = obtenerDiaActual();
  const carrusel = document.getElementById('carrusel-funciones');
  if (!carrusel) return;
  const elementos = carrusel.querySelectorAll('.funcion');
  if (elementos.length < 5) return;

  function updateCarrusel() {
    for (let i = 0; i < 5; i++) {
      let index = (currentIndex + i - 2 + funcionesData.length) % funcionesData.length;
      const imgPath = '/external-site/Pagina-Web/' + funcionesData[index].img;
      const imgEl = elementos[i].querySelector('img');
      imgEl.src = encodeURI(imgPath);
      imgEl.alt = funcionesData[index].texto || '';
      
      // Fallback si la imagen no carga
      imgEl.onerror = function () {
        this.onerror = null;
        console.warn('Imagen no encontrada:', imgPath);
        this.src = '/external-site/Pagina-Web/assets/Horario_Funciones/no_hay_funcion.webp';
      };

      elementos[i].className = 'funcion';
      if (i === 0) elementos[i].classList.add('muy-izquierda');
      else if (i === 1) elementos[i].classList.add('izquierda');
      else if (i === 2) elementos[i].classList.add('central');
      else if (i === 3) elementos[i].classList.add('derecha');
      else if (i === 4) elementos[i].classList.add('muy-derecha');
    }

    // Actualizar el texto del día seleccionado
    const diaSeleccionado = document.getElementById('nombre-funcion');
    if (diaSeleccionado) {
      const diaActual = funcionesData[currentIndex];
      diaSeleccionado.textContent = diaActual.texto;
      diaSeleccionado.className = diaActual.estado === 'si_hay_funcion' ? 'text-success' : 'text-danger';
    }
  }

  const nextBtn = document.getElementById('next-funcion');
  const prevBtn = document.getElementById('prev-funcion');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % funcionesData.length;
    updateCarrusel();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + funcionesData.length) % funcionesData.length;
    updateCarrusel();
  });

  updateCarrusel();
}

function obtenerDiaActual() {
  const hoy = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  // Ajustar al índice de nuestro array (donde Lunes es 0)
  return hoy === 0 ? 6 : hoy - 1;
}

document.addEventListener('DOMContentLoaded', cargarFuncionesData);
