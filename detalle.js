const API = "https://buscador-refaccionesbackend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let valoresActuales = {};
let maquinasCompatibles = [];

/* =========================
   CARGAR DETALLE REFACCIÓN
========================= */
async function cargarDetalle() {
  const res = await fetch(`${API}/refacciones/${id}`);
  const r = await res.json();

  valoresActuales = r;

  Object.keys(r).forEach(key => {
    const el = document.getElementById(key);
    if (el && el.tagName !== "SELECT") {
      el.value = r[key] ?? "";
    }
  });
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
// document.getElementById("form").addEventListener("submit", async e => {
//   e.preventDefault();

//   const data = {};

//   document
//     .querySelectorAll("input:not([type=checkbox]), textarea, select")
//     .forEach(el => {
//       data[el.id] = el.value;
//     });

//   const compatibilidad = [];
//   document
//     .querySelectorAll('#lista-maquinas input[type="checkbox"]:checked')
//     .forEach(cb => compatibilidad.push(cb.value));

//   data.compatibilidad = compatibilidad;

//   const res = await fetch(`${API}/refacciones/${id}`, {
//   method: "PUT",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(data)
// });

// if (!res.ok) {
//   const text = await res.text();
//   console.error("Error backend:", text);
//   alert("❌ Error al guardar");
//   return;
// }




//   alert("✅ Refacción actualizada correctamente");
//   window.location.href = "refacciones.html";
// });

document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();

  const fd = new FormData();

  document
    .querySelectorAll("input:not([type=checkbox]):not([type=file]), textarea, select")
    .forEach(el => {
      fd.append(el.id, el.value);
    });

  const file = document.getElementById("imagen").files[0];
  if (file) fd.append("imagen", file);

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
  window.location.href = "refacciones.html";
});

/* =========================
   EJECUCIÓN ORDENADA
========================= */
(async () => {
  await cargarDetalle();

  await cargarOpciones("/opciones/categorias", "categoriaprin");
  await cargarOpciones("/opciones/maquinamod", "maquinamod");
  await cargarOpciones("/opciones/maquinaesp", "maquinaesp");

  await cargarMaquinasCompatibles();
})();
