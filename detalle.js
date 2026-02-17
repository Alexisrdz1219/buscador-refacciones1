
const API = "https://buscador-refaccionesbackend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let valoresActuales = {};

/* =========================
   CARGAR DETALLE REFACCIÓN
========================= */
async function cargarDetalle() {
  const res = await fetch(`${API}/refacciones/${id}`);
  const r = await res.json();

  valoresActuales = r;

  Object.keys(r).forEach(key => {
    // ❌ NUNCA tocar input file
    if (key === "imagen") return;

    const el = document.getElementById(key);
    if (el && el.tagName !== "SELECT") {
      el.value = r[key] ?? "";
    }
  });

  // ✅ mostrar imagen si existe
  if (r.imagen) {
    const img = document.getElementById("preview-imagen");
    if (img) {
      img.src = r.imagen;
      img.style.display = "block";
    }
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
   CARGAR CHECKLIST MAQUINAS
========================= */
async function cargarMaquinasCompatibles() {
  const maquinas = await fetch(`${API}/maquinas`).then(r => r.json());
  const resp = await fetch(`${API}/refacciones/${id}/compatibles`)
    .then(r => r.json());

  const idsCompatibles = resp.maquinas || [];

  const cont = document.getElementById("lista-maquinas");
  cont.innerHTML = "";

  maquinas.forEach(m => {
    const checked = idsCompatibles.includes(m.id) ? "checked" : "";
    cont.innerHTML += `
      <label style="display:block">
        <input type="checkbox" value="${m.id}" ${checked}>
        ${m.maquinamod} ${m.maquinaesp}
      </label>
    `;
  });
}

/* =========================
   GUARDAR CAMBIOS
========================= */
document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();

  const fd = new FormData();

  document
    .querySelectorAll("input:not([type=checkbox]):not([type=file]), textarea, select")
    .forEach(el => {
      fd.append(el.id, el.value);
    });

  const fileInput = document.getElementById("imagen");
  if (fileInput && fileInput.files.length > 0) {
    fd.append("imagen", fileInput.files[0]);
  }

  const compatibilidad = [];
  document
    .querySelectorAll('#lista-maquinas input[type="checkbox"]:checked')
    .forEach(cb => compatibilidad.push(cb.value));

  fd.append("compatibilidad", JSON.stringify(compatibilidad));

  const res = await fetch(`${API}/refacciones/${id}`, {
    method: "PUT",
    body: fd
  });

  if (!res.ok) {
    alert("❌ Error al guardar");
    return;
  }

  alert("✅ Refacción actualizada");
  window.location.href = "Nadd.html";
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

  await cargarMaquinasCompatibles();
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

let maquinasDisponibles = [];
let maquinasSeleccionadas = [];

// Simulación (aquí deberías cargar desde tu API)
maquinasDisponibles = [
  {id:1, nombre:"AOKI SBIII-500"},
  {id:2, nombre:"AOKI SBIII-250"},
  {id:3, nombre:"NISSEI FNX-300"},
  {id:4, nombre:"NISSEI FNX-100"}
];

const listaModal = document.getElementById("lista-maquinas-modal");

function renderModal(lista) {
  listaModal.innerHTML = "";

  lista.forEach(m => {
    listaModal.innerHTML += `
      <div class="col-md-6">
        <div class="machine-item">
          <input type="checkbox"
                 value="${m.id}"
                 ${maquinasSeleccionadas.includes(m.id) ? "checked" : ""}>
          ${m.nombre}
        </div>
      </div>
    `;
  });
}

renderModal(maquinasDisponibles);

// Buscador
document.getElementById("buscarMaquina").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();
  const filtradas = maquinasDisponibles.filter(m =>
    m.nombre.toLowerCase().includes(texto)
  );
  renderModal(filtradas);
});

// Confirmar selección
document.getElementById("confirmarMaquinas").addEventListener("click", () => {
  const checks = listaModal.querySelectorAll("input:checked");
  maquinasSeleccionadas = Array.from(checks).map(c => Number(c.value));

  renderChips();
  bootstrap.Modal.getInstance(
    document.getElementById("modalMaquinas")
  ).hide();
});

function renderChips(){
  const cont = document.getElementById("lista-maquinas");
  cont.innerHTML = "";

  maquinasSeleccionadas.forEach(id=>{
    const maquina = maquinasDisponibles.find(m=>m.id===id);
    cont.innerHTML += `
      <span class="compat-chip">
        ${maquina.nombre}
        <button onclick="quitarMaquina(${id})">
          <i class="bi bi-x"></i>
        </button>
      </span>
    `;
  });
}

function quitarMaquina(id){
  maquinasSeleccionadas = maquinasSeleccionadas.filter(m=>m!==id);
  renderChips();
}
