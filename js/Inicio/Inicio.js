const API = "https://buscador-refaccionesbackend.onrender.com";

const inputBusqueda = document.getElementById("inputBusqueda");
const sugerencias = document.getElementById("sugerencias");

// =========================
// BUSQUEDA CON DEBOUNCE
// =========================

let timeout;

inputBusqueda.addEventListener("input", (e) => {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

        buscar(e.target.value);

    }, 300);

});

// =========================
// FUNCION BUSCAR
// =========================

async function buscar(texto){

    texto = texto.trim();

    // SI NO ESCRIBE NADA
    if(texto.length < 2){

        sugerencias.classList.add("d-none");
        sugerencias.innerHTML = "";

        return;
    }

    try{

        // FETCH
        const resp = await fetch(
            `${API}/buscar?q=${encodeURIComponent(texto)}`
        );

        // VALIDAR
        if(!resp.ok){
            throw new Error("Error al buscar");
        }

        // JSON
        const data = await resp.json();

        // LIMPIAR
        sugerencias.innerHTML = "";

        // SIN RESULTADOS
        if(data.length === 0){

            sugerencias.classList.add("d-none");

            return;
        }

        // CREAR SUGERENCIAS
        data.forEach(ref => {

            sugerencias.innerHTML += `
            
                <div 
                    class="sugerencia-item"
                    onclick="seleccionarRefaccion('${ref.id}')"
                >

                    <div class="sugerencia-titulo">
                        ${ref.nombreprod}
                    </div>

                    <div class="sugerencia-ref">
                        ${ref.ref_interna}
                    </div>

                </div>

            `;
        });

        // MOSTRAR
        sugerencias.classList.remove("d-none");

    }catch(error){

        console.log("ERROR:", error);

        sugerencias.classList.add("d-none");

    }

}

// =========================
// CLICK EN SUGERENCIA
// =========================

function seleccionarRefaccion(id){

    window.location.href = `
        ../Resultados/Resultados.html?id=${id}
    `;

}

// =========================
// CERRAR SUGERENCIAS
// =========================

document.addEventListener("click", (e) => {

    if(!e.target.closest(".header-search")){

        sugerencias.classList.add("d-none");

    }

});

// =========================
// ENTER O BOTON SEARCH
// =========================

document.getElementById("formBusqueda")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const texto = inputBusqueda.value.trim();

    if(!texto) return;

    window.location.href = `
        ../Resultados/Resultados.html?q=${encodeURIComponent(texto)}
    `;

});