const CLAVE = "qrQuest";


const estado =
    JSON.parse(
        localStorage.getItem(CLAVE) || "{}"
    );


const contenedor =
    document.getElementById(
        "ubicacionPremio"
    );


if (
    estado.piezas &&
    estado.piezas.length === 6
) {

    contenedor.innerHTML = `

        <div class="ubicacion-final">

            <h2>
                📍 Lugar del premio
            </h2>

            <p>
                <strong>
                    Dirígete a:
                </strong>
            </p>

            <p>
                AQUÍ COLOCAREMOS
                LA UBICACIÓN REAL
                DEL PREMIO.
            </p>

        </div>

    `;

} else {

    contenedor.innerHTML = `

        <div class="mensaje">

            Aún no puedes ver
            la ubicación del premio.

            <br><br>

            Primero completa
            las 6 piezas.

        </div>

    `;
}