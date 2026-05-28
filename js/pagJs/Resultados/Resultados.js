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

<div class="producto-detalle">

    <!-- HEADER -->
    <div class="producto-top">

        <div>

            <div class="producto-badges">

                <span class="badge-original">
                    Original
                </span>

            </div>

            <h2 class="producto-titulo">
                ${producto.nombreprod || "Sin nombre"}
            </h2>

            <p class="producto-subtitulo">
                ${producto.palclave || "Sin descripción"}
            </p>

            <div class="producto-estados">

    ${producto.completada ? `
        <span class="estado-badge completada">
            ✅ Completada
        </span>
    ` : ''}

    ${producto.en_envio ? `
        <span class="estado-badge envio">
            🚚 En envío
        </span>
    ` : ''}

    ${producto.destacada ? `
        <span class="estado-badge destacada">
            ⭐ Seguimiento
        </span>
    ` : ''}

    ${producto.alerta_activa ? `
        <span class="estado-badge alerta">
            🚨 Alerta activa
        </span>
    ` : ''}

</div>

        </div>

        <div class="producto-stock-box">

            <span class="stock-badge">
                En existencia (${producto.cantidad || 0})
            </span>

        </div>

    </div>

    <!-- CONTENIDO -->
    <div class="producto-grid">

        <!-- IMAGEN -->
        <div class="producto-imagen-box">

            <img 
                src="${producto.imagen || "https://via.placeholder.com/500x400?text=Sin+Imagen"}"
                class="producto-imagen"
            >

        </div>

        <!-- INFO -->
        <div class="producto-info-box">

            <div class="info-row">
                <span>Ref Interna</span>
                <strong>${producto.refinterna || "N/A"}</strong>
            </div>

            <div class="info-row">
                <span>Ubicación</span>
                <strong>${producto.ubicacion || "N/A"}</strong>
            </div>

            <div class="info-row">
                <span>Tipo</span>
                <strong>${producto.unidad || "N/A"}</strong>
            </div>

            <div class="info-row">
                <span>Stock</span>
                <strong>${producto.cantidad || 0}</strong>
            </div>

            <div class="info-row">
                <span>Palabras clave</span>
                <strong>${producto.palclave || "N/A"}</strong>
            </div>

        </div>

    </div>

    <!-- UBICACION -->
    <div class="ubicacion-box">

        <div class="ubicacion-header">

            <div>
                <h4>Ubicación en almacén</h4>

                <span class="ubicacion-code">
                    ${producto.ubicacion || "Sin ubicación"}
                </span>
            </div>

        </div>

    </div>

    <!-- BOTONES -->
    <div class="producto-actions">

        <button class="btn-apple primary">
            Ver detalles completos
        </button>

        <button class="btn-apple">
            Agregar a lista
        </button>

        <button class="btn-apple">
            Imprimir ubicación
        </button>

    </div>

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