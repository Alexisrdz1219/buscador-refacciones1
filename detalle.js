const API = "https://buscador-refaccionesbackend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function cargarDetalle() {
  const res = await fetch(`${API}/refacciones/${id}`);
  const r = await res.json();

cargarOpciones("/opciones/categorias", "categoriaprin", "valor");
cargarOpciones("/opciones/maquinamod", "maquinamod", "valor");
cargarOpciones("/opciones/maquinaesp", "maquinaesp", "valor");


  Object.keys(r).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.value = r[key] ?? "";
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


async function cargarOpciones(endpoint, selectId, campo, valorActual = "") {
  const res = await fetch(`${API}${endpoint}`);
  const data = await res.json();

  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">-- Selecciona --</option>`;

  data.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item[campo];
    opt.textContent = item[campo];

    if (item[campo] === valorActual) {
      opt.selected = true;
    }

    select.appendChild(opt);
  });
}



