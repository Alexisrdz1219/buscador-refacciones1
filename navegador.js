const API = "https://buscador-refaccionesbackend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".maquina-link").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();

      const categoriaprin = link.dataset.categoriaprin;
      const maquinamod = link.dataset.maquinamod;
      const maquinaesp = link.dataset.maquinaesp;

      console.log("BUSCANDO:", categoriaprin, maquinamod, maquinaesp);

      const res = await fetch(
        `${API}/refacciones-filtradas?` +
        `categoriaprin=${encodeURIComponent(categoriaprin)}` +
        `&maquinamod=${encodeURIComponent(maquinamod)}` +
        `&maquinaesp=${encodeURIComponent(maquinaesp)}`
      );

      const data = await res.json();
      mostrarResultados(data);
    });
  });
});

function mostrarResultados(lista) {
  const cont = document.getElementById("resultados");
  if (!cont) {
    console.error("❌ No existe #resultados");
    return;
  }

  cont.innerHTML = "";

  if (lista.length === 0) {
    cont.innerHTML = "<p>No hay refacciones</p>";
    return;
  }

  lista.forEach(r => {
    cont.innerHTML += `
      <div class="card mb-2">
        <div class="card-body">
          <strong>${r.nombreprod}</strong><br>
          Ref: ${r.refinterna}<br>
          Cantidad: ${r.cantidad}
        </div>
      </div>
    `;
  });
}
