const API = "https://buscador-refaccionesbackend.onrender.com";
let modeloSeleccionado = "";
let resultadosActuales = [];



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

document.getElementById("buscarRef")?.addEventListener("input", aplicarFiltros);
  document.getElementById("buscarModelo")?.addEventListener("input", aplicarFiltros);
  document.getElementById("filtroTipo")?.addEventListener("change", aplicarFiltros);
  document.getElementById("filtroUnidad")?.addEventListener("change", aplicarFiltros);

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
      resultadosActuales = data; // 🔥 guardamos lo que vino del backend
 // 🔥 guardamos los datos
llenarSelects(data);       // 🔥 llenamos tipos y unidades dinámicamente


      actualizarTitulo(); // 🔥 actualizamos título
      mostrarResultados(data); // 🔥 mostramos resultados
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
    "titulo-nissei",
    "titulo-sumitomo",
    "titulo-enlainadora",
    "titulo-xhs-50kgs",
    "titulo-pagani",
    "titulo-rapid"
  );

  // Detecta palabra y asigna color
  if (modeloSeleccionado.toLowerCase().includes("aoki")) {
    titulo.classList.add("titulo-aoki");
  } else if (modeloSeleccionado.toLowerCase().includes("asb")) {
    titulo.classList.add("titulo-asb");
    } else if (modeloSeleccionado.toLowerCase().includes("nissei")) {
      titulo.classList.add("titulo-nissei");
    } else if (modeloSeleccionado.toLowerCase().includes("sumitomo")) {
      titulo.classList.add("titulo-sumitomo");
    } else if (modeloSeleccionado.toLowerCase().includes("enlainadora")) {
      titulo.classList.add("titulo-enlainadora");
    } else if (modeloSeleccionado.toLowerCase().includes("XHS-50KGS")) {
      titulo.classList.add("titulo-xhs-50kgs");
    } else if (modeloSeleccionado.toLowerCase().includes("molino")) {
      titulo.classList.add("titulo-molino");
    } else if (modeloSeleccionado.toLowerCase().includes("pagani")) {
      titulo.classList.add("titulo-pagani");
    } else if (modeloSeleccionado.toLowerCase().includes("rapid")) {
      titulo.classList.add("titulo-rapid");
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

// function aplicarFiltros() {

//   if (!resultadosActuales.length) return;

//   const refInput = document.getElementById("buscarRef");
//   const modeloInput = document.getElementById("buscarModelo");
//   const tipoSelect = document.getElementById("filtroTipo");
//   const unidadSelect = document.getElementById("filtroUnidad");

//   const ref = refInput ? refInput.value.toLowerCase().trim() : "";
//   const modelo = modeloInput ? modeloInput.value.toLowerCase().trim() : "";
//   const tipo = tipoSelect ? tipoSelect.value : "";
//   const unidad = unidadSelect ? unidadSelect.value : "";

//   const palabrasInput = document.getElementById("buscarPalabras");
// const palabrasTexto = palabrasInput ? palabrasInput.value.toLowerCase().trim() : "";

// // separar por espacios y eliminar vacíos
// const palabras = palabrasTexto
//   ? palabrasTexto.split(" ").filter(p => p.length > 0)
//   : [];


//   const filtrados = resultadosActuales.filter(r => {

//     const coincideRef =
//       !ref || String(r.refinterna || "").toLowerCase().includes(ref);

//     const coincideModelo =
//       !modelo || String(r.modelo || "").toLowerCase().includes(modelo);

//     const coincideTipo =
//       !tipo || r.tipoprod === tipo;

//     const coincideUnidad =
//       !unidad || r.unidad === unidad;

//       const coincidePalabras =
//   palabras.length === 0 ||
//   palabras.every(p =>
//     String(r.palClave || "").toLowerCase().includes(p)
//   );


//     return coincideRef && coincideModelo && coincideTipo && coincideUnidad && coincidePalabras;
//   });

//   mostrarResultados(filtrados);
// }
function aplicarFiltros() {

  if (!resultadosActuales.length) return;

  const ref = document.getElementById("buscarRef")?.value.toLowerCase().trim() || "";
  const modelo = document.getElementById("buscarModelo")?.value.toLowerCase().trim() || "";
  const tipo = document.getElementById("filtroTipo")?.value || "";
  const unidad = document.getElementById("filtroUnidad")?.value || "";

  const palabrasTexto = document.getElementById("buscarPalabras")?.value.toLowerCase().trim() || "";

  const palabras = palabrasTexto
    ? palabrasTexto.split(" ").filter(p => p.length > 0)
    : [];

  const filtrados = resultadosActuales.filter(r => {

    const coincideRef =
      !ref || String(r.refinterna || "").toLowerCase().includes(ref);

    const coincideModelo =
      !modelo || String(r.modelo || "").toLowerCase().includes(modelo);

    const coincideTipo =
      !tipo || r.tipoprod === tipo;

    const coincideUnidad =
      !unidad || r.unidad === unidad;

    const coincidePalabras =
      palabras.length === 0 ||
      palabras.every(p =>
        String(r.palClave || "").toLowerCase().includes(p)
      );

    return coincideRef &&
           coincideModelo &&
           coincideTipo &&
           coincideUnidad &&
           coincidePalabras;
  });

  mostrarResultados(filtrados);
}



function llenarSelects(data) {
  const selectTipo = document.getElementById("filtroTipo");
  const selectUnidad = document.getElementById("filtroUnidad");

  // limpiar excepto la primera opción
  selectTipo.innerHTML = `<option value="">Todos los tipos</option>`;
  selectUnidad.innerHTML = `<option value="">Todas las unidades</option>`;

  const tiposUnicos = [...new Set(data.map(r => r.tipoprod).filter(Boolean))];
  const unidadesUnicas = [...new Set(data.map(r => r.unidad).filter(Boolean))];

  tiposUnicos.forEach(tipo => {
    selectTipo.innerHTML += `<option value="${tipo}">${tipo}</option>`;
  });

  unidadesUnicas.forEach(unidad => {
    selectUnidad.innerHTML += `<option value="${unidad}">${unidad}</option>`;
  });
}
