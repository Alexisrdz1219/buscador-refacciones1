const API = "https://buscador-refaccionesbackend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function cargarDetalle() {
  const res = await fetch(`${API}/refacciones/${id}`);
  const r = await res.json();

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
