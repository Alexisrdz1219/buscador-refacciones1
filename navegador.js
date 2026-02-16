const API = "https://buscador-refaccionesbackend.onrender.com";
let modeloSeleccionado = "";


// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".maquina-link").forEach(link => {
//     link.addEventListener("click", async e => {
//       e.preventDefault();

//       const maquinamod = link.dataset.maquinamod;

//       console.log("BUSCANDO POR MODELO:", maquinamod);

//       const res = await fetch(
//         `${API}/refacciones-por-maquinamod?maquinamod=${encodeURIComponent(maquinamod)}`
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

      const maquinamod = link.dataset.maquinamod;
      modeloSeleccionado = maquinamod; // 🔥 guardamos el modelo

      console.log("BUSCANDO POR MODELO:", maquinamod);

      const res = await fetch(
        `${API}/refacciones-por-maquinamod?maquinamod=${encodeURIComponent(maquinamod)}`
      );

      const data = await res.json();

      actualizarTitulo(); // 🔥 actualizamos título
      mostrarResultados(data);
    });
  });
});

// function actualizarTitulo() {
//   const titulo = document.getElementById("tituloRefacciones");

//   if (!titulo) return;

//   if (modeloSeleccionado) {
//     titulo.textContent = `Refacciones IEMCO - ${modeloSeleccionado}`;
//   } else {
//     titulo.textContent = "Refacciones IEMCO";
//   }
// }

function actualizarTitulo() {
  const titulo = document.getElementById("tituloRefacciones");
  if (!titulo) return;

  titulo.textContent = `Refacciones IEMCO - ${modeloSeleccionado}`;

  // Limpia clases anteriores
  titulo.classList.remove(
    "titulo-default",
    "titulo-aoki",
    "titulo-asb",
    "titulo-nissei"
  );

  // Detecta palabra y asigna color
  if (modeloSeleccionado.toLowerCase().includes("aoki")) {
    titulo.classList.add("titulo-aoki");
  } else if (modeloSeleccionado.toLowerCase().includes("asb")) {
    titulo.classList.add("titulo-asb");
  } else if (modeloSeleccionado.toLowerCase().includes("nissei")) {
    titulo.classList.add("titulo-nissei");
  } else {
    titulo.classList.add("titulo-default");
  }
}


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
    <div class="ref-card">
      <div class="ref-img">
        <img src="${r.imagen || 'no-image.png'}" alt="${r.nombreprod}">
      </div>

      <div class="ref-body">
        <h3 class="ref-title">${r.nombreprod}</h3>

        <p class="categoria">${r.categoriaprin || 'Sin categoría'}</p>

        <div class="ref-grid">
          <span><b>Modelo:</b> ${r.modelo || '-'}</span>
          <span><b>Tipo:</b> ${r.tipoprod || '-'}</span>
          <span><b>Ref:</b> ${r.refinterna}</span>
          <span><b>Cantidad:</b> ${r.cantidad} ${r.unidad || ''}</span>
          <span><b>Ubicación:</b> ${r.ubicacion || '-'}</span>
        </div>

        

        <div class="ref-actions">
          <a href="detalle.html?id=${r.id}" class="btn-ver">Ver / Editar</a>
        </div>
      </div>
    </div>
  `;
});


}
