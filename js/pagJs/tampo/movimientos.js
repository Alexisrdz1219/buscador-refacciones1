// // const API = "https://buscador-refaccionesbackend.onrender.com";

// // async function cargarMovimientos() {
// //   try {
// //     const res = await fetch(`${API}/movimientos`);

// //     const data = await res.json();

// //     console.log(data);

// //     const tbody = document.getElementById("tbodyMovimientos");

// //     tbody.innerHTML = "";

// //    data.forEach((mov) => {
// //     tbody.innerHTML += `
// //         <tr>
// //             <td>${new Date(mov.fecha).toLocaleString()}</td>
// //             <td>${mov.refinterna || ""}</td>
// //             <td>${mov.nombreprod || ""}</td>
// //             <td>${mov.cantidad}</td>
// //             <td>${mov.solicitado_por || ""}</td>
// //             <td>${mov.entregado_por || ""}</td>
// //             <td>${mov.maquina || ""}</td>
// //             <td>${mov.nota || "—"}</td>  
// //         </tr>
// //     `;
// // });
// //   } catch (error) {
// //     console.log(error);

// //     alert("Error al cargar");
// //   }
// // }

// // cargarMovimientos();
// const API = "https://buscador-refaccionesbackend.onrender.com";

// async function cargarMovimientos() {
//     try {
//         const res = await fetch(`${API}/movimientos`);
//         const data = await res.json();

//         const tbody = document.getElementById("tbodyMovimientos");
//         tbody.innerHTML = "";

//         data.forEach((mov) => {
//             tbody.innerHTML += `
//                 <tr id="fila-${mov.id}">
//                     <td>${new Date(mov.fecha).toLocaleString()}</td>
//                     <td>${mov.refinterna || ""}</td>
//                     <td>${mov.nombreprod || ""}</td>
//                     <td>${mov.cantidad}</td>
//                     <td>${mov.solicitado_por || ""}</td>
//                     <td>${mov.entregado_por || ""}</td>
//                     <td>${mov.maquina || ""}</td>
//                     <td>${mov.nota || "—"}</td>
//                     <td>
//                         <button 
//                             class="btn btn-danger btn-sm"
//                             onclick="eliminarMovimiento(${mov.id})"
//                         >X</button>
//                     </td>
//                 </tr>
//             `;
//         });
//     } catch (error) {
//         console.log(error);
//         alert("Error al cargar");
//     }
// }

// async function eliminarMovimiento(id) {
//     if (!confirm("¿Eliminar este movimiento?")) return;

//     try {
//         const res = await fetch(`${API}/movimientos/${id}`, {
//             method: "DELETE"
//         });

//         if (!res.ok) throw new Error("Error al eliminar");

//         // Quita la fila sin recargar toda la tabla
//         document.getElementById(`fila-${id}`).remove();
//     } catch (error) {
//         console.log(error);
//         alert("Error al eliminar");
//     }
// }

// cargarMovimientos();
const API = "https://buscador-refaccionesbackend.onrender.com";

async function cargarMeses() {
    try {
        const res = await fetch(`${API}/movimientos/meses`);
        const meses = await res.json();

        const select = document.getElementById("filtroMes");

        meses.forEach(m => {
            const option = document.createElement("option");
            option.value = m.mes;
            option.textContent = m.mes_label.trim();
            select.appendChild(option);
        });

        // Carga el mes más reciente por defecto
        if (meses.length > 0) {
            select.value = meses[0].mes;
        }

        cargarMovimientos();
    } catch (error) {
        console.log(error);
    }
}

async function cargarMovimientos() {
    try {
        const mes = document.getElementById("filtroMes").value;
        const url = mes ? `${API}/movimientos?mes=${mes}` : `${API}/movimientos`;

        const res = await fetch(url);
        const data = await res.json();

        document.getElementById("totalMovimientos").textContent = 
            `${data.length} movimiento${data.length !== 1 ? "s" : ""}`;

        const tbody = document.getElementById("tbodyMovimientos");
        tbody.innerHTML = "";

        data.forEach((mov) => {
            tbody.innerHTML += `
                <tr id="fila-${mov.id}">
                    <td>${new Date(mov.fecha).toLocaleString()}</td>
                    <td>${mov.refinterna || ""}</td>
                    <td>${mov.nombreprod || ""}</td>
                    <td>${mov.cantidad}</td>
                    <td>${mov.solicitado_por || ""}</td>
                    <td>${mov.entregado_por || ""}</td>
                    <td>${mov.maquina || ""}</td>
                    <td>${mov.nota || "—"}</td>
                    <td>
                        <button 
                            class="btn btn-danger btn-sm"
                            onclick="eliminarMovimiento(${mov.id})"
                        >X</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.log(error);
        alert("Error al cargar");
    }
}

function cambiarMes() {
    cargarMovimientos();
}

async function eliminarMovimiento(id) {
    if (!confirm("¿Eliminar este movimiento?")) return;

    try {
        const res = await fetch(`${API}/movimientos/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");
        document.getElementById(`fila-${id}`).remove();

        // Actualiza el contador
        const span = document.getElementById("totalMovimientos");
        const actual = parseInt(span.textContent);
        span.textContent = `${actual - 1} movimiento${actual - 1 !== 1 ? "s" : ""}`;
    } catch (error) {
        console.log(error);
        alert("Error al eliminar");
    }
}

cargarMeses(); // ← arranca aquí, no cargarMovimientos()