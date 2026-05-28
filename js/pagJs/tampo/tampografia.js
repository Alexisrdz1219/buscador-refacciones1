let carritoSalidas = [];

let refaccionActual = null;

const API =
"https://buscador-refaccionesbackend.onrender.com";

const scannerInput =
document.getElementById("scannerInput");

scannerInput.addEventListener("input", async (e) => {

    const codigo =
    e.target.value.trim();

    // SI AUN NO COMPLETA
    if(codigo.length < 6){

        return;

    }

    console.log("CODIGO:", codigo);

    try{

        const res = await fetch(

            `${API}/buscar-codigo?codigo=${codigo}`

        );

        if(!res.ok){

            throw new Error("No encontrado");

        }

        const producto = await res.json();

        // VERIFICAR SI YA EXISTE
        const existe = carritoSalidas.find(

            item => item.id === producto.id

        );

        if(existe){

            existe.cantidad++;

        }else{

            carritoSalidas.push({

                id: producto.id,

                codigo:
                producto.refinterna,

                nombreprod:
                producto.nombreprod,

                cantidad: 1

            });

        }

        renderTabla();

        // LIMPIAR INPUT AUTOMÁTICO
        scannerInput.value = "";

        scannerInput.focus();

    }catch(error){

        console.log(error);

        scannerInput.value = "";

    }

});


function renderTabla(){

    const tbody =
    document.getElementById("tbodySalidas");

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

                    <button
                        class="btn btn-danger"
                        onclick="eliminarProducto(${index})"
                    >

                        X

                    </button>

                </td>

            </tr>

        `;

    });

}

function cambiarCantidad(index, valor){

    carritoSalidas[index].cantidad =
    Number(valor);

}

function eliminarProducto(index){

    carritoSalidas.splice(index, 1);

    renderTabla();

}

async function guardarTodas(){

    try{

        if(carritoSalidas.length === 0){

            alert("No hay productos");

            return;

        }

        const solicitado_por =
        document.getElementById("solicitadoPor").value;

        const res = await fetch(

            `${API}/movimientos-masivos`,

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    solicitado_por,

                    entregado_por: "Alexis",

                    movimientos: carritoSalidas

                })

            }

        );

        const data = await res.json();

        console.log(data);

        alert("Salidas registradas");

        carritoSalidas = [];

        renderTabla();

        document.getElementById(
            "solicitadoPor"
        ).value = "";

        scannerInput.focus();

    }catch(error){

        console.log(error);

        alert("Error al guardar");

    }

}