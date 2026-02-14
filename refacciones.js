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
    card.className = "card-ref";

    card.innerHTML = `
      <img
  src="${r.imagen || 'no-image.png'}"
  style="width:100%; max-height:200px; object-fit:cover"
/>


      <div class="card-body">
        <h4>${r.nombreprod || "Sin nombre"}</h4>
        <div class="ref">Ref: ${r.refinterna}</div>

        <div class="stock ${stockClass}">
          Stock: ${r.cantidad} ${r.unidad || ""}
        </div>

        <div class="card-actions">
          <button onclick="verDetalle(${r.id})">Editar</button>
          <button onclick="eliminar(${r.id})">Eliminar</button>
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

