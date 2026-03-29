async function subirOdoo() {
  const file = document.getElementById("excelFile").files[0];
  const estado = document.getElementById("estado");

  if (!file) {
    estado.textContent = "❌ Selecciona un archivo";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  estado.textContent = "⏳ Procesando archivo de Odoo...";

  try {
    const res = await fetch(
      "https://buscador-refaccionesbackend.onrender.com/importar-odoo",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (data.ok) {
      estado.textContent =
        `✅ Actualizadas: ${data.actualizados} | Nuevas: ${data.insertados}`;
    } else {
      estado.textContent = "❌ Error al procesar archivo";
    }
  } catch {
    estado.textContent = "❌ Error de conexión";
  }
}
