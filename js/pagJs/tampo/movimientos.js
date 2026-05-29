const API =
"https://buscador-refaccionesbackend.onrender.com";

async function cargarMovimientos(){

    try{

        const res = await fetch(

            `${API}/movimientos`

        );

        const data = await res.json();

        console.log(data);

        const tbody =
        document.getElementById("tbodyMovimientos");

        tbody.innerHTML = "";

        data.forEach((mov) => {

            tbody.innerHTML += `

                <tr>

                    <td>

                        ${new Date(mov.fecha)
                        .toLocaleString()}

                    </td>

                    <td>

                        ${mov.refinterna || ""}

                    </td>

                    <td>

                        ${mov.nombreprod || ""}

                    </td>

                    <td>

                        ${mov.cantidad}

                    </td>

                    <td>

                        ${mov.solicitado_por || ""}

                    </td>

                    <td>

                        ${mov.entregado_por || ""}

                    </td>

                    <td>

    ${mov.maquina || ""}

</td>

                </tr>

            `;

        });

    }catch(error){

        console.log(error);

        alert("Error al cargar");

    }

}

cargarMovimientos();