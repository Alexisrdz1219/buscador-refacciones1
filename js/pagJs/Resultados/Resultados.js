const API_Resultados = "https://buscador-refaccionesbackend.onrender.com";
let limiteResultados = 5;
const listaResultados = document.getElementById("listaResultados");
const vistaProducto = document.getElementById("vistaProducto");

// LEER URL
const params = new URLSearchParams(window.location.search);

const query = params.get("q");
const id = params.get("id");

// SI VIENE QUERY
if(query){

    buscarResultados(query);

}

// SI VIENE ID
if(id){

    cargarProductoIndividual(id);

}

async function cargarProductoIndividual(id){

    try{

        const resp = await fetch(
            `${API_Resultados}/refacciones/${id}`
        );

        const producto = await resp.json();

        listaResultados.innerHTML = `

            <div 
                class="resultado-item active"
            >

                <div class="resultado-titulo">
                    ${producto.nombreprod || "Sin nombre"}
                </div>

                <div class="resultado-ref">
                    ${producto.refinterna || "Sin ref"}
                </div>

            </div>

        `;

        verProducto(id);

    }catch(error){

        console.log(error);

    }

}

async function buscarResultados(texto){

    try{

        const resp = await fetch(
            `${API_Resultados}/buscar?q=${encodeURIComponent(texto)}&limit=${limiteResultados}`
        );

        const data = await resp.json();

        console.log(data);

        listaResultados.innerHTML = "";

        data.forEach((ref) => {

            listaResultados.innerHTML += `

                <div 
                    class="resultado-item"
                    onclick="verProducto(${ref.id}, this)"
                >

                    <div class="resultado-titulo">
                        ${ref.nombreprod || "Sin nombre"}
                    </div>

                    <div class="resultado-ref">
                        ${ref.refinterna || "Sin ref"}
                    </div>

                </div>

            `;
        });

        // ABRIR PRIMER RESULTADO
        if(data.length > 0){

            verProducto(data[0].id);

        }

        // BOTON VER MAS
        const btnVerMas = document.getElementById("btnVerMas");

        if(data.length >= limiteResultados){

            btnVerMas.classList.remove("d-none");

            btnVerMas.innerText = `
                Ver más resultados
            `;

        }else{

            btnVerMas.classList.add("d-none");

        }

    }catch(error){

        console.log(error);

    }

}

async function verProducto(id, elemento){

    try{

        // QUITAR ACTIVE
        document.querySelectorAll(".resultado-item")
        .forEach(item => item.classList.remove("active"));

        // PONER ACTIVE
        if(elemento){
            elemento.classList.add("active");
        }

        // FETCH A TU ENDPOINT REAL
        const resp = await fetch(
            `${API_Resultados}/refacciones/${id}`
        );

        if(!resp.ok){
            throw new Error("No se pudo obtener la refacción");
        }

        const producto = await resp.json();
        console.log(producto);
        // MOSTRAR INFO
        vistaProducto.innerHTML = `

            <h3 class="mb-3">
                ${producto.nombreprod || "Sin nombre"}
            </h3>

            <hr>

            <img 
                src="${producto.imagen || "https://via.placeholder.com/400x300?text=Sin+Imagen"}" 
                alt="${producto.nombreprod || "Refacción"}"
                class="img-fluid mb-3"
            >

            <hr>

            <p>
                <strong>Ref Interna:</strong>
                ${producto.refinterna || "N/A"}
            </p>

            <p>
                <strong>Ubicación:</strong>
                ${producto.ubicacion || "Sin ubicación"}
            </p>

            <p>
                <strong>Tipo:</strong>
                ${producto.unidad || "Sin tipo"}
            </p>

            <p>
                <strong>Stock:</strong>
                ${producto.cantidad || 0}
            </p>

            <p>
                <strong>Descripción:</strong>
                ${producto.palClave || "Sin descripción"}
            </p>

            <hr>

            <h6>Tags</h6>

            <div class="d-flex flex-wrap gap-2">

                ${
                    producto.tags?.length > 0
                    ? producto.tags.map(tag => `
                        <span class="badge bg-primary">
                            ${tag}
                        </span>
                    `).join("")
                    : "<span>Sin tags</span>"
                }

            </div>

        `;

    }catch(error){

        console.log(error);

        vistaProducto.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar la refacción
            </div>
        `;

    }

}

document.getElementById("btnVerMas")
.addEventListener("click", () => {

    limiteResultados += 10;

    buscarResultados(query);

});