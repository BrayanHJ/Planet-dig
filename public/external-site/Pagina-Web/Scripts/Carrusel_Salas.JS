// Se pueden agregar mas salas , pero el orden de la lista de salas 
// deve ser iniciando 2 antes del inicio , ya que el carrusel los acomoda para verse estetcios.
// IMPORTANTE!!! las imagenes deven ser del mismo tamaño para no causar errores visuales o movimientos no deseados en la Seccion SALAS
const salasData = [
  { img: "assets/Salas/casa_de_la_tierra.webp", texto: "Casa De la Tierra" },// Sala 12
  { img: "assets/Salas/planetario-digital.webp", texto: "Domo Digital" },// Sala 13
  { img: "assets/Salas/Cosmonautica.webp", texto: "Cosmonautica" },// Sala 1
  { img: "assets/Salas/Exo_Planetas.webp", texto: "Exo Planetas" },// Sala 2
  { img: "assets/Salas/Mujeres_en_el_Espacio.webp", texto: "Mejeres En el Espacio" },// Sala 3
  { img: "assets/Salas/Mas_Mujeres_en_el_Espacio.webp", texto: "Mas Mujeres en el Espacio" },// Sala 4
  { img: "assets/Salas/Metioritos.webp", texto: "Meteoritos" },// Sala 5
  { img: "assets/Salas/Talleres.webp", texto: "Talleres" },// Sala 6
  { img: "assets/Salas/satelites_Naturales.webp", texto: "Satelites Naturales" },// Sala 7
  { img: "assets/Salas/Mural_Espacio.webp", texto: "Mural Espacial" },// Sala 8
  { img: "assets/Salas/Sistema_Solar.webp", texto: "Sistema Solar" },// Sala 9
  { img: "assets/Salas/Telescopios.webp", texto: "Telescopios" },// Sala 10
  { img: "assets/Salas/Mural.webp", texto: "Mural" },// Sala 11
];

document.addEventListener("DOMContentLoaded", function() {
  let currentIndex = 2;
  const carrusel = document.getElementById("carrusel");
  if (!carrusel) return;
  const elementos = carrusel.querySelectorAll(".sala");
  if (elementos.length < 5) return;

  function updateCarrusel() {
    for (let i = 0; i < 5; i++) {
      let index = (currentIndex + i - 2 + salasData.length) % salasData.length;
      elementos[i].querySelector("img").src = salasData[index].img;
      elementos[i].querySelector("p").textContent = salasData[index].texto;

      elementos[i].className = "sala";
      if (i === 0) elementos[i].classList.add("muy-izquierda");
      else if (i === 1) elementos[i].classList.add("izquierda");
      else if (i === 2) elementos[i].classList.add("central");
      else if (i === 3) elementos[i].classList.add("derecha");
      else if (i === 4) elementos[i].classList.add("muy-derecha");
    }
  }

  document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % salasData.length;
    updateCarrusel();
  });

  document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + salasData.length) % salasData.length;
    updateCarrusel();
  });

  updateCarrusel();
});