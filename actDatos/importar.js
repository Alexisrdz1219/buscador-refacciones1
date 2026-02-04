async function subirExcel() {
  const file = document.getElementById("excelFile").files[0];
  const estado = document.getElementById("estado");

  if (!file) {
    estado.textContent = "❌ Selecciona un archivo Excel";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  estado.textContent = "⏳ Procesando Excel...";

  try {
    const res = await fetch(
      "https://buscador-refaccionesbackend.onrender.com/importar-excel",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (data.ok) {
      estado.textContent = `✅ Insertados: ${data.insertados} | Actualizados: ${data.actualizados}`;
    } else {
      estado.textContent = "❌ Error al procesar Excel";
    }

  } catch (err) {
    estado.textContent = "❌ Error de conexión con el servidor";
  }
}
