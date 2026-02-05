const API = "https://buscador-refaccionesbackend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".maquina-link").forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const marca = link.dataset.marca;
      const modelo = link.dataset.modelo;
      const maquina = link.dataset.maquina;

      try {
        const res = await fetch(
  `${API}/refacciones-filtradas?categoriaprin=${encodeURIComponent(marca)}&maquinamod=${encodeURIComponent(modelo)}&maquinaesp=${encodeURIComponent(maquina)}`
);


        const data = await res.json();
        mostrarResultados(data);

      } catch (err) {
        console.error("Error en búsqueda", err);
        alert("Error al cargar refacciones");
      }
    });
  });

});

function mostrarResultados(refacciones) {
  const contenedor = document.getElementById("resultados");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (refacciones.length === 0) {
    contenedor.innerHTML = "<p>No hay refacciones para esta máquina</p>";
    return;
  }

  refacciones.forEach(r => {
    contenedor.innerHTML += `
      <div class="card mb-2 shadow-sm">
        <div class="card-body">
          <strong>${r.nombreprod}</strong><br>
          <small class="text-muted">${r.refinterna || ""}</small><br>
          <span>Cantidad: ${r.cantidad ?? 0}</span>
        </div>
      </div>
    `;
  });
}
