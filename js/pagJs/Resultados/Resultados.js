const API = "https://buscador-refaccionesbackend.onrender.com";

const listaResultados = document.getElementById("listaResultados");
const vistaProducto = document.getElementById("vistaProducto");

// LEER URL
const params = new URLSearchParams(window.location.search);

const query = params.get("q");

// BUSCAR
buscarResultados(query);

async function buscarResultados(texto){

    try{

        const resp = await fetch(
            `${API}/buscar?q=${encodeURIComponent(texto)}`
        );

        const data = await resp.json();

        listaResultados.innerHTML = "";

        data.forEach((ref, index) => {

            listaResultados.innerHTML += `

                <div 
                    class="resultado-item"
                    onclick="verProducto(${ref.id}, this)"
                >

                    <div class="resultado-titulo">
                        ${ref.nombreProd}
                    </div>

                    <div class="resultado-ref">
                        ${ref.ref_interna}
                    </div>

                </div>

            `;
        });

        // ABRIR PRIMER RESULTADO
        if(data.length > 0){

            verProducto(data[0].id);

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
            `${API}/refacciones/${id}`
        );

        if(!resp.ok){
            throw new Error("No se pudo obtener la refacción");
        }

        const producto = await resp.json();

        // MOSTRAR INFO
        vistaProducto.innerHTML = `

            <h3 class="mb-3">
                ${producto.nombre || "Sin nombre"}
            </h3>

            <hr>

            <p>
                <strong>Ref Interna:</strong>
                ${producto.ref_interna || "N/A"}
            </p>

            <p>
                <strong>Ubicación:</strong>
                ${producto.ubicacion || "Sin ubicación"}
            </p>

            <p>
                <strong>Tipo:</strong>
                ${producto.tipo || "Sin tipo"}
            </p>

            <p>
                <strong>Stock:</strong>
                ${producto.stock || 0}
            </p>

            <p>
                <strong>Descripción:</strong>
                ${producto.descripcion || "Sin descripción"}
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