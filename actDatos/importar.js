// let excelActual = null;

// async function subirExcel() {
//   const file = document.getElementById("excelFile").files[0];
//   const estado = document.getElementById("estado");
//   const tabla = document.getElementById("tablaPreview");

//   if (!file) {
//     estado.textContent = "❌ Selecciona un archivo Excel";
//     return;
//   }

//   excelActual = file;

//   const formData = new FormData();
//   formData.append("file", file);

//   estado.textContent = "⏳ Analizando Excel...";

//   try {
//     const res = await fetch(
//       "https://buscador-refaccionesbackend.onrender.com/preview-excel",
//       {
//         method: "POST",
//         body: formData
//       }
//     );

//     const data = await res.json();

//     tabla.innerHTML = "";

//     if (data.nuevos.length === 0) {
//       tabla.innerHTML = `
//         <tr>
//           <td colspan="4">No hay refacciones nuevas</td>
//         </tr>
//       `;
//     } else {
//       data.nuevos.forEach(r => {
//         tabla.innerHTML += `
//           <tr>
//             <td>${r.nombreProd}</td>
//             <td>${r.refInterna}</td>
//             <td>${r.cantidad}</td>
//             <td>${r.ubicacion || ""}</td>
//           </tr>
//         `;
//       });
//     }

//     estado.textContent = `🆕 Nuevos: ${data.nuevos.length} | 🔄 A actualizar: ${data.actualizar.length}`;

//   } catch (err) {
//     estado.textContent = "❌ Error al analizar Excel";
//   }
// }

// async function confirmarImportacion() {
//   if (!excelActual) {
//     alert("Primero carga un Excel");
//     return;
//   }

//   const estado = document.getElementById("estado");
//   const formData = new FormData();
//   formData.append("file", excelActual);

//   estado.textContent = "⏳ Importando datos...";

//   const res = await fetch(
//     "https://buscador-refaccionesbackend.onrender.com/importar-excel",
//     {
//       method: "POST",
//       body: formData
//     }
//   );

//   const data = await res.json();

//   if (data.ok) {
//     estado.textContent = `✅ Importado | Insertados: ${data.insertados} | Actualizados: ${data.actualizados}`;
//   } else {
//     estado.textContent = "❌ Error al importar";
//   }
// }
