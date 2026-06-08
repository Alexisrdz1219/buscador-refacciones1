const API_URL = "https://buscador-refaccionesbackend.onrender.com";
const CACHE_KEY = "dashboard_stats";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
const statusDiv = document.getElementById("backend-status");
if (statusDiv) {
    fetch(`${API_URL}/health`)
        .then(r => r.json())
        .then(data => {
            statusDiv.innerHTML = data.ok
                ? `<p>Backend y BD Conectados</p><p>Hora servidor: ${data.time}</p>`
                : "Backend respondió, pero algo falló";
        })
        .catch(() => {
            statusDiv.innerHTML = "No se pudo conectar al backend";
        });
}

// ─── DASHBOARD (1 sola llamada con caché) ─────────────────────────────────────
async function cargarDashboard() {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Si hay caché reciente, usa eso sin llamar al backend
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
            renderDashboard(data);
            return;
        }
    }

    try {
        const res = await fetch(`${API_URL}/dashboard-stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
            window.location.href = "/login.html";
            return;
        }

        const data = await res.json();

        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));

        renderDashboard(data);

    } catch (err) {
        console.error("Error dashboard:", err);
    }
}

function renderDashboard(data) {
    // Total refacciones
    const totalElem = document.getElementById("totalRefacciones");
    if (totalElem) {
        totalElem.textContent = `${Number(data.total).toLocaleString()} Refacciones`;
    }

    // Última actualización
    const ultimaElem = document.getElementById("ultimaActualizacion");
    if (ultimaElem && data.ultima_actualizacion) {
        const fecha = new Date(data.ultima_actualizacion);
        const ahora = new Date();
        ultimaElem.textContent = fecha.toDateString() === ahora.toDateString()
            ? `Hoy, ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : fecha.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    }

    // Último producto
    const nombreElem = document.getElementById("ultimoProducto");
    const etiquetasElem = document.getElementById("ultimasEtiquetas");

    if (nombreElem) {
        nombreElem.textContent = data.ultimo_producto || "Sin nombre";
    }

    if (etiquetasElem && data.ultimo_palclave) {
        etiquetasElem.innerHTML = "";
        data.ultimo_palclave.split(",").forEach(et => {
            const span = document.createElement("span");
            span.className = "badge bg-light text-dark border rounded-pill px-3";
            span.textContent = et.trim();
            etiquetasElem.appendChild(span);
        });
    }
}

// ─── LOGS ─────────────────────────────────────────────────────────────────────
async function cargarLogs() {
    const tabla = document.getElementById("tablaLogs");
    if (!tabla) return;

    try {
        const res = await fetch(`${API_URL}/logs-db`);
        const logs = await res.json();

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
    } catch (err) {
        console.error("Error logs:", err);
    }
}

// ─── ARRANQUE ─────────────────────────────────────────────────────────────────
cargarDashboard();
cargarLogs();