const API = "https://buscador-refaccionesbackend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const form = document.getElementById("form");

const inputImagen = document.getElementById("imagen");
const inputImagenUrl = document.getElementById("imagenUrl");
const preview = document.getElementById("previewImagen");
const btnQuitar = document.getElementById("btnQuitarImagen");
const btnEliminarImagen = document.getElementById("btnEliminarImagen");

let imagenEliminada = false;
let valoresActuales = {};
let maquinasDisponibles = [];
let maquinasSeleccionadas = [];

/* =========================
   CARGAR DETALLE REFACCIÓN
========================= */
async function cargarDetalle() {
  const res = await fetch(`${API}/refacciones/${id}`);
  const r = await res.json();

  valoresActuales = r;

 Object.keys(r).forEach(key => {
  if (key === "imagen") return;

  const el = document.getElementById(key);
  if (!el) return;

  // 🔥 CHECKBOX
  if (el.type === "checkbox") {
    el.checked = !!r[key];
  } 
  // 🔥 INPUT NORMAL
  else if (el.tagName !== "SELECT") {
    el.value = r[key] ?? "";
  }
});

const stockMinimoInput = document.getElementById("stockMinimo");

if (stockMinimoInput) {
  stockMinimoInput.value = r.stock_minimo ?? 0;
}
  // ✅ mostrar imagen si existe
  if (r.imagen) {
    // const img = document.getElementById("preview-imagen");
    if (r.imagen) {
  preview.src = r.imagen;
  preview.style.display = "block";
  btnQuitar.style.display = "block";
}
  }

  // 🔥 cargar tags en el input
if (r.tags) {
  document.getElementById("inputTags").value = r.tags.join(", ");
}

const alertaActiva = document.getElementById("alertaActiva");
const contenedor = document.getElementById("contenedorStockMinimo");

if (alertaActiva && contenedor) {
  contenedor.style.display = alertaActiva.checked ? "block" : "none";

  alertaActiva.addEventListener("change", () => {
    contenedor.style.display = alertaActiva.checked ? "block" : "none";
  });
}
// const alertaActiva = document.getElementById("alertaActiva");
// const stockMinimo = document.getElementById("stockMinimo");

// if (alertaActiva) {
//   alertaActiva.checked = !!r.alerta_activa;
// }

// if (stockMinimo) {
//   stockMinimo.value = r.stock_minimo ?? 0;
// }

// // 🔥 mostrar/ocultar dinámicamente
// alertaActiva.addEventListener("change", () => {
//   stockMinimo.style.display = alertaActiva.checked ? "block" : "none";
// });
// =====================
// 🔥 FORZAR VALORES CORRECTOS
// =====================
const alertaActiva = document.getElementById("alertaActiva");
const stockMinimoInput = document.getElementById("stockMinimo");
const contenedor = document.getElementById("contenedorStockMinimo");

if (alertaActiva) {
  alertaActiva.checked = !!r.alerta_activa;
}

if (stockMinimoInput) {
  stockMinimoInput.value = r.stock_minimo ?? 0;
}

// 🔥 Mostrar/ocultar correctamente
if (alertaActiva && contenedor) {
  contenedor.style.display = alertaActiva.checked ? "block" : "none";

  alertaActiva.addEventListener("change", () => {
    contenedor.style.display = alertaActiva.checked ? "block" : "none";
  });
}
}

/* =========================
   CARGAR OPCIONES SELECT
========================= */
async function cargarOpciones(endpoint, selectId) {
  const res = await fetch(`${API}${endpoint}`);
  const data = await res.json();

  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">-- Selecciona --</option>`;

  data.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.valor;
    opt.textContent = item.valor;
    select.appendChild(opt);
  });

  if (valoresActuales[selectId]) {
    select.value = valoresActuales[selectId];
  }
}

/* =========================
   GUARDAR CAMBIOS
========================= */
document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();

  const fd = new FormData();


//   document
//   .querySelectorAll("input:not([type=checkbox]):not([type=file]), textarea, select")
//   .forEach(el => {
//     if (el.id === "buscarMaquina") return;
//     if (el.id === "inputTags") return; // 🔥 IMPORTANTE

//     fd.append(el.id, el.value);
// });
const camposValidos = [
  "nombreprod",
  "refinterna",
  "categoriaprin",
  "maquinamod",
  "maquinaesp",
  "nummaquina",
  "tipoprod",
  "modelo",
  "palclave",
  "cantidad",
  "unidad",
  "ubicacion",
  "observacion"
];

camposValidos.forEach(idCampo => {
  const el = document.getElementById(idCampo);
  if (el) {
    fd.append(idCampo, el.value);
  }
});

// =====================
// 🔥 ALERTA DE STOCK
// =====================
const alertaActivaEl = document.getElementById("alertaActiva");
const stockMinimoEl = document.getElementById("stockMinimo");

fd.append("alerta_activa", alertaActivaEl.checked ? "true" : "false");
fd.append("stock_minimo", stockMinimoEl.value || "0");

  const fileInput = document.getElementById("imagen");
  if (fileInput && fileInput.files.length > 0) {
    fd.append("imagen", fileInput.files[0]);
  }

  const imagenUrlInput = document.getElementById("imagenUrl");

if (imagenUrlInput && imagenUrlInput.value.trim() !== "") {
  fd.append("imagenUrl", imagenUrlInput.value.trim());
}

  
fd.append(
  "compatibilidad",
  JSON.stringify(maquinasSeleccionadas)
);
// console.log("Compatibilidad a guardar:", maquinasSeleccionadas);

  const res = await fetch(`${API}/refacciones/${id}`, {
    method: "PUT",
    body: fd
  });

  if (!res.ok) {
  alert("❌ Error al guardar");
  return;
}

// =====================
// 🔥 GUARDAR TAGS
// =====================
const tags = document
  .getElementById("inputTags")
  .value.split(",")
  .map(t => t.trim())
  .filter(Boolean);

await fetch(`${API}/refacciones/${id}/tags`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ tags })
});

// =====================
// FINAL
// =====================
alert("✅ Refacción actualizada");
window.location.href = "../Refacciones Ubicacion/ConUbi.html";

  // if (imagenEliminada) {
  //   formData.append("eliminarImagen", "true");
  // }

  // await fetch(`${API}/refacciones/${id}`, {
  //   method: "PUT",
  //   body: formData
  // });

  // alert("Guardado correctamente");
});

/* =========================
   EJECUCIÓN ORDENADA
========================= */
(async () => {
  await cargarDetalle();

  await cargarOpciones("/opciones/categorias", "categoriaprin");
  await cargarOpciones("/opciones/maquinamod", "maquinamod");
  await cargarOpciones("/opciones/maquinaesp", "maquinaesp");
await cargarOpciones("/opciones/nummaquina", "nummaquina");


  // await cargarMaquinasCompatibles();
  await inicializarMaquinas();

})();

function renderCompatibles(maquinas) {
  const cont = document.getElementById("lista-maquinas");
  cont.innerHTML = "";

  maquinas.forEach(m => {
    cont.innerHTML += `
      <div class="compat-chip">
        ${m.nombre}
        <button onclick="quitarMaquina(${m.id})">
          <i class="bi bi-x"></i>
        </button>
      </div>
    `;
  });
}
const box = document.getElementById("boxStock");
const alertaActiva = document.getElementById("alertaActiva");

if (alertaActiva && box) {
  alertaActiva.addEventListener("change", () => {
    if (alertaActiva.checked) {
      box.classList.add("activo");
    } else {
      box.classList.remove("activo");
    }
  });
}



/* =========================
   CARGAR MAQUINAS EN MODAL
========================= */
async function inicializarMaquinas() {
  // Traer todas las máquinas
  maquinasDisponibles = await fetch(`${API}/maquinas`)
    .then(r => r.json());

  // Traer compatibles actuales
  const resp = await fetch(`${API}/refacciones/${id}/compatibles`)
    .then(r => r.json());

  maquinasSeleccionadas = (resp.maquinas || []).map(id => Number(id));


  renderModal(maquinasDisponibles);
  renderChips();
}


function renderModal(lista) {
  // console.log(lista);

  const listaModal = document.getElementById("lista-maquinas-modal");
  if (!listaModal) return;

  listaModal.innerHTML = "";

  const grupos = {};

  // Agrupar por categoría
  lista.forEach(m => {
    const categoria = m.categoriaprin || "OTROS";

    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }

    grupos[categoria].push(m);
  });

  // Crear accordion principal
  const accordion = document.createElement("div");
  accordion.className = "accordion";
  accordion.id = "accordionMaquinas";

  let index = 0;

  Object.keys(grupos).forEach(categoria => {
    const collapseId = `collapse-${index}`;
    const headingId = `heading-${index}`;

    const maquinasHTML = grupos[categoria].map(m => {
      const checked = maquinasSeleccionadas.includes(Number(m.id)) ? "checked" : "";

      return `
        <div class="col-md-6 mb-2">
          <div class="machine-item">
            <input type="checkbox"
                  value="${m.id}"
                  data-categoria="${m.categoriaprin}"
                  ${checked}>
            ${m.maquinamod || ""} ${m.maquinaesp || ""}
          </div>
        </div>
      `;
    }).join("");

    const item = document.createElement("div");
    item.className = "accordion-item";

    item.innerHTML = `
      <h2 class="accordion-header" id="${headingId}">
        <button class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#${collapseId}">
          ${categoria.toUpperCase()} (${grupos[categoria].length})
        </button>
      </h2>
      <div id="${collapseId}"
           class="accordion-collapse collapse"
           data-bs-parent="#accordionMaquinas">
        <div class="accordion-body">
          <div class="row">
            ${maquinasHTML}
          </div>
        </div>
      </div>
    `;

    accordion.appendChild(item);
    index++;
  });

  listaModal.appendChild(accordion);
}
/* =========================
   BUSCADOR MODAL
========================= */
document.addEventListener("input", e => {
  if (e.target.id === "buscarMaquina") {
    const texto = e.target.value.toLowerCase();

    const filtradas = maquinasDisponibles.filter(m =>
      `${m.maquinamod} ${m.maquinaesp}`
        .toLowerCase()
        .includes(texto)
    );

    renderModal(filtradas);
  }
});

/* =========================
   CONFIRMAR SELECCIÓN
========================= */
document.addEventListener("click", e => {
  if (e.target.id === "confirmarMaquinas") {
    const checks = document.querySelectorAll(
      "#lista-maquinas-modal input:checked"
    );

    maquinasSeleccionadas = Array.from(checks)
      .map(c => Number(c.value));

    renderChips();

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalMaquinas")
    );
    modal.hide();
  }
});

/* =========================
   RENDER CHIPS
========================= */
function renderChips() {
  const cont = document.getElementById("lista-maquinas");
  if (!cont) return;

  cont.innerHTML = "";

  maquinasSeleccionadas.forEach(id => {
    const maquina = maquinasDisponibles.find(m => m.id === id);
    if (!maquina) return;

    cont.innerHTML += `
      <span class="compat-chip">
        ${maquina.maquinamod} ${maquina.maquinaesp}
        <button onclick="quitarMaquina(${id})">
          <i class="bi bi-x"></i>
        </button>
      </span>
    `;
  });
}

function quitarMaquina(id) {
  maquinasSeleccionadas =
    maquinasSeleccionadas.filter(m => m !== id);

  renderChips();
}

btnEliminarImagen.addEventListener("click", async () => {
  if (!confirm("¿Eliminar imagen guardada?")) return;

  await fetch(`${API}/refacciones/${id}/imagen`, {
    method: "DELETE"
  });

  preview.src = "";
  preview.style.display = "none";
});

inputImagen.addEventListener("change", () => {
  const file = inputImagen.files[0];

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    btnQuitar.style.display = "block";
    imagenEliminada = false;
  }
});

btnQuitar.addEventListener("click", () => {
  preview.src = "";
  preview.style.display = "none";
  btnQuitar.style.display = "none";

  inputImagen.value = "";
});