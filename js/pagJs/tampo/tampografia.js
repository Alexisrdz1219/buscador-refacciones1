let carritoSalidas = [];
let refaccionActual = null;
let debounceTimer = null;

const API = "https://buscador-refaccionesbackend.onrender.com";

const scannerInput = document.getElementById("scannerInput");
const sugerenciasBox = document.getElementById("sugerenciasBox");

// ─── UN SOLO LISTENER DE INPUT ───────────────────────────────────────────────
scannerInput.addEventListener("input", (e) => {
    const q = e.target.value.trim();

    clearTimeout(debounceTimer);
    sugerenciasBox.style.display = "none";
    sugerenciasBox.innerHTML = "";

    if (q.length < 2) return;

    // Escáner: cuando llega un código largo de golpe (≥6 chars sin pausa)
    // el debounce igual lo maneja, no necesitas lógica separada

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
                    agregarAlCarrito(prod);
                    sugerenciasBox.style.display = "none";
                    scannerInput.value = "";
                    scannerInput.focus();
                });
                sugerenciasBox.appendChild(item);
            });

            sugerenciasBox.style.display = "block";
        } catch (e) {
            console.error("Error sugerencias:", e);
        }
    }, 300);
});

// ─── ENTER: busca por código exacto (escáner físico) ─────────────────────────
scannerInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    sugerenciasBox.style.display = "none";
    const codigo = scannerInput.value.trim();
    if (!codigo) return;

    try {
        const res = await fetch(`${API}/buscar-codigo?codigo=${encodeURIComponent(codigo)}`);
        if (!res.ok) throw new Error("No encontrado");

        const producto = await res.json();
        agregarAlCarrito(producto);
        scannerInput.value = "";
        scannerInput.focus();
    } catch (error) {
        console.log("No encontrado:", error);
        scannerInput.value = "";
    }
});

// Cierra dropdown al perder foco
scannerInput.addEventListener("blur", () => {
    setTimeout(() => { sugerenciasBox.style.display = "none"; }, 150);
});

// ─── LÓGICA DE CARRITO ────────────────────────────────────────────────────────
function agregarAlCarrito(producto) {
    const existe = carritoSalidas.find(item => item.codigo === producto.refinterna); // ← cambia esto
    if (existe) {
        existe.cantidad++;
    } else {
        carritoSalidas.push({
            id: producto.id,
            codigo: producto.refinterna,
            nombreprod: producto.nombreprod,
            cantidad: 1,
        });
    }
    renderTabla();
}

function renderTabla() {
    const tbody = document.getElementById("tbodySalidas");
    tbody.innerHTML = "";
    carritoSalidas.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.nombreprod}</td>
                <td>
                    <input
                        type="number"
                        min="1"
                        value="${item.cantidad}"
                        onchange="cambiarCantidad(${index}, this.value)"
                        class="form-control"
                    >
                </td>
                <td>
                    <button class="btn btn-danger" onclick="eliminarProducto(${index})">X</button>
                </td>
            </tr>
        `;
    });
}

function cambiarCantidad(index, valor) {
    carritoSalidas[index].cantidad = Number(valor);
}

function eliminarProducto(index) {
    carritoSalidas.splice(index, 1);
    renderTabla();
}

// async function guardarTodas() {
//     if (carritoSalidas.length === 0) { alert("No hay productos"); return; }

//     const solicitado_por = document.getElementById("solicitadoPor").value.trim();
//     const entregado_por = document.getElementById("entregadoPor").value;
//     const maquina = document.getElementById("maquina").value.trim();

//     if (!solicitado_por) { alert("Ingresa quién solicitó"); return; }
//     if (!maquina) { alert("Ingresa la máquina"); return; }

//     try {
//         const res = await fetch(`${API}/movimientos-masivos`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ solicitado_por, entregado_por, maquina, movimientos: carritoSalidas }),
//         });

//         const data = await res.json();
//         console.log(data);
//         alert("Salidas registradas");

//         carritoSalidas = [];
//         renderTabla();
//         document.getElementById("solicitadoPor").value = "";
//         document.getElementById("maquina").value = "";
//         scannerInput.focus();
//     } catch (error) {
//         console.log(error);
//         alert("Error al guardar");
//     }
// }
async function guardarTodas() {
    if (carritoSalidas.length === 0) { alert("No hay productos"); return; }

    const solicitado_por = document.getElementById("solicitadoPor").value.trim();
    const entregado_por = document.getElementById("entregadoPor").value;
    const maquina = document.getElementById("maquina").value.trim();
    const nota = document.getElementById("notaSalida").value.trim(); // ← agrega esto

    if (!solicitado_por) { alert("Ingresa quién solicitó"); return; }
    if (!maquina) { alert("Ingresa la máquina"); return; }

    try {
        const res = await fetch(`${API}/movimientos-masivos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ solicitado_por, entregado_por, maquina, nota, movimientos: carritoSalidas }), // ← agrega nota
        });

        const data = await res.json();
        console.log(data);
        alert("Salidas registradas");

        carritoSalidas = [];
        renderTabla();
        document.getElementById("solicitadoPor").value = "";
        document.getElementById("maquina").value = "";
        document.getElementById("notaSalida").value = ""; // ← limpia el campo
        scannerInput.focus();
    } catch (error) {
        console.log(error);
        alert("Error al guardar");
    }
}