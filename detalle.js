const API = "https://buscador-refaccionesbackend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
let valoresActuales = {};


async function cargarDetalle() {
  const res = await fetch(`${API}/refacciones/${id}`);
  const r = await res.json();

  valoresActuales = r;

cargarOpciones("/opciones/categorias", "categoriaprin", "valor");
cargarOpciones("/opciones/maquinamod", "maquinamod", "valor");
cargarOpciones("/opciones/maquinaesp", "maquinaesp", "valor");


  Object.keys(r).forEach(key => {
    const el = document.getElementById(key);
    if (el && el.tagName !== "SELECT") {
      el.value = r[key] ?? "";
    }
  });
}

document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {};
  document.querySelectorAll("input, textarea").forEach(el => {
    data[el.id] = el.value;
  });

  await fetch(`${API}/refacciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("✅ Refacción actualizada");
  window.location.href = "refacciones.html";
});

cargarDetalle();


async function cargarOpciones(endpoint, selectId) {
  const res = await fetch(`${API}${endpoint}`);
  const data = await res.json();

  const select = document.getElementById(selectId);
  select.innerHTML = "";

  // opción actual arriba
  if (valoresActuales[selectId]) {
    const actual = document.createElement("option");
    actual.value = valoresActuales[selectId];
    actual.textContent = valoresActuales[selectId];
    actual.selected = true;
    select.appendChild(actual);
  }

  // separador visual
  const sep = document.createElement("option");
  sep.disabled = true;
  sep.textContent = "────────────";
  select.appendChild(sep);

  // demás opciones
  data.forEach(item => {
    if (item.valor !== valoresActuales[selectId]) {
      const opt = document.createElement("option");
      opt.value = item.valor;
      opt.textContent = item.valor;
      select.appendChild(opt);
    }
  });
}

await cargarDetalle();

await cargarOpciones("/opciones/categorias", "categoriaprin");
await cargarOpciones("/opciones/maquinamod", "maquinamod");
await cargarOpciones("/opciones/maquinaesp", "maquinaesp");




