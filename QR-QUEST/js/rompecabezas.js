const CLAVE = "qrQuest";


function obtenerEstado() {

    const guardado =
        localStorage.getItem(CLAVE);

    if (guardado) {
        return JSON.parse(guardado);
    }

    return {
        iniciado: false,
        piezas: [],
        cooldowns: {},
        completado: false
    };
}


function mostrarPuzzle() {

    const estado = obtenerEstado();

    const piezas = estado.piezas || [];


    document.getElementById("contador")
        .textContent =
        `${piezas.length} de 6 piezas conseguidas`;


    const puzzle =
        document.getElementById("puzzle");


    puzzle.innerHTML = "";


    for (let i = 1; i <= 6; i++) {

        const div =
            document.createElement("div");


        if (piezas.includes(i)) {

            div.className =
                "pieza conseguida";

            div.innerHTML = `
                <div class="pieza-numero">
                    ${i}
                </div>

                <span>
                    Pieza ${i}
                </span>
            `;

        } else {

            div.className =
                "pieza faltante";

            div.innerHTML = `
                <span>?</span>

                <small>
                    Pieza ${i}
                </small>
            `;
        }


        puzzle.appendChild(div);
    }


    if (piezas.length === 6) {

        document
            .getElementById("premioBloqueado")
            .textContent =
            "¡Rompecabezas completo! Ya puedes conocer el lugar del premio.";

        document
            .getElementById("botonPremio")
            .classList
            .remove("oculto");
    }
}


function reiniciarJuego() {

    if (
        confirm(
            "¿Seguro que quieres borrar todo el progreso?"
        )
    ) {

        localStorage.removeItem(CLAVE);

        window.location.href =
            "index.html";
    }
}


mostrarPuzzle();