console.log("🔥 script.js cargado correctamente");
const API_URL = "https://buscador-refaccionesbackend.onrender.com";

fetch("https://buscador-refaccionesbackend.onrender.com/health")
  .then(res => res.json())
  .then(data => {
    console.log("RESPUESTA BACKEND:", data);
  })
  .catch(err => {
    console.error("ERROR:", err);
  });

  const statusDiv = document.getElementById("backend-status");

fetch("https://buscador-refaccionesbackend.onrender.com/health")
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      statusDiv.innerHTML = `
        <p style="color:green;">✅ Backend conectado</p>
        <p style="color:green;">✅ Base de datos conectada</p>
        <p>🕒 Hora servidor: ${data.time}</p>
      `;
    } else {
      statusDiv.innerHTML = "⚠️ Backend respondió, pero algo falló";
    }
  })
  .catch(err => {
    statusDiv.innerHTML = "❌ No se pudo conectar al backend";
    console.error(err);
  });

  async function mostrarUltimaActualizacion() {
  const elemento = document.getElementById("ultimaActualizacion");

  try {
    const res = await fetch("https://buscador-refaccionesbackend.onrender.com/refacciones");
    const data = await res.json();

    if (data.length === 0) {
      elemento.textContent = "No hay registros aún";
      return;
    }

    // Suponiendo que cada refacción tiene 'updated_at' o 'created_at'
    const ultima = data.reduce((max, r) => {
      const fecha = new Date(r.updated_at || r.created_at);
      return fecha > max ? fecha : max;
    }, new Date(0));

    // Formateo legible, ejemplo: Hoy, 10:45 AM
    const ahora = new Date();
    let texto = "";

    if (ultima.toDateString() === ahora.toDateString()) {
      texto = `Hoy, ${ultima.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
      texto = ultima.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    }

    elemento.textContent = texto;

  } catch (err) {
    elemento.textContent = "Error al obtener actualización";
    console.error(err);
  }
}

// Llamar la función al cargar la página
mostrarUltimaActualizacion();
