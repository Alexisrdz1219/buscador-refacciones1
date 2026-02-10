const API = "https://buscador-refaccionesbackend.onrender.com";

// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".maquina-link").forEach(link => {
//     link.addEventListener("click", async e => {
//       e.preventDefault();

//       const categoriaprin = link.dataset.categoriaprin;
//       const maquinamod = link.dataset.maquinamod;
//       const maquinaesp = link.dataset.maquinaesp;

//       console.log("BUSCANDO:", categoriaprin, maquinamod, maquinaesp);

//       const res = await fetch(
//         `${API}/refacciones-filtradas?` +
//         `categoriaprin=${encodeURIComponent(categoriaprin)}` +
//         `&maquinamod=${encodeURIComponent(maquinamod)}` +
//         `&maquinaesp=${encodeURIComponent(maquinaesp)}`
//       );

//       const data = await res.json();
//       mostrarResultados(data);
//     });
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".maquina-link").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();

      const maquinaId = link.dataset.maquinaid;

      console.log("BUSCANDO POR MAQUINA ID:", maquinaId);

      const res = await fetch(`${API}/refacciones-por-maquina/${maquinaId}`);
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

  cont.innerHTML = ""; // limpia antes, por salud mental

lista.forEach(r => {
  cont.innerHTML += `
    <div class="card ref-card">
      <div class="ref-img">
        <img
  src="${r.imagen || 'no-image.png'}"
  style="width:100%; max-height:200px; object-fit:cover"
/>
      </div>

      <div class="ref-body">
        <h3>${r.nombreprod}</h3>

        <p class="categoria">${r.categoriaprin || 'Sin categoría'}</p>

        <div class="ref-grid">
          <span><b>Modelo:</b> ${r.modelo || '-'}</span>
          <span><b>Tipo:</b> ${r.tipoprod || '-'}</span>
          <span><b>Ref:</b> ${r.refinterna}</span>
          <span><b>Cantidad:</b> ${r.cantidad} ${r.unidad || ''}</span>
          <span><b>Ubicación:</b> ${r.ubicacion || '-'}</span>
        </div>

        ${r.observacion ? `<p class="obs">${r.observacion}</p>` : ''}

        <div class="ref-actions">
          <a href="detalle.html?id=${r.id}" class="btn-ver">Ver / Editar</a>
        </div>
      </div>
    </div>
  `;
});

}
