const API = "https://buscador-refaccionesbackend.onrender.com";
let modeloSeleccionado = "";
let resultadosActuales = [];
let tagsActivos = [];
let modoGlobal = false;
let datosActuales = [];
let rol = "usuario";
let paginaActual = 1;
const LIMITE = 20;
let totalPaginas = 1;

// =========================
// 🔒 Validación de sesión
// =========================
async function validarSesion() {

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      // No hay token, redirigimos
      window.location.replace("index.html");
      return null;
    }

    // Validamos con backend
    const response = await fetch(`${API}/me`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!response.ok) {
      throw new Error("Token inválido");
    }

    const usuario = await response.json();

     rol = usuario.rol; // 🔥 AQUÍ GUARDAS EL ROL
    // Mostramos info en consola
    // console.log("ID:", usuario.id);
    // console.log("Nombre:", usuario.nombre);
    // console.log("Rol:", usuario.rol);

    // 🔥 Actualizar nombre en la UI si existe
    const elementoUsuario = document.getElementById("usuarioActivo");
    if (elementoUsuario) {
      elementoUsuario.textContent = usuario.nombre;
    }

    return usuario;

  } catch (error) {
    console.error("Error validando sesión:", error);
    localStorage.clear();
    window.location.replace("index.html");
    return null;
  }
}

// =========================
// Evitar volver atrás
// =========================
function bloquearBotonAtras() {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
}

// =========================
// Ejecutar al cargar la página
// =========================
window.addEventListener("DOMContentLoaded", async () => {
  const usuario = await validarSesion();
  if (!usuario) return;

  bloquearBotonAtras();
  cargarDestacadas();
});
window.addEventListener("pageshow", () => validarSesion());

async function despertarBackend() {

  const url = "https://buscador-refaccionesbackend.onrender.com/ping";

  for (let i = 0; i < 3; i++) {

    try {

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      await fetch(url, { signal: controller.signal });

      clearTimeout(timeout);

      // console.log("Backend ✅");
      return;

    } catch (e) {

      // console.log("Intentando despertar backend...");
      await new Promise(r => setTimeout(r, 3000));

    }

  }

}

document.addEventListener("DOMContentLoaded", async () => {

  despertarBackend();
const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("index.html");
    return;
  }

  try {
    const response = await fetch(`${API}/me`, {
      
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("Token inválido");
    }

    const data = await response.json();

    // 🔥 Mostrar nombre desde backend
    const elementoUsuario = document.getElementById("usuarioActivo");
    if (elementoUsuario) {
      elementoUsuario.textContent = data.nombre;
    }

    // 🔒 Bloqueo estético del botón atrás
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

  } catch (error) {
    localStorage.clear();
    window.location.replace("index.html");
    return;
  }
  
  const dash = document.getElementById("dash");
  const formFiltros = document.getElementById("formFiltros");

// if (formFiltros) {
//   formFiltros.style.display = "none";
// }
 dash?.classList.remove("d-none");
  formFiltros?.classList.add("d-none");

  document.getElementById("buscarTitulo")?.addEventListener("input", aplicarFiltros);
  document.getElementById("buscarRef")?.addEventListener("input", aplicarFiltros);
  document.getElementById("buscarModelo")?.addEventListener("input", aplicarFiltros);
  document.getElementById("filtroTipo")?.addEventListener("change", aplicarFiltros);
  document.getElementById("filtroUnidad")?.addEventListener("change", aplicarFiltros);
  document.getElementById("buscarPalabras")
  ?.addEventListener("input", aplicarFiltros);

const inputTag = document.getElementById("inputTag");
const contenedorTags = document.getElementById("contenedorTags");

document.getElementById("btnTodasRefacciones")?.addEventListener("click", async () => {

  // console.log("🌎 ACTIVANDO MODO GLOBAL");

  modoGlobal = true;

    dash?.classList.add("d-none");
    formFiltros?.classList.remove("d-none");

  modeloSeleccionado = "";
  resultadosActuales = [];

  // 🔥 Poner título por defecto
  const titulo = document.getElementById("tituloRefacciones");
  if (titulo) {
    titulo.textContent = "Refacciones IEMCO";
    titulo.className = "titulo-default"; // limpia otras clases
  }

  const Stitulo = document.getElementById("subtitulo");
  if (Stitulo) {
    Stitulo.textContent = "Panel general de control";
    Stitulo.className = "titulo-default"; // limpia otras clases
  }


  await llenarSelectsGlobal();

  // Lanza búsqueda inicial automáticamente
  await aplicarFiltros();
});


const getDestacadas = async () => {
  const res = await fetch("https://buscador-refaccionesbackend.onrender.com/refacciones/destacadas");
  const data = await res.json();
  console.log("RESPUESTA BACK:", data);
 // console.log(data);  Aquí tienes un array de refacciones destacadas
};

inputTag.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();

    const valor = inputTag.value.trim().toLowerCase();
    if (!valor) return;

    if (!tagsActivos.includes(valor)) {
      tagsActivos.push(valor);
      crearTagVisual(valor);
      aplicarFiltros();
    }

    inputTag.value = "";
  }
});

document.addEventListener("click", async (e) => {
  const link = e.target.closest(".maquina-link");
  if (!link) return;

  e.preventDefault();

  modoGlobal = false;

  dash?.classList.add("d-none");
  formFiltros?.classList.remove("d-none");

  tagsActivos = [];
  contenedorTags.querySelectorAll(".badge").forEach(t => t.remove());
  console.log(contenedorTags.innerHTML);

  const maquinamod = link.dataset.maquinamod;
  modeloSeleccionado = maquinamod;

  const res = await fetch(
    `${API}/refacciones-por-maquinamod?maquinamod=${encodeURIComponent(maquinamod)}`
  );

  const data = await res.json();
  console.log("RESPUESTA BACK:", data);

  resultadosActuales = data;

  llenarSelects(data);
  actualizarTitulo();
  mostrarResultados(data);
  cargarDestacadas();
  cargarEnvios();
});
});


function actualizarTitulo() {
  const titulo = document.getElementById("tituloRefacciones");
  const Stitulo = document.getElementById("subtitulo");

  if (!titulo && !Stitulo) return;

  // 🔥 Si estamos en modo global, solo dejamos el título por defecto y salimos
  if (modoGlobal) {
    titulo.textContent = "Refacciones IEMCO";
    titulo.className = "titulo-default";
    Stitulo.textContent = "Panel general de control";
    Stitulo.className = "titulo-default";
    return;
  }

  // Si no es global, mostramos el modelo seleccionado
  titulo.textContent = `Refacciones IEMCO - ${modeloSeleccionado}`;
  Stitulo.textContent = ``;

  // Limpia clases anteriores
  titulo.classList.remove(
    "titulo-default",
    "titulo-aoki",
    "titulo-asb",
    "titulo-nissei",
    "titulo-sumitomo",
    "titulo-enlainadora",
    "titulo-xhs-50kgs",
    "titulo-molino",
    "titulo-pagani",
    "titulo-rapid"
  );

  // Detecta palabra y asigna color
  if (modeloSeleccionado.toLowerCase().includes("aoki")) {
    titulo.classList.add("titulo-aoki");
  } else if (modeloSeleccionado.toLowerCase().includes("asb")) {
    titulo.classList.add("titulo-asb");
  } else if (modeloSeleccionado.toLowerCase().includes("nissei")) {
    titulo.classList.add("titulo-nissei");
  } else if (modeloSeleccionado.toLowerCase().includes("sumitomo")) {
    titulo.classList.add("titulo-sumitomo");
  } else if (modeloSeleccionado.toLowerCase().includes("enlainadora")) {
    titulo.classList.add("titulo-enlainadora");
  } else if (modeloSeleccionado.toLowerCase().includes("xhs-50kgs")) {
    titulo.classList.add("titulo-xhs-50kgs");
  } else if (modeloSeleccionado.toLowerCase().includes("molino")) {
    titulo.classList.add("titulo-molino");
  } else if (modeloSeleccionado.toLowerCase().includes("pagani")) {
    titulo.classList.add("titulo-pagani");
  } else if (modeloSeleccionado.toLowerCase().includes("rapid")) {
    titulo.classList.add("titulo-rapid");
  } else {
    titulo.classList.add("titulo-default");
  }
}

let cardsDOM = [];
let vistaActual = "cards"; // por defecto cards

document.getElementById("btnVistaCards").addEventListener("click", () => {
  vistaActual = "cards";
  actualizarVista();
  activarBoton("cards");
});

document.getElementById("btnVistaLista").addEventListener("click", () => {
  vistaActual = "lista";
  actualizarVista();
  activarBoton("lista");
});

function activarBoton(tipo) {
  const btnCards = document.getElementById("btnVistaCards");
  const btnLista = document.getElementById("btnVistaLista");

  if (tipo === "cards") {
    btnCards.classList.add("active", "btn-primary");
    btnCards.classList.remove("btn-outline-primary");
    btnLista.classList.remove("active", "btn-primary");
    btnLista.classList.add("btn-outline-primary");
  } else {
    btnLista.classList.add("active", "btn-primary");
    btnLista.classList.remove("btn-outline-primary");
    btnCards.classList.remove("active", "btn-primary");
    btnCards.classList.add("btn-outline-primary");
  }
}

// function mostrarResultados(lista) {
//   datosActuales = lista;
//   const cont = document.getElementById("resultados");
//   if (!cont) return;
  
//   cont.innerHTML = ""; // Limpiar resultados anteriores
//   cardsDOM = []; // Limpiar referencia a cards anteriores

//   cargarMas();

//   const fragment = document.createDocumentFragment();

//     lista.forEach(r => {
//       const card = document.createElement("div");
//       if (vistaActual === "cards") {
//   card.className = "ref-card";

//   card.innerHTML = `
//     <div class="ref-img">
     
//       <img 
//   src="${r.imagen || 'assets/img/no-image.jpg'}"
//   loading="lazy"
//   alt="${r.nombreprod}"
//   class="card-img-top"
//   onerror="this.onerror=null; this.src='assets/img/no-image.jpg';">

//            <div class="card-actions">
//            ${rol !== "personal" ? `
//          <button class="btn-check-ref" data-id="${r.id}">
//            <i class="bi ${r.completada ? 'bi-check-circle-fill text-success' : 'bi-circle'}"></i>
//          </button>
// ` : ""}
//         <button class="btn-broadcast" data-id="${r.id}">
//            <i class="bi ${r.destacada ? 'bi-broadcast text-primary' : 'bi-broadcast'}"></i>
//          </button>
          
//          <button class="btn-envio" data-id="${r.id}">
//   <i class="bi ${r.en_envio ? 'bi-truck text-success' : 'bi-truck text-muted'}"></i>
// </button>

//          <button class="btn-fullscreen" data-img="${r.imagen || 'assets/img/no-image.jpg'}">
//            <i class="bi bi-fullscreen"></i>
//          </button>
//        </div>
//     </div>

//     <div class="ref-body">
//       <h3 class="ref-title">${r.nombreprod}</h3>
//       <div class="ref-modelo">Modelo: <strong>${r.modelo || '-'}</strong></div>
//       <div class="ref-cantidad">Cantidad: <strong>${r.cantidad} ${r.unidad || ''}</strong></div>
//       <div class="ref-ubicacion btn-mapa" data-ubicacion="${r.ubicacion || ''}" style="cursor:pointer hover:opacity-80">
//   📍 ${r.ubicacion || 'Sin ubicación'}
// </div>

//       ${rol !== "personal" ? `
//   <div class="ref-actions">
//     <a href="paginas/Editar/detalle.html?id=${r.id}" class="btn btn-primary btn-sm">Editar</a>
//   </div>` : ""}


//     </div>

    
//   `;

//   // va arriba
// //   <div class="ref-actions">
// //     <a href="paginas/Usos de Refaccion/uso.html?id=${r.id}" class="btn btn-primary btn-sm">Registrar Uso</a>
// //   </div>

// // <button class="btn btn-primary btn-sm btn-ver-usos" data-id="${r.id}" title="Ver usos">
// //   <i class="bi bi-eye"></i>
// // </button>

//   const btnUsos = card.querySelector(".btn-ver-usos");

// if (btnUsos) {
//   btnUsos.addEventListener("click", (e) => {
//     e.stopPropagation();

//     console.log("ID REAL:", r.id); // 👈 DEBUG

//     refaccionActual = r.id; // ✅ AQUÍ SE GUARDA BIEN
//     obtenerUsos(r.id);
//   });
// }

// } else {

//   card.className = "ref-lista-item";

//   card.innerHTML = `
//     <div class="lista-nombre">${r.nombreprod}</div>
//     <div class="lista-ref">${r.refinterna || '-'}</div>
//     <div class="lista-ubicacion btn-mapa" data-ubicacion="${r.ubicacion || ''}" style="cursor:pointer">
//   ${r.ubicacion || 'Sin ubicación'}
// </div>
//     <div>
//       <a href="paginas/Editar/detalle.html?id=${r.id}" class="btn btn-sm btn-outline-primary">
//         Editar
//       </a>
//     </div>
//   `;
// }

//       card.dataset.nombreprod = (r.nombreprod || "").toLowerCase();
//       card.dataset.refinterna = (r.refinterna || "").toLowerCase();
//       card.dataset.modelo = (r.modelo || "").toLowerCase();
//       card.dataset.tipoprod = r.tipoprod || "";
//       card.dataset.unidad = r.unidad || "";
//       card.dataset.palclave = (r.palclave || "").toLowerCase();


//       fragment.appendChild(card);
//       cardsDOM.push(card);
//     });

//     cont.appendChild(fragment);
    
//     attachModalListeners(lista);

// }

function mostrarResultados(lista) {
  datosActuales = lista;
  paginaActual = 1;

  totalPaginas = Math.ceil(lista.length / LIMITE);

  renderPagina();
  renderPaginacion();
}

function renderPagina() {
  const cont = document.getElementById("resultados");
  if (!cont) return;

  cont.innerHTML = "";
  cardsDOM = [];

  const inicio = (paginaActual - 1) * LIMITE;
  const fin = inicio + LIMITE;

  const fragment = document.createDocumentFragment();

  datosActuales.slice(inicio, fin).forEach(r => {
    const card = document.createElement("div");

    if (vistaActual === "cards") {
      card.className = "ref-card";

      card.innerHTML = `
        <div class="ref-img">
        <img 
   src="${r.imagen || 'assets/img/no-image.jpg'}"
   alt="${r.nombreprod}"
   class="card-img-top"
   onerror="this.onerror=null; this.src='assets/img/no-image.jpg';" loading="lazy">

           <div class="card-actions">
           ${rol !== "personal" ? `
          <button class="btn-check-ref" data-id="${r.id}">
            <i class="bi ${r.completada ? 'bi-check-circle-fill text-success' : 'bi-circle'}"></i>
          </button>
 ` : ""}
        <button class="btn-broadcast" data-id="${r.id}">
            <i class="bi ${r.destacada ? 'bi-broadcast text-primary' : 'bi-broadcast'}"></i>
          </button>
          
          <button class="btn-envio" data-id="${r.id}">
   <i class="bi ${r.en_envio ? 'bi-truck text-success' : 'bi-truck text-muted'}"></i>
 </button>

         <button class="btn-fullscreen" data-img="${r.imagen || 'assets/img/no-image.jpg'}">
            <i class="bi bi-fullscreen"></i>
          </button>
        </div>
     </div>

    <div class="ref-body">
       <h3 class="ref-title">${r.nombreprod}</h3>
       <div class="ref-modelo">Modelo: <strong>${r.modelo || '-'}</strong></div>
       <div class="ref-cantidad">Cantidad: <strong>${r.cantidad} ${r.unidad || ''}</strong></div>
       <div class="ref-ubicacion btn-mapa" data-ubicacion="${r.ubicacion || ''}" style="cursor:pointer hover:opacity-80">
   📍 ${r.ubicacion || 'Sin ubicación'}
 </div>

       ${rol !== "personal" ? `
   <div class="ref-actions">
     <a href="paginas/Editar/detalle.html?id=${r.id}" class="btn btn-primary btn-sm">Editar</a>
   </div> ` : ""}
      `;
    } else {
      card.className = "ref-lista-item";
      card.innerHTML = `
      <div class="lista-nombre">${r.nombreprod}</div>
     <div class="lista-ref">${r.refinterna || '-'}</div>
     <div class="lista-ubicacion btn-mapa" data-ubicacion="${r.ubicacion || ''}" style="cursor:pointer">
   ${r.ubicacion || 'Sin ubicación'}
 </div>
     <div>
       <a href="paginas/Editar/detalle.html?id=${r.id}" class="btn btn-sm btn-outline-primary">
         Editar
       </a>
     </div>
      `;
    }

    fragment.appendChild(card);
    cardsDOM.push(card);
  });

  cont.appendChild(fragment);
}

function renderPaginacion() {
  const cont = document.getElementById("paginacion");
  if (!cont) return;

  cont.innerHTML = "";

  let html = "";

  // Botón anterior
  html += `
    <button class="btn btn-sm btn-outline-primary me-1" 
      ${paginaActual === 1 ? "disabled" : ""} 
      data-page="prev">
      ←
    </button>
  `;

  // Números de página
  for (let i = 1; i <= totalPaginas; i++) {
    html += `
      <button class="btn btn-sm ${i === paginaActual ? "btn-primary" : "btn-outline-primary"} me-1"
        data-page="${i}">
        ${i}
      </button>
    `;
  }

  // Botón siguiente
  html += `
    <button class="btn btn-sm btn-outline-primary" 
      ${paginaActual === totalPaginas ? "disabled" : ""} 
      data-page="next">
      →
    </button>
  `;

  cont.innerHTML = html;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("#paginacion button");
  if (!btn) return;

  const action = btn.dataset.page;

  if (action === "prev" && paginaActual > 1) {
    paginaActual--;
  } else if (action === "next" && paginaActual < totalPaginas) {
    paginaActual++;
  } else if (!isNaN(action)) {
    paginaActual = Number(action);
  }

  renderPagina();
  renderPaginacion();

  window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 UX bonito
});



async function obtenerUsos(refaccionId) {
  document.getElementById("modalUsos").style.display = "flex";
document.body.style.overflow = "hidden"; // 🚫 bloquea scroll/interacción
  const res = await fetch(`${API}/usos/${refaccionId}`);
  const data = await res.json();
  console.log("RESPUESTA BACK:", data);

  const lista = document.getElementById("listaUsos");
  lista.innerHTML = "";

  if (!data || data.length === 0) {
    lista.innerHTML = "<li>Sin usos registrados</li>";

    // 🔥 IMPORTANTE: abrir modal aquí también
    document.getElementById("modalUsos").style.display = "block";
    return;
  }
  // 🔥 agrupar por uso
  const usosMap = {};

  data.forEach(row => {
    if (!usosMap[row.id]) {
      usosMap[row.id] = {
  id: row.id,
  area: row.area_maquina,
  lleva_oring: row.lleva_oring,
  orings: []
};
    }

    if (row.oring_id) {
      usosMap[row.id].orings.push(row.oring_nombre);
    }
  });

  // 🔥 render
 Object.values(usosMap).forEach(u => {
  const li = document.createElement("li");

  let texto = `${u.area}`;

  if (u.lleva_oring) {
    texto += " 🔵 Con Oring";

    if (u.orings.length > 0) {
      texto += ` → [${u.orings.join(", ")}]`;
    }
  }

  li.innerHTML = `
    <div style="display:flex; justify-content:space-between;">
      <span>${texto}</span>
      <button onclick="eliminarUso(${u.id})">❌</button>
    </div>
  `;

  lista.appendChild(li);
});

  document.getElementById("modalUsos").style.display = "block";
}

function abrirModalUsos() {
  document.getElementById("modalUsos").style.display = "flex";
  document.body.style.overflow = "hidden";  // bloquea scroll de fondo
}


function cerrarModal() {
  document.getElementById("modalUsos").style.display = "none";
  document.body.style.overflow = "auto";    // desbloquea scroll
}

// click fuera del contenido para cerrar
document.getElementById("modalUsos").addEventListener("click", (e) => {
  if (e.target.id === "modalUsos") cerrarModal();
});

async function eliminarUso(id) {
  const confirmar = confirm("¿Eliminar este uso?");

  if (!confirmar) return;

  try {
    await fetch(`${API}/usos/${id}`, {
      method: "DELETE"
    });

    alert("Uso eliminado ✅");

    // 🔄 recargar lista
    obtenerUsos(refaccionActual);

  } catch (error) {
    console.error(error);
    alert("Error al eliminar");
  }
}
// --- FUNCIONES DEL MAPA (FUERA de mostrarResultados) ---


document.addEventListener("click", async (e) => {
  if (e.target.closest(".btn-envio")) {
    const btn = e.target.closest(".btn-envio");
    const id = btn.dataset.id;

    console.log("CLICK ENVIO", btn.dataset.id);

    try {
      const res = await fetch(`${API}/refacciones/envio/${id}`, {
        method: "PUT"
      });

      const data = await res.json();
      console.log("RESPUESTA BACK:", data);

      if (data.ok) {
        const icon = btn.querySelector("i");

        if (data.en_envio) {
          icon.classList.remove("text-muted");
          icon.classList.add("text-success");
        } else {
          icon.classList.remove("text-success");
          icon.classList.add("text-muted");
        }
        cargarEnvios();
      }

    } catch (error) {
      console.error("Error:", error);
    }
  }
});

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-quitar-envio");
  if (!btn) return;

  const id = btn.dataset.id;

  try {
    await fetch(`${API}/refacciones/envio/${id}`, {
      method: "PUT"
    });

    cargarEnvios(); // refrescar
  } catch (error) {
    console.error(error);
  }
});

// Delegación de eventos para capturar clics en elementos creados dinámicamente
document.addEventListener("click", (e) => {
    // Buscamos si el clic fue en un elemento con la clase .btn-mapa
    const btnUbicacion = e.target.closest(".btn-mapa");
    
    if (btnUbicacion) {
        e.preventDefault();
        const ubi = btnUbicacion.getAttribute("data-ubicacion");
        // console.log("Abriendo mapa para:", ubi);  Para depuración
        abrirMapa(ubi);
    }
});

// POR CORREGIR

const CONFIG_ALMACENES = {
  "A1": [
  ["A5", "G1", "G1", "H1", "H1", "I1", "I1", "J1", "J1", null],
  ["A4", null, null, null, null, null, null, null, "F2", null],
  ["A3", null, "B2", "C2", null, "D1", "E1", null, "F1", null],
  ["A2", null, "B1", "C1", null, null, null, null, null, null],
  ["A1", null, "Orings", "Orings", null, null, null, null, null, null],
  ["H", null, null, null, null, null, null, null, null, null]
],

"A2": [
  ["N1", "O1", null, null, null, null, null, null, null, null],
  ["M1", null, null, null, null, null, null, null, null, null],
  ["L1", null, null, null, null, null, null, "P1", null, null],
  [null, "K1", null, null, null, null, null, null, "Q1", null],
  [null, null, null, null, null, null, null, null, "R1", null],
  [null, null, "Z1", "Z1", null, null, null, null, "S1", null]
],

"A3": [
  ["T1", "U1", "V1", "W1", "X1", "Y1", "Z1", null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null]
 ],
 "Herramienta": [
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, "PE", "LLI", "LLI", null, null, null, null, null],
  [null, null, "LL", "LL", "LL2", "LL2", null, null, null, null],
  [null, null, "AR", "AR", "GH", "GH", null, null, null, null],
  [null, null, "GR", "GR", "GR", "GR", null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null]
 ]
};

const visitado = new Set();

function key(r, c) {
  return `${r}-${c}`;
}

function abrirMapa(ubicacionStr) {
  if (!ubicacionStr || ubicacionStr.includes('Sin ubicación')) return;

  const modal = document.getElementById("modalMapa");
  const container = document.getElementById("contenedorMapaDinamico");
  const display = document.getElementById("ubicacionTextoDisplay");

  container.replaceChildren(); 
  modal.style.display = "flex";
  display.innerText = ubicacionStr;

  const partes = ubicacionStr.trim().split(/\s+/);
  const almacenId = partes[0];
  const anaquelTarget = partes[1]?.split("-")[0];

  const grid = CONFIG_ALMACENES[almacenId] || [];

  const fragment = document.createDocumentFragment();
  visitado.clear();

  // 🔹 RECORRER GRID
  for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {

    const id = grid[r][c];

    if (!id || visitado.has(key(r, c))) continue;

    let width = 1;
    let height = 1;

    // 🔥 UNIR SOLO HORIZONTAL (incluye "Solicitar")
    while (grid[r][c + width] === id) {
      width++;
    }


    // marcar visitados
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        visitado.add(key(r + i, c + j));
      }
    }

    const celda = document.createElement("div");
    const esActivo = id === anaquelTarget;

    // 🎨 estilo especial para "Solicitar"
    const esSolicitar = id === "Solicitar";

    celda.style.cssText = `
       grid-column: ${c + 1} / span ${width};
       grid-row: ${r + 1} / span ${height};

      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      border-radius: 12px;
      font-weight: bold;

      background: ${
        esSolicitar
          ? '#868686'
          : esActivo
          ? 'linear-gradient(135deg, #007a33, #00a84f)'
          : '#ffffff'
      };

      color: ${esSolicitar || esActivo ? '#fff' : '#374151'};

      border: ${esSolicitar ? 'none' : `2px solid ${esActivo ? '#007a33' : '#e5e7eb'}`};

      box-shadow: ${
        esActivo
          ? '0 10px 25px rgba(0,122,51,0.4)'
          : '0 3px 8px rgba(0,0,0,0.08)'
      };

      transition: 0.25s;
    `;

    celda.innerHTML = `
      <div style="font-size:${width > 1 ? '1.2rem' : '0.85rem'}">
        ${id}
      </div>
      ${esActivo ? '<div>📍</div>' : ''}
    `;

    fragment.appendChild(celda);
  }
}

  container.style.display = "grid";
container.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`;
container.style.gridAutoRows = "50px"; // 🔥 altura fija
container.style.gap = "6px";

  container.appendChild(fragment);
}

function cerrarMapa() {
  document.getElementById("modalMapa").style.display = "none";
}

// --- LISTENER DE CLICS (FUERA de mostrarResultados) ---
document.addEventListener("click", (e) => {
    const btnUbicacion = e.target.closest(".btn-mapa");
    if (btnUbicacion) {
        const ubi = btnUbicacion.getAttribute("data-ubicacion");
        abrirMapa(ubi);
        return;
    }

    const modal = document.getElementById("modalMapa");
    if (e.target === modal) {
        cerrarMapa();
    }
});

function actualizarVista() {
  const cont = document.getElementById("resultados");

  if (vistaActual === "lista") {
    cont.classList.remove("ref-container");
  } else {
    cont.classList.add("ref-container");
  }

  mostrarResultados(datosActuales);
}

function attachModalListeners(lista) {
// --- Modal Bootstrap Fullscreen (solo se agrega una vez) ---
if (!document.getElementById("modalDetalles")) {
  const modalHTML = `
  <div class="modal fade" id="modalDetalles" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content border-0 shadow-lg">

        <!-- Header -->
        <div class="modal-header text-white border-0" style="background-color:#167d2b;">
          <h5 class="modal-title fw-bold" id="modal-nombre">Detalle Producto</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <!-- Body -->
        <div class="modal-body p-4 d-flex flex-column flex-lg-row gap-4">

          <!-- Imagen destacada -->
          <div class="modal-imagen flex-shrink-0 text-center position-relative" style="min-width:300px; cursor:pointer;">
            <img id="modal-img" src="assets/img/no-image.jpg" alt="Producto" class="img-fluid rounded shadow-sm border zoom-img" style="max-height:450px; object-fit:contain;" loading="lazy">
          </div>

          <!-- Datos -->
          <div class="modal-detalles flex-grow-1 d-flex flex-column gap-3">

            <!-- Nombre + categoría -->
            <h3 class="fw-bold" id="modal-nombreprod">Nombre Producto</h3>
            <span class="badge bg-success text-dark" id="modal-categoria">Categoría: -</span>

            <!-- Grid de detalles -->
            <div class="row row-cols-1 row-cols-md-2 g-3 mt-2">
              <div class="col"><div class="fw-semibold text-secondary">Tipo</div><div id="modal-tipoprod">-</div></div>
              <div class="col"><div class="fw-semibold text-secondary">Modelo</div><div id="modal-modelo">-</div></div>
              <div class="col"><div class="fw-semibold text-secondary">Ref. Interna</div><div id="modal-refinterna">-</div></div>
              <div class="col"><div class="fw-semibold text-secondary">Palabra Clave</div><div id="modal-palclave">-</div></div>
              <div class="col"><div class="fw-semibold text-secondary">Cantidad</div><div id="modal-cantidad">-</div></div>
              <div class="col"><div class="fw-semibold text-secondary">Unidad</div><div id="modal-unidad">-</div></div>
            </div>

            <!-- Máquinas compatibles -->
            <div class="mt-3">
              <div class="fw-semibold text-success mb-1">Máquinas Compatibles</div>
              <div id="modal-maquinas" class="d-flex flex-wrap gap-2"></div>
            </div>

            <!-- Ubicación destacada -->
            <div class="mt-3 p-3 bg-success bg-opacity-10 border border-success rounded d-flex align-items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0d6efd" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                <path d="M12 6a6 6 0 1 1-12 0 6 6 0 0 1 12 0zM8 0a8 8 0 0 0-8 8c0 4 4 8 8 12 4-4 8-8 8-12a8 8 0 0 0-8-8z"/>
              </svg>
              <div>
                <div class="fw-bold text-success">Ubicación</div>
                <div id="modal-ubicacion" class="fs-5 fw-semibold text-success">Sin ubicación</div>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="mt-3">
              <div class="fw-semibold text-secondary">Observaciones</div>
              <div id="modal-observacion" class="text-break fs-6">-</div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-0 justify-content-end">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>

      </div>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// --- Inicializar Bootstrap 5 Modal ---
const modalDetallesEl = document.getElementById('modalDetalles');
const modalDetalles = new bootstrap.Modal(modalDetallesEl);

  // --- Abrir modal con datos ---
  document.querySelectorAll(".btn-detalles").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const ref = lista.find(r => r.id == id);
      if (!ref) return;

      // --- Datos básicos ---
      document.getElementById("modal-nombre").textContent = ref.nombreprod;
      document.getElementById("modal-nombreprod").textContent = ref.nombreprod;
      document.getElementById("modal-categoria").textContent = `Categoría: ${ref.categoriaprin}`;
      document.getElementById("modal-tipoprod").textContent = ref.tipoprod || '-';
      document.getElementById("modal-modelo").textContent = ref.modelo || '-';
      document.getElementById("modal-refinterna").textContent = ref.refinterna || '-';
      document.getElementById("modal-palclave").textContent = ref.palclave || '-';
      document.getElementById("modal-cantidad").textContent = ref.cantidad || '-';
      document.getElementById("modal-unidad").textContent = ref.unidad || '-';
      document.getElementById("modal-ubicacion").textContent = ref.ubicacion || 'Sin ubicación';
      document.getElementById("modal-observacion").textContent = ref.observacion || '-';
      document.getElementById("modal-img").src = ref.imagen || 'assets/img/no-image.jpg';

      // --- Contenedor de máquinas ---
      const contMaquinas = document.getElementById("modal-maquinas");
      contMaquinas.innerHTML = "Cargando máquinas...";

      try {
        // --- Traer todas las máquinas disponibles ---
        const maquinasDisponibles = await fetch(`${API}/maquinas`).then(r => r.json());

        // --- Traer compatibles actuales (solo IDs) ---
        const resp = await fetch(`${API}/refacciones/${ref.id}/compatibles`);
        const data = await resp.json();

        contMaquinas.innerHTML = "";
        if (data.maquinas && data.maquinas.length > 0) {
          data.maquinas.forEach(idMaquina => {
            const maquina = maquinasDisponibles.find(m => m.id == idMaquina);
            if (!maquina) return;

            const span = document.createElement("span");
            span.className = "badge bg-success me-1 mb-1";
            // Muestra nombre, tipo y modelo de la máquina
            span.textContent = `${maquina.nombre || ""} ${maquina.tipo || ""} ${maquina.modelo || ""}`;
            span.title = `ID: ${maquina.id || ""} Tipo: ${maquina.tipo || ""} Modelo: ${maquina.modelo || ""}`;
            contMaquinas.appendChild(span);
          });
        } else {
          contMaquinas.textContent = "No hay máquinas compatibles";
        }
      } catch (err) {
        contMaquinas.textContent = "Error al cargar máquinas";
        console.error(err);
      }

      // --- Mostrar modal ---
      modalDetalles.show();
    });
  });
}

// --- Zoom en imagen al hacer click ---
document.addEventListener("click", (e) => {
  if(e.target.classList.contains("zoom-img")){
    const src = e.target.src;
    const overlay = document.createElement("div");
    overlay.className = "img-zoom-overlay d-flex justify-content-center align-items-center";
    overlay.innerHTML = `<img src="${src}" style="max-width:90%; max-height:90%; border-radius:0.5rem; box-shadow:0 0.5rem 1rem rgba(0,0,0,0.5);"> loading="lazy"`;
    overlay.addEventListener("click", ()=>overlay.remove());
    document.body.appendChild(overlay);
  }
});


// ⚡ Función para filtrar sin reconstruir el DOM
function filtrarCards() {
  const tit = (document.getElementById("buscarTitulo")?.value || "").toLowerCase().trim();
  const ref = (document.getElementById("buscarRef")?.value || "").toLowerCase().trim();
  const modelo = (document.getElementById("buscarModelo")?.value || "").toLowerCase().trim();
  const tipo = document.getElementById("filtroTipo")?.value || "";
  const unidad = document.getElementById("filtroUnidad")?.value || "";
  const palabras = tagsActivos.map(t => t.toLowerCase());

  cardsDOM.forEach(card => {
    const coincideTitulo = !tit || card.dataset.nombreprod.includes(tit);
    const coincideRef = !ref || card.dataset.refinterna.includes(ref);
    const coincideModelo = !modelo || card.dataset.modelo.includes(modelo);
    const coincideTipo = !tipo || card.dataset.tipoprod === tipo;
    const coincideUnidad = !unidad || card.dataset.unidad === unidad;
    const coincidePalabras = palabras.length === 0 || palabras.every(p => card.dataset.palclave.includes(p));

    card.style.display = (coincideTitulo && coincideRef && coincideModelo && coincideTipo && coincideUnidad && coincidePalabras) ? "block" : "none";
  });
}

async function aplicarFiltros() {

  // console.log("🔥 aplicarFiltros ejecutado");
  // console.log("modoGlobal:", modoGlobal);
  // console.log("Ejemplo registro global:", data[0]);

  const tit = document.getElementById("buscarTitulo")?.value.toLowerCase().trim() || "";
  const ref = document.getElementById("buscarRef")?.value.toLowerCase().trim() || "";
  const modelo = document.getElementById("buscarModelo")?.value.toLowerCase().trim() || "";
  const tipo = document.getElementById("filtroTipo")?.value || "";
  const unidad = document.getElementById("filtroUnidad")?.value || "";

  // 🔥 SOLO usamos tagsActivos como fuente real
  const palabrasActivas = tagsActivos.map(t => t.toLowerCase());

  // =========================
  // 🌎 MODO GLOBAL
  // =========================
  if (modoGlobal) {

    try {

      const params = new URLSearchParams({
        tit,
        ref,
        modelo,
        tipo,
        unidad,
        palabras: palabrasActivas.join(" ") // 🔥 ahora sí manda los tags reales
      });

      const res = await fetch(`${API}/buscar-refacciones?${params}`);
      const data = await res.json();
      console.log("RESPUESTA BACK:", data);

      // console.log("Total registros global:", data.length);

      resultadosActuales = data;

actualizarSelectsDesdeResultados(data);
mostrarResultados(data);


    } catch (error) {
      console.error("Error en búsqueda global:", error);
      mostrarResultados([]);
    }

    return;
  }

  // =========================
  // 🖥 MODO LOCAL (MÁQUINA ESPECÍFICA)
  // =========================

  if (!resultadosActuales || resultadosActuales.length === 0) {
    // console.log("⚠ No hay datos locales cargados");
    return;
  }

  const filtrados = resultadosActuales.filter(r => {

    const coincideTitulo =
      !tit || String(r.nombreprod || "").toLowerCase().includes(tit);

    const coincideRef =
      !ref || String(r.refinterna || "").toLowerCase().includes(ref);

    const coincideModelo =
      !modelo || String(r.modelo || "").toLowerCase().includes(modelo);

    const coincideTipo =
      !tipo || r.tipoprod === tipo;

    const coincideUnidad =
      !unidad || r.unidad === unidad;

    // 🔥 versión robusta para palclave tipo "valvula, aire, acero"
    const palabrasRegistro = String(r.palclave || "")
      .toLowerCase()
      .split(",")
      .map(p => p.trim());

    const coincidePalabras =
      palabrasActivas.length === 0 ||
      palabrasActivas.every(tag =>
        palabrasRegistro.some(pal => pal.includes(tag))
      );

    return coincideTitulo &&
           coincideRef &&
           coincideModelo &&
           coincideTipo &&
           coincideUnidad &&
           coincidePalabras;
  });

  // console.log("Total registros local:", filtrados.length);

  actualizarSelectsDesdeResultados(filtrados);
mostrarResultados(filtrados);

}




function llenarSelects(data) {
  const selectTipo = document.getElementById("filtroTipo");
  const selectUnidad = document.getElementById("filtroUnidad");

  // limpiar excepto la primera opción
  selectTipo.innerHTML = `<option value="">Todos los tipos</option>`;
  selectUnidad.innerHTML = `<option value="">Todas las unidades</option>`;

  const tiposUnicos = [...new Set(data.map(r => r.tipoprod).filter(Boolean))];
  const unidadesUnicas = [...new Set(data.map(r => r.unidad).filter(Boolean))];

  tiposUnicos.forEach(tipo => {
    selectTipo.innerHTML += `<option value="${tipo}">${tipo}</option>`;
  });

  unidadesUnicas.forEach(unidad => {
    selectUnidad.innerHTML += `<option value="${unidad}">${unidad}</option>`;
  });
}

function crearTagVisual(texto) {

  const tag = document.createElement("span");
  tag.className = "badge bg-primary d-flex align-items-center";
  tag.style.gap = "6px";
  tag.textContent = texto;

  const btn = document.createElement("span");
  btn.textContent = "✕";
  btn.style.cursor = "pointer";

  btn.onclick = function() {
    tagsActivos = tagsActivos.filter(t => t !== texto);
    tag.remove();
    aplicarFiltros();
  };

  tag.appendChild(btn);

  contenedorTags.insertBefore(tag, inputTag);
}

async function llenarSelectsGlobal() {
  const res = await fetch(`${API}/refacciones-metadata`);
  const data = await res.json();
  console.log("RESPUESTA BACK:", data);

  const selectTipo = document.getElementById("filtroTipo");
  const selectUnidad = document.getElementById("filtroUnidad");

  selectTipo.innerHTML = `<option value="">Todos los tipos</option>`;
  selectUnidad.innerHTML = `<option value="">Todas las unidades</option>`;

  data.tipos.forEach(t => {
    selectTipo.innerHTML += `<option value="${t}">${t}</option>`;
  });

  data.unidades.forEach(u => {
    selectUnidad.innerHTML += `<option value="${u}">${u}</option>`;
  });
}

function actualizarSelectsDesdeResultados(data) {

  const selectTipo = document.getElementById("filtroTipo");
  const selectUnidad = document.getElementById("filtroUnidad");

  const tipoSeleccionado = selectTipo.value;
  const unidadSeleccionada = selectUnidad.value;

  const tiposUnicos = [...new Set(data.map(r => r.tipoprod).filter(Boolean))];
  const unidadesUnicas = [...new Set(data.map(r => r.unidad).filter(Boolean))];

  selectTipo.innerHTML = `<option value="">Todos los tipos</option>`;
  selectUnidad.innerHTML = `<option value="">Todas las unidades</option>`;

  tiposUnicos.forEach(tipo => {
    selectTipo.innerHTML += `<option value="${tipo}">${tipo}</option>`;
  });

  unidadesUnicas.forEach(unidad => {
    selectUnidad.innerHTML += `<option value="${unidad}">${unidad}</option>`;
  });

  // Restaurar selección si todavía existe
  if (tiposUnicos.includes(tipoSeleccionado)) {
    selectTipo.value = tipoSeleccionado;
  }

  if (unidadesUnicas.includes(unidadSeleccionada)) {
    selectUnidad.value = unidadSeleccionada;
  }
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-check-ref");
  if (!btn) return;

  const id = btn.dataset.id;

  const res = await fetch(`${API}/refacciones/${id}/completar`, {
    method: "PATCH"
  });

  const data = await res.json();
  console.log("RESPUESTA BACK:", data);

  const icon = btn.querySelector("i");

  if (data.completada) {
    icon.className = "bi bi-check-circle-fill text-success";
  } else {
    icon.className = "bi bi-circle";
  }
});

// 1. Función para obtener datos y pintar el Dashboard
async function cargarDestacadas() {
  const contenedor = document.getElementById("contenedorResultadosDsah");
  
  // Si no estamos en la página que tiene el dashboard, salimos silenciosamente
  if (!contenedor) return; 

  try {
    const res = await fetch(`${API}/refacciones/destacadas`);
    if (!res.ok) throw new Error("Error en la respuesta del servidor");
    
    const data = await res.json();
    console.log("RESPUESTA BACK:", data);
    renderDestacadas(data);
  } catch (error) {
    console.error("Error cargando destacadas:", error);
  }
}

// 2. Función para generar el HTML del Dashboard
function renderDestacadas(lista) {
  const contenedor = document.getElementById("contenedorResultadosDsah");

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-light text-center border shadow-sm">
        <i class="bi bi-info-circle"></i> No hay refacciones en seguimiento.
      </div>`;
    return;
  }

  contenedor.innerHTML = `
    <div class="card w-100 shadow-sm">
      <div class="card-header fw-bold bg-white d-flex justify-content-between">
        <span><i class="bi bi-broadcast text-primary"></i> Panel de Seguimiento</span>
        <span class="badge bg-primary">${lista.length}</span>
      </div>
      <ul class="list-group list-group-flush">
        ${lista.map(r => `
          <li class="list-group-item d-flex justify-content-between align-items-center py-3">
            <div>
              <strong class="d-block">${r.nombreprod}</strong>
              <small class="text-muted">${r.modelo || 'S/M'} | <i class="bi bi-geo-alt"></i> ${r.ubicacion || 'S/U'}</small>
            </div>
            <button class="btn btn-outline-danger btn-sm btn-desactivar" data-id="${r.id}" title="Quitar seguimiento">
              <i class="bi bi-x-lg"></i>
            </button>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

// 3. Listener Global para clics (Maneja Activar y Desactivar)
document.addEventListener("click", async (e) => {
  // Detectar si se clickeó el botón de la lista general O el del dashboard
  const btn = e.target.closest(".btn-broadcast, .btn-desactivar");
  if (!btn) return;

  const id = btn.dataset.id;
  const icono = btn.querySelector("i");

  try {
    // Deshabilitar botón temporalmente para evitar doble click
    btn.disabled = true;

    const res = await fetch(`${API}/refacciones/${id}/broadcast`, { method: "PUT" });
    const resultado = await res.json();

    if (resultado.ok) {
      // Si el botón es el de la lista general, cambiamos su color visualmente
      if (btn.classList.contains("btn-broadcast")) {
        btn.classList.toggle("active"); // Opcional: clase CSS para marcarlo
        if(icono) icono.classList.toggle("text-primary");
      }

      // SIEMPRE actualizamos el dashboard para reflejar el cambio
      await cargarDestacadas();
    }
  } catch (error) {
    alert("No se pudo actualizar el estado.");
  } finally {
    btn.disabled = false;
  }
});

async function cargarEnvios() {
  const contenedor = document.getElementById("contenedorResultadosEnvio");
  if (!contenedor) return;

  try {
    const res = await fetch(`${API}/refacciones/envio`);
    const data = await res.json();
console.log(data);
    console.log("RESPUESTA BACK:", data);
    renderEnvios(data);

  } catch (error) {
    console.error("Error cargando envíos:", error);
  }
}

function renderEnvios(lista) {
  const contenedor = document.getElementById("contenedorResultadosEnvio");

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-light text-center border shadow-sm">
        <i class="bi bi-truck"></i> No hay refacciones en envío.
      </div>`;
    return;
  }

  contenedor.innerHTML = `
    <div class="card w-100 shadow-sm">
      <div class="card-header fw-bold bg-white d-flex justify-content-between">
        <span><i class="bi bi-truck text-success"></i> Panel de Envíos</span>
        <span class="badge bg-success">${lista.length}</span>
      </div>
      <ul class="list-group list-group-flush">
        ${lista.map(r => `
          <li class="list-group-item d-flex justify-content-between align-items-center py-3">
            <div>
              <strong class="d-block">${r.nombreprod}</strong>
              <small class="text-muted">
                ${r.modelo || 'S/M'} | 
                <i class="bi bi-geo-alt"></i> ${r.ubicacion || 'S/U'}
              </small>
            </div>

            <button class="btn btn-outline-success btn-sm btn-quitar-envio" data-id="${r.id}" title="Quitar de envío">
              <i class="bi bi-x-lg"></i>
            </button>

          </li>
        `).join("")}
      </ul>
    </div>
  `;
}