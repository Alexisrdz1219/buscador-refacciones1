document.addEventListener("DOMContentLoaded", () => {

    const API = "https://buscador-refaccionesbackend.onrender.com";
    const scannerInput = document.getElementById("scannerInput");
    const sugerenciasBox = document.getElementById("sugerenciasBox");
    let listaRefacciones = []; // { refinterna, nombreprod, ubicacion }
    let debounceTimer = null;
    let ultimoTiempo = 0;

    // ─── ESCÁNER + SUGERENCIAS ────────────────────────────────────────────────
    scannerInput.addEventListener("input", (e) => {
        const q = e.target.value.trim();
        const ahora = Date.now();

        clearTimeout(debounceTimer);
        sugerenciasBox.style.display = "none";
        sugerenciasBox.innerHTML = "";

        if (q.length < 2) return;

        const tiempoDesdeUltimaLetra = ahora - ultimoTiempo;
        ultimoTiempo = ahora;
        const esEscaner = tiempoDesdeUltimaLetra < 50;

        debounceTimer = setTimeout(async () => {
            const valorActual = scannerInput.value.trim();
            if (!valorActual) return;

            try {
                // Intenta código exacto primero (escáner)
                const res = await fetch(`${API}/buscar-codigo?codigo=${encodeURIComponent(valorActual)}`);
                if (res.ok) {
                    const producto = await res.json();
                    if (producto?.refinterna) {
                        agregarRefaccion(producto);
                        scannerInput.value = "";
                        scannerInput.focus();
                        return;
                    }
                }
            } catch (e) {}

            // Si no encontró, muestra sugerencias (escritura manual)
            try {
                const res = await fetch(`${API}/buscar-sugerencias?q=${encodeURIComponent(valorActual)}`);
                const sugerencias = await res.json();

                if (!sugerencias.length) return;

                sugerencias.forEach(prod => {
                    const item = document.createElement("div");
                    item.className = "sug-item";
                    item.innerHTML = `
                        <span class="sug-codigo">${prod.refinterna}</span>
                        <span class="sug-nombre"> — ${prod.nombreprod}</span>
                    `;
                    item.addEventListener("mousedown", () => {
                        agregarRefaccion(prod);
                        sugerenciasBox.style.display = "none";
                        scannerInput.value = "";
                        scannerInput.focus();
                    });
                    sugerenciasBox.appendChild(item);
                });

                const rect = scannerInput.getBoundingClientRect();
                sugerenciasBox.style.top = (rect.bottom + window.scrollY) + "px";
                sugerenciasBox.style.left = (rect.left + window.scrollX) + "px";
                sugerenciasBox.style.width = rect.width + "px";
                sugerenciasBox.style.display = "block";
            } catch (e) {
                console.error("Error sugerencias:", e);
            }

        }, esEscaner ? 80 : 300);
    });

    scannerInput.addEventListener("blur", () => {
        setTimeout(() => { sugerenciasBox.style.display = "none"; }, 150);
    });

    // ─── AGREGAR AL LISTA ─────────────────────────────────────────────────────
    function agregarRefaccion(producto) {
        const existe = listaRefacciones.find(r => r.refinterna === producto.refinterna);
        if (existe) {
            alert(`${producto.refinterna} ya está en la lista`);
            return;
        }

        listaRefacciones.push({
            refinterna: producto.refinterna,
            nombreprod: producto.nombreprod,
            ubicacion: producto.ubicacion || "Sin ubicación",
        });

        renderTabla();
    }

    function renderTabla() {
        const tbody = document.getElementById("tbodyUbicacion");
        tbody.innerHTML = "";

        listaRefacciones.forEach((item, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.refinterna}</td>
                    <td>${item.nombreprod}</td>
                    <td><span class="text-muted">${item.ubicacion}</span></td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarRefaccion(${index})">X</button>
                    </td>
                </tr>
            `;
        });
    }

    window.eliminarRefaccion = function(index) {
        listaRefacciones.splice(index, 1);
        renderTabla();
    };

    // ─── GUARDAR ──────────────────────────────────────────────────────────────
    window.guardarUbicaciones = async function() {
        const ubicacion = document.getElementById("inputUbicacion").value.trim();

        if (!ubicacion) { alert("Escribe una ubicación primero"); return; }
        if (!listaRefacciones.length) { alert("No hay refacciones en la lista"); return; }

        try {
            const res = await fetch(`${API}/actualizar-ubicacion`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ubicacion,
                    refacciones: listaRefacciones.map(r => r.refinterna)
                }),
            });

            const data = await res.json();
            console.log(data);
            alert(`Ubicación "${ubicacion}" guardada en ${listaRefacciones.length} refacción(es)`);

            // Limpia todo para la siguiente ubicación
            listaRefacciones = [];
            renderTabla();
            document.getElementById("inputUbicacion").value = "";
            scannerInput.focus();
        } catch (error) {
            console.log(error);
            alert("Error al guardar");
        }
    };

});