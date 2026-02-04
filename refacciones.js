const tbody = document.getElementById("tablaBody");

fetch("https://buscador-refaccionesbackend.onrender.com/refacciones")
  .then(res => res.json())
  .then(data => {

    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="15" class="empty">
            No hay refacciones registradas
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>${r.id}</td>
          <td>${r.nombreprod || ""}</td>
          <td>${r.categoriaprin || ""}</td>
          <td>${r.maquinamod || ""}</td>
          <td>${r.maquinaesp || ""}</td>
          <td>${r.tipoprod || ""}</td>
          <td>${r.modelo || ""}</td>
          <td>${r.refinterna || ""}</td>
          <td>${r.palclave || ""}</td>
          <td>${r.cantidad}</td>
          <td>${r.unidad || ""}</td>
          <td>${r.ubicacion || ""}</td>
          <td>${r.observacion || ""}</td>
          <td>${r.imagen || ""}</td>
          <td>${new Date(r.created_at).toLocaleString()}</td>
        </tr>
      `;
    });

  })
  .catch(() => {
    tbody.innerHTML = `
      <tr>
        <td colspan="15" class="empty">
          Error al conectar con el servidor
        </td>
      </tr>
    `;
  });
