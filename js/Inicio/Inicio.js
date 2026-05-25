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

        const resp = await fetch(`/api/refacciones/buscar?q=${texto}`);

        const data = await resp.json();

        sugerencias.innerHTML = "";

        // SOLO 5 SUGERENCIAS
        data.forEach(ref => {

            sugerencias.innerHTML += `
                <div class="sugerencia-item" onclick="seleccionarRefaccion('${ref.id}')">

                    <div class="sugerencia-titulo">
                        ${ref.titulo}
                    </div>

                    <div class="sugerencia-ref">
                        ${ref.ref_interna}
                    </div>

                </div>
            `;
        });

        if(data.length > 0){
            sugerencias.classList.remove("d-none");
        }else{
            sugerencias.classList.add("d-none");
        }

    }catch(error){
        console.log(error);
    }

});

function seleccionarRefaccion(id){

    console.log("REF:", id);

    // ejemplo:
    // window.location.href = `/refaccion/${id}`;

}