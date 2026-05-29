// console.log("Script.js Cargado");
const API_URL = "https://buscador-refaccionesbackend.onrender.com";

fetch("https://buscador-refaccionesbackend.onrender.com/health")
  .then(res => res.json())
  .then(data => {
    // console.log("RESPUESTA BACKEND:", data);
  })
  .catch(err => {
    console.error("ERROR:", err);
  });

  const statusDiv = document.getElementById("backend-status");

fetch("https://buscador-refaccionesbackend.onrender.com/health")
  .then(res => res.json())
  .then(data => {

    if (!statusDiv) return; // 👈 ESTA ES LA CLAVE

    if (data.ok) {
      statusDiv.innerHTML = `
        <p>Backend  y BD Conectados</p>
       
        <p>Hora servidor: ${data.time}</p>
      `;
    } else {
      statusDiv.innerHTML = "Backend respondió, pero algo falló";
    }
  })
  .catch(err => {
    if (statusDiv) {
      statusDiv.innerHTML = "No se pudo conectar al backend";
    }
    console.error(err);
  });

async function mostrarUltimaActualizacion(){

  const elemento =
  document.getElementById(
    "ultimaActualizacion"
  );

  try{

    const token =
    localStorage.getItem("token");

    const res = await fetch(

      "https://buscador-refaccionesbackend.onrender.com/refacciones?page=1&limit=20",

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

    if(res.status === 401){

      elemento.textContent =
      "Sesión expirada";

      window.location.href =
      "/login.html";

      return;

    }

    const respuesta =
    await res.json();

    const data =
    respuesta.data;

    if(!Array.isArray(data)
      || data.length === 0){

      elemento.textContent =
      "No hay registros aún";

      return;

    }

    const ultima =
    data.reduce((max, r) => {

      const fecha = new Date(

        r.updated_at ||
        r.created_at

      );

      return fecha > max
        ? fecha
        : max;

    }, new Date(0));

    const ahora = new Date();

    let texto = "";

    if(

      ultima.toDateString()
      ===
      ahora.toDateString()

    ){

      texto = `Hoy, ${ultima.toLocaleTimeString([], {

        hour: '2-digit',
        minute: '2-digit'

      })}`;

    }else{

      texto = ultima.toLocaleString([], {

        dateStyle: 'short',
        timeStyle: 'short'

      });

    }

    elemento.textContent = texto;

  }catch(err){

    elemento.textContent =
    "Error al obtener actualización";

    console.error(err);

  }

}

mostrarUltimaActualizacion();

async function mostrarTotalRefacciones(){

  const elemento =
  document.getElementById(
    "totalRefacciones"
  );

  try{

    const token =
    localStorage.getItem("token");

    const res = await fetch(

      "https://buscador-refaccionesbackend.onrender.com/refacciones?page=1&limit=1",

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

    if(res.status === 401){

      elemento.textContent =
      "Sesión expirada";

      window.location.href =
      "/login.html";

      return;

    }

    const data =
    await res.json();

    elemento.textContent =
    `${data.total.toLocaleString()} Refacciones`;

  }catch(err){

    elemento.textContent =
    "Error al obtener total";

    console.error(err);

  }

}

mostrarTotalRefacciones();

async function mostrarUltimosProductos(){

  const nombreElem =
  document.getElementById(
    "ultimoProducto"
  );

  const etiquetasElem =
  document.getElementById(
    "ultimasEtiquetas"
  );

  if(!nombreElem || !etiquetasElem){

    return;

  }

  try{

    const token =
    localStorage.getItem("token");

    const res = await fetch(

      "https://buscador-refaccionesbackend.onrender.com/refacciones?page=1&limit=1",

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

    if(res.status === 401){

      nombreElem.textContent =
      "Sesión expirada";

      window.location.href =
      "/login.html";

      return;

    }

    const respuesta =
    await res.json();

    const data =
    respuesta.data;

    if(!Array.isArray(data)
      || data.length === 0){

      nombreElem.textContent =
      "No hay refacciones";

      return;

    }

    const ultimo = data[0];

    nombreElem.textContent =
    ultimo.nombreprod || "Sin nombre";

    etiquetasElem.innerHTML = "";

    if(ultimo.tags
      && ultimo.tags.length > 0){

      ultimo.tags.forEach(et => {

        const span =
        document.createElement("span");

        span.className =
        "badge bg-light text-dark border rounded-pill px-3";

        span.textContent = et;

        etiquetasElem.appendChild(span);

      });

    }

  }catch(err){

    nombreElem.textContent =
    "Error al cargar";

    console.error(err);

  }

}

mostrarUltimosProductos();

async function cargarLogs() {

  const res = await fetch(`${API_URL}/logs-db`);
  const logs = await res.json();

  const tabla = document.getElementById("tablaLogs");

if (!tabla) return; // 🔥 corta ejecución si no existe

tabla.innerHTML = "";

logs.forEach(log => {
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${new Date(log.created_at).toLocaleString()}</td>
    <td>${log.level}</td>
    <td>${log.message}</td>
    <td>${log.route || ""}</td>
    <td>${log.data ? JSON.stringify(log.data) : ""}</td>
  `;

  tabla.appendChild(fila);
});

}

cargarLogs();