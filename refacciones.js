// const API = "https://buscador-refaccionesbackend.onrender.com";

// let paginaActual = 1;
// const LIMITE = 50;

// async function cargarTabla() {
//   const tbody = document.getElementById("tablaBody");

//   tbody.innerHTML = `
//     <tr>
//       <td colspan="16" class="empty">Cargando...</td>
//     </tr>
//   `;

//   try {
//     const res = await fetch(
//       `${API}/refacciones-paginadas?page=${paginaActual}&limit=${LIMITE}`
//     );

//     if (!res.ok) throw new Error("API caída");

//     const data = await res.json();
//     tbody.innerHTML = "";

//     if (data.rows.length === 0) {
//       tbody.innerHTML = `
//         <tr>
//           <td colspan="16" class="empty">Sin datos</td>
//         </tr>
//       `;
//       return;
//     }

//     data.rows.forEach(r => {
//       const tr = document.createElement("tr");

//       tr.innerHTML = `
//         <td>${r.id}</td>
//         <td>${r.nombreprod || ""}</td>
//         <td>${r.categoriaprin || ""}</td>
//         <td>${r.maquinamod || ""}</td>
//         <td>${r.maquinaesp || ""}</td>
//         <td>${r.tipoprod || ""}</td>
//         <td>${r.modelo || ""}</td>
//         <td>${r.refinterna}</td>
//         <td>${r.palclave || ""}</td>
//         <td>${r.cantidad}</td>
//         <td>${r.unidad || ""}</td>
//         <td>${r.ubicacion || ""}</td>
//         <td>${r.observacion || ""}</td>
//         <td>${r.imagen || ""}</td>
//         <td>${r.fecha || ""}</td>
//         <td>
//           <button onclick="editar(
//             ${r.id},
//             ${r.cantidad},
//             '${r.ubicacion || ""}',
//             '${r.observacion || ""}'
//           )">✏️</button>
//           <button onclick="eliminar(${r.id})">🗑️</button>
//         </td>
//       `;

//       tbody.appendChild(tr);
//     });

//     document.getElementById("pagina").textContent =
//       `Página ${paginaActual} / ${Math.ceil(data.total / LIMITE)}`;

//   } catch (err) {
//     tbody.innerHTML = `
//       <tr>
//         <td colspan="16" class="empty">
//           ❌ Error al cargar datos
//         </td>
//       </tr>
//     `;
//   }
// }

// function next() {
//   paginaActual++;
//   cargarTabla();
// }

// function prev() {
//   if (paginaActual > 1) {
//     paginaActual--;
//     cargarTabla();
//   }
// }

// // --------------------
// // EDITAR
// // --------------------
// function editar(id, cantidadActual, ubicacionActual, observacionActual) {
//   const cantidad = prompt("Cantidad:", cantidadActual);
//   if (cantidad === null) return;

//   const ubicacion = prompt("Ubicación:", ubicacionActual);
//   const observacion = prompt("Observación:", observacionActual);

//   fetch(`${API}/refacciones/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       cantidad: Number(cantidad),
//       ubicacion,
//       observacion
//     })
//   }).then(() => cargarTabla());
// }

// // --------------------
// // ELIMINAR
// // --------------------
// function eliminar(id) {
//   if (!confirm("¿Seguro que deseas eliminar esta refacción?")) return;

//   fetch(`${API}/refacciones/${id}`, {
//     method: "DELETE"
//   }).then(() => cargarTabla());
// }

// cargarTabla();
const API = "https://buscador-refaccionesbackend.onrender.com";
let paginaActual = 1;
const LIMITE = 24;

async function cargarTabla() {
  const contenedor = document.getElementById("cardsContainer");
  contenedor.innerHTML = `<p class="empty">Cargando...</p>`;

  const res = await fetch(
    `${API}/refacciones-paginadas?page=${paginaActual}&limit=${LIMITE}`
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
      <img src="${r.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}">

      <div class="card-body">
        <h4>${r.nombreprod || "Sin nombre"}</h4>
        <div class="ref">Ref: ${r.refinterna}</div>

        <div class="stock ${stockClass}">
          Stock: ${r.cantidad} ${r.unidad || ""}
        </div>

        <div class="card-actions">
          <button onclick="editar(${r.id}, ${r.cantidad}, '${r.ubicacion || ""}', '${r.observacion || ""}')">✏️</button>
          <button onclick="eliminar(${r.id})">🗑️</button>
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
