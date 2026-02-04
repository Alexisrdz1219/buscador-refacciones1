const API = "https://buscador-refaccionesbackend.onrender.com";

let paginaActual = 1;
const LIMITE = 50;

async function cargarTabla() {
  const tbody = document.getElementById("tablaBody");

  tbody.innerHTML = `
    <tr>
      <td colspan="16" class="empty">Cargando...</td>
    </tr>
  `;

  try {
    const res = await fetch(
      `${API}/refacciones-paginadas?page=${paginaActual}&limit=${LIMITE}`
    );

    if (!res.ok) throw new Error("API caída");

    const data = await res.json();
    tbody.innerHTML = "";

    if (data.rows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="16" class="empty">Sin datos</td>
        </tr>
      `;
      return;
    }

    data.rows.forEach(r => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.nombreprod || ""}</td>
        <td>${r.categoriaprin || ""}</td>
        <td>${r.maquinamod || ""}</td>
        <td>${r.maquinaesp || ""}</td>
        <td>${r.tipoprod || ""}</td>
        <td>${r.modelo || ""}</td>
        <td>${r.refinterna}</td>
        <td>${r.palclave || ""}</td>
        <td>${r.cantidad}</td>
        <td>${r.unidad || ""}</td>
        <td>${r.ubicacion || ""}</td>
        <td>${r.observacion || ""}</td>
        <td>${r.imagen || ""}</td>
        <td>${r.fecha || ""}</td>
        <td>
          <button onclick="editar(
            ${r.id},
            ${r.cantidad},
            '${r.ubicacion || ""}',
            '${r.observacion || ""}'
          )">✏️</button>
          <button onclick="eliminar(${r.id})">🗑️</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    document.getElementById("pagina").textContent =
      `Página ${paginaActual} / ${Math.ceil(data.total / LIMITE)}`;

  } catch (err) {
    tbody.innerHTML = `
      <tr>
        <td colspan="16" class="empty">
          ❌ Error al cargar datos
        </td>
      </tr>
    `;
  }
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

// --------------------
// EDITAR
// --------------------
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

// --------------------
// ELIMINAR
// --------------------
function eliminar(id) {
  if (!confirm("¿Seguro que deseas eliminar esta refacción?")) return;

  fetch(`${API}/refacciones/${id}`, {
    method: "DELETE"
  }).then(() => cargarTabla());
}

cargarTabla();
