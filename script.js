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

  