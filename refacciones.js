console.log("Refacciones.js cargado correctamente");
const API = "https://buscador-refaccionesbackend.onrender.com";

let textoBusqueda = "";
let filtroStock = "";

let paginaActual = 1;
const LIMITE = 24;

async function cargarTabla() {
  const contenedor = document.getElementById("cardsContainer");
  contenedor.innerHTML = `<p class="empty">Cargando...</p>`;

  const res = await fetch(
  `${API}/refacciones-paginadas?page=${paginaActual}&limit=${LIMITE}&search=${textoBusqueda}&stock=${filtroStock}`
);

  const data = await res.json();

  contenedor.innerHTML = "";

  if (data.rows.length === 0) {
    contenedor.innerHTML = `<p class="empty">Sin refacciones</p>`;
    return;
  }

  data.rows.forEach(r => {
    const stockClass =
  r.cantidad === 0 ? "zero" :
  r.cantidad < 5 ? "low" : "ok";


    const card = document.createElement("div");
    card.className = "ref-card";

card.innerHTML = `
  <div class="ref-img">
    <img 
      src="${r.imagen || 'no-image.jpg'}"
      alt="${r.nombreprod || 'Sin nombre'}"
      onerror="this.onerror=null; this.src='no-image.jpg';"
    />
  </div>

  <div class="ref-body">

    <!-- NOMBRE -->
    <h3 class="ref-title ${obtenerClaseTitulo(r.maquina)}">
      ${r.nombreprod || "Sin nombre"}
    </h3>

    <!-- REFERENCIA -->
    <div class="ref-modelo">
      Ref: <strong>${r.refinterna || "-"}</strong>
    </div>

    <!-- MODELO -->
    <div class="ref-modelo">
      Modelo: <strong>${r.modelo || "-"}</strong>
    </div>

    <!-- STOCK -->
    <div class="ref-cantidad ${stockClass}">
      Cantidad: <strong>${r.cantidad || 0} ${r.unidad || ""}</strong>
    </div>

    <!-- UBICACIÓN DESTACADA -->
    <div class="ref-ubicacion">
      📍 ${r.ubicacion || "Sin ubicación"}
    </div>

    <!-- BOTONES -->
    <div class="ref-actions">
      <button onclick="verDetalle(${r.id})" class="btn-ver">
        Editar
      </button>
      <button onclick="eliminar(${r.id})" class="btn-ver" style="background:#dc2626;">
        Eliminar
      </button>
    </div>

  </div>
`;


    contenedor.appendChild(card);
  });

  document.getElementById("pagina").textContent =
    `Página ${paginaActual} / ${Math.ceil(data.total / LIMITE)}`;
}



function next() {
  paginaActual++;
  cargarTabla();
}

function prev() {
  if (paginaActual > 1) {
    paginaActual--;
    cargarTabla();
  }
}

function editar(id, cantidadActual, ubicacionActual, observacionActual) {
  const cantidad = prompt("Cantidad:", cantidadActual);
  if (cantidad === null) return;

  const ubicacion = prompt("Ubicación:", ubicacionActual);
  const observacion = prompt("Observación:", observacionActual);

  fetch(`${API}/refacciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cantidad: Number(cantidad),
      ubicacion,
      observacion
    })
  }).then(() => cargarTabla());
}

function eliminar(id) {
  if (!confirm("¿Borrar esta refacción?")) return;

  fetch(`${API}/refacciones/${id}`, {
    method: "DELETE"
  }).then(() => cargarTabla());
}

cargarTabla();

function verDetalle(id) {
  window.location.href = `detalle.html?id=${id}`;
}

function buscar() {
  textoBusqueda = document.getElementById("busqueda").value.toLowerCase();
  filtroStock = document.getElementById("filtroStock").value;
  paginaActual = 1;
  cargarTabla();
}

function obtenerClaseTitulo(maquina) {
  if (!maquina) return "titulo-default";

  const nombre = maquina.toLowerCase().replace(/\s+/g, "-");

  return "titulo-" + nombre;
}
let stockClass = "";

if (r.cantidad <= 0) {
  stockClass = "stock-bajo";
} else if (r.cantidad <= 5) {
  stockClass = "stock-medio";
}
