const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

//Variables
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;
const terminoBusqueda = document.querySelector("#termino");
// Carga de nuestra aplicacion
window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
  terminoBusqueda.focus();
};

// funcion para realizar la validacion del formulario.
function validarFormulario(e) {
  e.preventDefault();
  if (terminoBusqueda.value === "") {
    mostrarAlerta("Agrega un Termino de busqueda");
    return;
  }
  // FETCH API buscar imagen
  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector(".bg-red-100");
  if (!existeAlerta) {
    const alerta = document.createElement("P");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );
    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;

    formulario.appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

async function buscarImagenes() {
  const termino = document.querySelector("#termino").value;
  const key = "36343123-0e1ea9d712daa5fcb1d26490d";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

  try {
    const response = await fetch(url);
    const resultado = await response.json();
    totalPaginas = calcularPaginas(resultado.totalHits);

    // console.log(totalPaginas)
    mostrarImagenes(resultado.hits);
  } catch (error) {
    console.log(error);
  }
}

function mostrarImagenes(imagenes) {
  limpiarHTML(resultado);
  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;
    // rel="noopener noreferrer" funciona para problemas de seguridad
    resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white rounded-md shadow-xl">
            <img class="w-full object-cover rounded-t-md shadow-xl" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
                    <p class="font-bold">${views}<span class="font-light"> Vistas</span></p>
                    <a class="block w-full bg-blue-800 transition duration-300 ease-in-out hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                     href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> Ver Imagen</a>
                </div>
            </div>
        </div>
        `;
  });

  // limpiar el paginador previo
  limpiarHTML(paginacionDiv);
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  while (true) {
    const { value, done } = iterador.next();

    if (done) return;
    // caso contrario, genera un boton por cada elemento del generador
    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "mx-auto",
      "mb-4",
      "font-bold",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };
    paginacionDiv.appendChild(boton);
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}
// generador que registra la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function limpiarHTML(termino) {
  while (termino.firstChild) {
    termino.removeChild(termino.firstChild);
  }
}
