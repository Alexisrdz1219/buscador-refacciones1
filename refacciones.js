const tbody = document.getElementById("tablaBody");

fetch("https://buscador-refaccionesbackend.onrender.com/refacciones")
  .then(res => res.json())
  .then(data => {

    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="empty">
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
          <td>${r.nombreprod}</td>
          <td>${r.cantidad}</td>
          <td>${r.ubicacion}</td>
        </tr>
      `;
    });

  })
  .catch(() => {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty">
          Error al conectar con el servidor
        </td>
      </tr>
    `;
  });
