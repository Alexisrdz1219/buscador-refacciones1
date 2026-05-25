const API = "https://buscador-refaccionesbackend.onrender.com";

const inputBusqueda = document.getElementById("inputBusqueda");
const sugerencias = document.getElementById("sugerencias");

inputBusqueda.addEventListener("input", async (e) => {

    const texto = e.target.value.trim();

    // SI NO ESCRIBE NADA
    if(texto.length < 2){

        sugerencias.classList.add("d-none");
        sugerencias.innerHTML = "";

        return;
    }

    try{

        // FETCH AL BACKEND
        const resp = await fetch(
            `${API}/buscar?q=${encodeURIComponent(texto)}`
        );

        // VALIDAR RESPUESTA
        if(!resp.ok){
            throw new Error("Error al buscar");
        }

        // CONVERTIR A JSON
        const data = await resp.json();

        // LIMPIAR SUGERENCIAS
        sugerencias.innerHTML = "";

        // CREAR SUGERENCIAS
        data.forEach(ref => {

            sugerencias.innerHTML += `
                <div 
                    class="sugerencia-item"
                    onclick="seleccionarRefaccion('${ref.id}')"
                >

                    <div class="sugerencia-titulo">
                        ${ref.titulo}
                    </div>

                    <div class="sugerencia-ref">
                        ${ref.ref_interna}
                    </div>

                </div>
            `;
        });

        // MOSTRAR O OCULTAR
        if(data.length > 0){

            sugerencias.classList.remove("d-none");

        }else{

            sugerencias.classList.add("d-none");

        }

    }catch(error){

        console.log("ERROR:", error);

        sugerencias.classList.add("d-none");

    }

});

// AL SELECCIONAR
function seleccionarRefaccion(id){

    console.log("REF:", id);

    // EJEMPLO:
    // window.location.href = `/refaccion/${id}`;

}