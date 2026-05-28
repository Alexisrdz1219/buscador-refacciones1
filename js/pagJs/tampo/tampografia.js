let refaccionActual = null;

const API = "https://buscador-refaccionesbackend.onrender.com";

const scannerInput =
document.getElementById("scannerInput");

scannerInput.addEventListener("change", async (e) => {

    const codigo = e.target.value.trim();

    console.log("CODIGO ESCANEADO:", codigo);

    try{

        const res = await fetch(

            `${API}/buscar-codigo?codigo=${codigo}`

        );

        // SI NO ENCUENTRA
        if(!res.ok){

            throw new Error("Producto no encontrado");

        }

        const data = await res.json();

        console.log("PRODUCTO:", data);

        refaccionActual = data;

        document.getElementById("nombreProducto")
        .innerText = data.nombreprod || "Sin nombre";

        document.getElementById("codigoProducto")
        .innerText = data.refinterna || data.refInterna || "";

        document.getElementById("ubicacionProducto")
        .innerText = data.ubicacion || "Sin ubicación";

    }catch(error){

        console.log(error);

        alert("Producto no encontrado");

    }

});

async function guardarMovimiento(){

    try{

        if(!refaccionActual){

            alert("No hay producto seleccionado");

            return;
        }

        const cantidad =
        document.getElementById("cantidad").value;

        const solicitado_por =
        document.getElementById("solicitadoPor").value;

        const res = await fetch(

            `${API}/movimientos`,

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    refaccion_id: refaccionActual.id,

                    cantidad,

                    solicitado_por,

                    entregado_por: "Alexis"

                })

            }

        );

        const data = await res.json();

        console.log(data);

        alert("Movimiento guardado");

        // LIMPIAR FORMULARIO
        scannerInput.value = "";

        document.getElementById("cantidad").value = "";

        document.getElementById("solicitadoPor").value = "";

        document.getElementById("nombreProducto")
        .innerText = "Producto";

        document.getElementById("codigoProducto")
        .innerText = "";

        document.getElementById("ubicacionProducto")
        .innerText = "";

        refaccionActual = null;

        scannerInput.focus();

    }catch(error){

        console.log(error);

        alert("Error al guardar");

    }

}