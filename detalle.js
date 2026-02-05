const API = "https://buscador-refaccionesbackend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
let valoresActuales = {};

/* ---------- CARGAR DETALLE ---------- */
async function cargarDetalle() {
  const res = await fetch(`${API}/refacciones/${id}`);
  const r = await res.json();

  valoresActuales = r; // 🔑 guardamos valores

  Object.keys(r).forEach(key => {
    const el = document.getElementById(key);
    if (el && el.tagName !== "SELECT") {
      el.value = r[key] ?? "";
    }
  });
}

// 👉 marcar compatibilidad
if (Array.isArray(r.compatibilidad)) {
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach(cb => {
      if (r.compatibilidad.includes(cb.value)) {
        cb.checked = true;
      }
    });
}


/* ---------- CARGAR OPCIONES ---------- */
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

  // 🔥 aplicar valor guardado
  if (valoresActuales[selectId]) {
    select.value = valoresActuales[selectId];
  }
}

/* ---------- GUARDAR ---------- */
document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {};
  document.querySelectorAll("input, textarea, select").forEach(el => {
    data[el.id] = el.value;
  });

  // 👉 recoger compatibilidad
const compatibilidad = [];

document
  .querySelectorAll('input[type="checkbox"]:checked')
  .forEach(cb => compatibilidad.push(cb.value));

data.compatibilidad = compatibilidad;


  await fetch(`${API}/refacciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("✅ Refacción actualizada");
  window.location.href = "refacciones.html";
});

/* ---------- EJECUCIÓN CORRECTA ---------- */
(async () => {
  await cargarDetalle();

  await cargarOpciones("/opciones/categorias", "categoriaprin");
  await cargarOpciones("/opciones/maquinamod", "maquinamod");
  await cargarOpciones("/opciones/maquinaesp", "maquinaesp");
})();

async function cargarMaquinasCompatibles(refaccionId) {
  const maquinas = await fetch(`${API}/maquinas`).then(r => r.json());
  const compatibles = await fetch(`${API}/refacciones/${refaccionId}/compatibles`)
    .then(r => r.json());

  const idsCompatibles = compatibles.map(m => m.id);
  const cont = document.getElementById("lista-maquinas");
  cont.innerHTML = "";

  maquinas.forEach(m => {
    const checked = idsCompatibles.includes(m.id) ? "checked" : "";
    cont.innerHTML += `
      <label>
        <input type="checkbox" value="${m.id}" ${checked}>
        ${m.maquinamod} ${m.maquinaesp} - ${m.nombre}
      </label><br>
    `;
  });
}
