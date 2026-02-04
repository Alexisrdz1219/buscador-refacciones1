// const API_URL = "https://buscador-refaccionesbackend.onrender.com";
// const tbody = document.getElementById("tablaBody");

// function cargarTabla() {
//   fetch(`${API_URL}/refacciones`)
//     .then(res => res.json())
//     .then(data => {
//       tbody.innerHTML = "";

//       if (data.length === 0) {
//         tbody.innerHTML = `
//           <tr>
//             <td colspan="15" class="empty">No hay refacciones registradas</td>
//           </tr>
//         `;
//         return;
//       }

//       data.forEach(r => {
//         tbody.innerHTML += `
//           <tr>
//             <td>${r.id}</td>
//             <td>${r.nombreprod}</td>
//             <td>${r.categoriaprin || ""}</td>
//             <td>${r.maquinamod || ""}</td>
//             <td>${r.maquinaesp || ""}</td>
//             <td>${r.tipoprod || ""}</td>
//             <td>${r.modelo || ""}</td>
//             <td>${r.refinterna}</td>
//             <td>${r.palclave || ""}</td>
//             <td>${r.cantidad}</td>
//             <td>${r.unidad || ""}</td>
//             <td>${r.ubicacion || ""}</td>
//             <td>${r.observacion || ""}</td>
//             <td>${r.imagen || ""}</td>
//             <td>${new Date(r.created_at).toLocaleDateString()}</td>
//             <td>
//               <button onclick="editar(${r.id}, ${r.cantidad}, '${r.ubicacion || ""}', '${r.observacion || ""}')">✏️</button>
//               <button onclick="eliminar(${r.id})">🗑️</button>
//             </td>
//           </tr>
//         `;
//       });
//     })
//     .catch(() => {
//       tbody.innerHTML = `
//         <tr>
//           <td colspan="15" class="empty">Error al conectar con el servidor</td>
//         </tr>
//       `;
//     });
// }

// cargarTabla();

// function editar(id, cantidadActual, ubicacionActual, observacionActual) {
//   const cantidad = prompt("Cantidad:", cantidadActual);
//   if (cantidad === null) return;

//   const ubicacion = prompt("Ubicación:", ubicacionActual);
//   const observacion = prompt("Observación:", observacionActual);

//   fetch(`${API_URL}/refacciones/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       cantidad: Number(cantidad),
//       ubicacion,
//       observacion
//     })
//   }).then(() => cargarTabla());
// }

// function eliminar(id) {
//   if (!confirm("¿Seguro que deseas borrar esta refacción?")) return;

//   fetch(`${API_URL}/refacciones/${id}`, {
//     method: "DELETE"
//   }).then(() => cargarTabla());
// }

const API = "https://buscador-refaccionesbackend.onrender.com";
let paginaActual = 1;
const LIMITE = 50;

async function cargarTabla() {
  const tbody = document.getElementById("tablaBody");
  tbody.innerHTML = `<tr><td colspan="15" class="empty">Cargando...</td></tr>`;

  const res = await fetch(
    `${API}/refacciones-paginadas?page=${paginaActual}&limit=${LIMITE}`
  );

  const data = await res.json();
  tbody.innerHTML = "";

  if (data.rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="15" class="empty">Sin datos</td></tr>`;
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
               <button onclick="editar(${r.id}, ${r.cantidad}, '${r.ubicacion || ""}', '${r.observacion || ""}')">✏️</button>
               <button onclick="eliminar(${r.id})">🗑️</button>
            </td>
    `;
    tbody.appendChild(tr);
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

cargarTabla();


function editar(id, cantidadActual, ubicacionActual, observacionActual) {
  const cantidad = prompt("Cantidad:", cantidadActual);
  if (cantidad === null) return;

  const ubicacion = prompt("Ubicación:", ubicacionActual);
  const observacion = prompt("Observación:", observacionActual);

  fetch(`${API_URL}/refacciones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cantidad: Number(cantidad),
      ubicacion,
      observacion
    })
  }).then(() => cargarTabla());
}

function eliminar(id) {
  if (!confirm("¿Seguro que deseas borrar esta refacción?")) return;

  fetch(`${API_URL}/refacciones/${id}`, {
    method: "DELETE"
  }).then(() => cargarTabla());
}
