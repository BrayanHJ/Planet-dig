// Carrusel dinámico: carga datos desde /external-site/salas.json
// Las imágenes en el JSON deben estar en formato relativo a la carpeta Pagina-Web,
// por ejemplo: "assets/Salas/nombre.webp". El script usará la ruta base
// '/external-site/Pagina-Web/' + img.

let salasData = [];

async function cargarSalasData() {
  try {
    const res = await fetch('/external-site/salas.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    salasData = data.salas || [];
    if (!salasData.length) console.warn('salas.json está vacío o no tiene la propiedad salas');
    initCarrusel();
  } catch (err) {
    console.error('No se pudo cargar salas.json:', err);
    // Como fallback, usar un array mínimo para evitar romper la página
    salasData = [
      { img: 'assets/Salas/planetario-digital.webp', texto: 'Domo Digital' }
    ];
    initCarrusel();
  }
}

function initCarrusel() {
  let currentIndex = 2;
  const carrusel = document.getElementById('carrusel');
  if (!carrusel) return;
  const elementos = carrusel.querySelectorAll('.sala');
  if (elementos.length < 5) return;

  function updateCarrusel() {
    for (let i = 0; i < 5; i++) {
      let index = (currentIndex + i - 2 + salasData.length) % salasData.length;
      const imgPath = '/external-site/Pagina-Web/' + salasData[index].img;
      const imgEl = elementos[i].querySelector('img');
      imgEl.src = encodeURI(imgPath);
      imgEl.alt = salasData[index].texto || '';
      // Fallback si la imagen no carga
      imgEl.onerror = function () {
        this.onerror = null;
        console.warn('Imagen no encontrada:', imgPath);
        this.src = '/external-site/Pagina-Web/assets/image/planetario_digital.webp';
      };

      elementos[i].querySelector('p').textContent = salasData[index].texto || '';

      elementos[i].className = 'sala';
      if (i === 0) elementos[i].classList.add('muy-izquierda');
      else if (i === 1) elementos[i].classList.add('izquierda');
      else if (i === 2) elementos[i].classList.add('central');
      else if (i === 3) elementos[i].classList.add('derecha');
      else if (i === 4) elementos[i].classList.add('muy-derecha');
    }
  }

  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  if (nextBtn) nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % salasData.length; updateCarrusel(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + salasData.length) % salasData.length; updateCarrusel(); });

  updateCarrusel();
}

document.addEventListener('DOMContentLoaded', cargarSalasData);