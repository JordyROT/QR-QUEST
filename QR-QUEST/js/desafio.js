
const CLAVE = "qrQuest";
const TIEMPO_ESPERA = 30;

function obtenerEstado() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE));
        return datos ? {
            iniciado: false,
            completados: [],
            piezas: [],
            cooldowns: {},
            completado: false,
            ...datos
        } : null;
    } catch {
        return null;
    }
}

function guardarEstado(estado) {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}

function bloquearPregunta(mensaje) {
    document.getElementById("resultado").textContent = mensaje;
    document.querySelectorAll(".opcion").forEach(b => b.disabled = true);
}

function comprobarAcceso() {
    const estado = obtenerEstado();

    if (!estado || !estado.iniciado) {
        bloquearPregunta("Primero debes iniciar el juego desde la página principal.");
        return;
    }

    const numero = Number(DESAFIO.id);
    const anterior = String(numero - 1).padStart(2, "0");

    if (numero > 1 && !estado.completados.includes(anterior)) {
        bloquearPregunta("Todavía no puedes resolver este desafío. Busca y completa los QR en orden.");
        return;
    }

    if (estado.completados.includes(DESAFIO.id)) {
        bloquearPregunta("Ya completaste este QR. Busca la siguiente pista en la página principal.");
        return;
    }

    const fin = estado.cooldowns[DESAFIO.id] || 0;

    if (Date.now() < fin) {
        desactivarOpciones(true);
        iniciarCuentaRegresiva(fin);
    }
}

function responder(indice) {
    const estado = obtenerEstado();

    if (!estado || !estado.iniciado) {
        bloquearPregunta("Inicia primero el juego desde la página principal.");
        return;
    }

    const numero = Number(DESAFIO.id);
    const anterior = String(numero - 1).padStart(2, "0");

    if (numero > 1 && !estado.completados.includes(anterior)) {
        bloquearPregunta("Debes completar los QR en orden.");
        return;
    }

    if (estado.completados.includes(DESAFIO.id)) {
        bloquearPregunta("Este desafío ya fue completado.");
        return;
    }

    const fin = estado.cooldowns[DESAFIO.id] || 0;

    if (Date.now() < fin) {
        iniciarCuentaRegresiva(fin);
        return;
    }

    const resultado = document.getElementById("resultado");

    if (indice === DESAFIO.correcta) {
        estado.completados.push(DESAFIO.id);

        if (!estado.piezas.includes(DESAFIO.pieza)) {
            estado.piezas.push(DESAFIO.pieza);
            estado.piezas.sort((a, b) => a - b);
        }

        estado.completado =
            estado.completados.length === 12 &&
            estado.piezas.length === 6;

        guardarEstado(estado);
        desactivarOpciones(true);

        resultado.innerHTML = `
            <div class="correcto">
                ¡Respuesta correcta!<br>
                Has conseguido la pieza ${DESAFIO.pieza}.<br>
                Desafíos resueltos: ${estado.completados.length} de 12.
            </div>
            <p>Vuelve a la página principal para leer la próxima adivinanza. Tendrás que encontrar el siguiente QR físicamente.</p>
            <a class="boton secundario" href="../index.html">
                Consultar próxima pista
            </a>
        `;

        if (estado.completado) {
            resultado.innerHTML += `
                <p>¡Has completado los 12 desafíos y reunido las 6 piezas!</p>
                <a class="boton" href="../rompecabezas.html">
                    Ver rompecabezas final
                </a>
            `;
        }

    } else {
        estado.cooldowns[DESAFIO.id] =
            Date.now() + TIEMPO_ESPERA * 1000;

        guardarEstado(estado);

        resultado.textContent =
            "Respuesta incorrecta. Espera 30 segundos para intentarlo de nuevo.";

        desactivarOpciones(true);
        iniciarCuentaRegresiva(estado.cooldowns[DESAFIO.id]);
    }
}

function desactivarOpciones(bloquear) {
    document.querySelectorAll(".opcion").forEach(b => {
        b.disabled = bloquear;
    });
}

function iniciarCuentaRegresiva(fin) {
    const elemento = document.getElementById("cooldown");
    desactivarOpciones(true);

    function actualizar() {
        const restante = Math.ceil((fin - Date.now()) / 1000);

        if (restante <= 0) {
            elemento.textContent = "Ya puedes volver a intentarlo.";
            desactivarOpciones(false);
            return;
        }

        elemento.textContent = `Espera ${restante} segundos para volver a responder.`;
        setTimeout(actualizar, 250);
    }

    actualizar();
}

window.addEventListener("DOMContentLoaded", comprobarAcceso);
