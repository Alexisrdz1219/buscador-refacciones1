document.addEventListener("DOMContentLoaded", () => {

    const API = "https://buscador-refaccionesbackend.onrender.com";
    const buscarInput = document.getElementById("buscarInput");
    const sugerenciasBox = document.getElementById("sugerenciasBox");
    let debounceTimer = null;

    // ─── BUSCADOR CON SUGERENCIAS ─────────────────────────────────────────────
    buscarInput.addEventListener("input", (e) => {
        const q = e.target.value.trim();

        clearTimeout(debounceTimer);
        sugerenciasBox.style.display = "none";
        sugerenciasBox.innerHTML = "";

        if (q.length < 2) return;

        debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`${API}/buscar-sugerencias?q=${encodeURIComponent(q)}`);
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
                        buscarInput.value = prod.refinterna;
                        sugerenciasBox.style.display = "none";
                        cargarHistorial(prod.refinterna);
                    });
                    sugerenciasBox.appendChild(item);
                });

                // Posiciona el dropdown bajo el input
                const rect = buscarInput.getBoundingClientRect();
                sugerenciasBox.style.top = (rect.bottom + window.scrollY) + "px";
                sugerenciasBox.style.left = (rect.left + window.scrollX) + "px";
                sugerenciasBox.style.width = rect.width + "px";
                sugerenciasBox.style.display = "block";
            } catch (e) {
                console.error("Error sugerencias:", e);
            }
        }, 300);
    });

    buscarInput.addEventListener("blur", () => {
        setTimeout(() => { sugerenciasBox.style.display = "none"; }, 150);
    });

    // ─── CARGA HISTORIAL DEL PRODUCTO ─────────────────────────────────────────
    async function cargarHistorial(q) {
        try {
            const res = await fetch(`${API}/historial-producto?q=${encodeURIComponent(q)}`);
            const data = await res.json();

            const resumenProducto = document.getElementById("resumenProducto");
            const tablaHistorial = document.getElementById("tablaHistorial");
            const sinResultados = document.getElementById("sinResultados");
            const tbody = document.getElementById("tbodyHistorial");

            tbody.innerHTML = "";

            if (!data.length) {
                resumenProducto.style.display = "none";
                tablaHistorial.style.display = "none";
                sinResultados.style.display = "block";
                return;
            }

            // Resumen del producto
            const totalCantidad = data.reduce((acc, mov) => acc + Number(mov.cantidad), 0);
            document.getElementById("resumenNombre").textContent = data[0].nombreprod;
            document.getElementById("resumenCodigo").textContent = data[0].refinterna;
            document.getElementById("resumenTotal").textContent = totalCantidad + " piezas";

            resumenProducto.style.display = "block";
            tablaHistorial.style.display = "table";
            sinResultados.style.display = "none";

            data.forEach(mov => {
                tbody.innerHTML += `
                    <tr>
                        <td>${new Date(mov.fecha).toLocaleString()}</td>
                        <td>${mov.cantidad}</td>
                        <td>${mov.solicitado_por || ""}</td>
                        <td>${mov.entregado_por || ""}</td>
                        <td>${mov.maquina || ""}</td>
                        <td>${mov.nota || "—"}</td>
                    </tr>
                `;
            });

        } catch (error) {
            console.log(error);
            alert("Error al cargar historial");
        }
    }

});