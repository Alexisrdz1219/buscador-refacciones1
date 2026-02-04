const API_URL = "https://buscador-refaccionesbackend.onrender.com";

async function subirOdoo() {
  const file = document.getElementById("excelFile").files[0];
  const estado = document.getElementById("estado");

  if (!file) {
    estado.textContent = "❌ Selecciona un Excel";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  estado.textContent = "⏳ Procesando archivo Odoo...";

  const res = await fetch(`${API_URL}/importar-excel-odoo`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (!data.ok) {
    estado.textContent = "❌ Error al importar";
    return;
  }

  estado.textContent =
    `✅ Insertados: ${data.insertados} | Actualizados: ${data.actualizados}`;

  if (data.nuevos.length > 0) {
    document.getElementById("tablaNuevos").style.display = "table";
    const tbody = document.getElementById("tbodyNuevos");
    tbody.innerHTML = "";

    data.nuevos.forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>${r.refInterna}</td>
          <td>${r.nombreProd}</td>
          <td>${r.cantidad}</td>
          <td>${r.unidad}</td>
          <td>${r.palClave || ""}</td>
        </tr>
      `;
    });
  }
}
