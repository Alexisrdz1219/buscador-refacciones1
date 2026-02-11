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

document.querySelectorAll(".opcion-maquina").forEach(btn => {
  btn.addEventListener("click", () => {

    const maquina = btn.dataset.maquina; // ejemplo: data-maquina="Inyectora 5"

    localStorage.setItem("maquinaSeleccionada", maquina);

    location.reload(); // opcional si necesitas refrescar
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
  <div class="card-refa">
    
    <div class="img-wrap">
      <img src="${r.imagen || 'no-image.png'}" alt="${r.nombreprod}">
      <span class="badge-ubi">${r.ubicacion || 'Sin ubicación'}</span>
    </div>

    <div class="info-refa">
      <h3>${r.nombreprod}</h3>

      <div class="datos">
        <span>Ref: ${r.refinterna}</span>
        <span>${r.cantidad} ${r.unidad || ''}</span>
      </div>

    </div>

  </div>
`;
});


}
