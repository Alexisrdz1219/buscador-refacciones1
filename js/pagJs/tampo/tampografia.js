let refaccionActual = null;

const scannerInput =
document.getElementById("scannerInput");

scannerInput.addEventListener("change", async (e) => {

    const codigo = e.target.value;

    try{

        const res = await fetch(

            `/buscar-codigo?codigo=${codigo}`

        );

        const data = await res.json();

        refaccionActual = data;

        document.getElementById("nombreProducto")
        .innerText = data.nombreprod;

        document.getElementById("codigoProducto")
        .innerText = data.refinterna;

        document.getElementById("ubicacionProducto")
        .innerText = data.ubicacion;

    }catch(error){

        alert("Producto no encontrado");

    }

});

async function guardarMovimiento(){

    if(!refaccionActual){

        alert("No hay producto");

        return;
    }

    const cantidad =
    document.getElementById("cantidad").value;

    const solicitado_por =
    document.getElementById("solicitadoPor").value;

    await fetch("/movimientos", {

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

    });

    alert("Movimiento guardado");

}