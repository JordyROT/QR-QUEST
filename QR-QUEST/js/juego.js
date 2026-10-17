
const CLAVE = "qrQuest";

const DESAFIOS = [
    {
        id: "01",
        lugar: "Biblioteca",
        pista: "Entre libros y silencio, busca donde las historias esperan."
    },
    {
        id: "02",
        lugar: "Patio central",
        pista: "Es un espacio abierto por donde se cruzan muchos caminos."
    },
    {
        id: "03",
        lugar: "Laboratorio de cómputo",
        pista: "Aquí las pantallas se encienden para convertir ideas en programas."
    },
    {
        id: "04",
        lugar: "Auditorio",
        pista: "Busca el lugar donde una sola voz puede llegar a muchas personas."
    },
    {
        id: "05",
        lugar: "Cafetería",
        pista: "Sigue el aroma de la comida y las bebidas."
    },
    {
        id: "06",
        lugar: "Laboratorio de electrónica",
        pista: "Aquí los circuitos y componentes cobran vida."
    },
    {
        id: "07",
        lugar: "Cancha deportiva",
        pista: "Aquí se cambian los libros por el movimiento y el deporte."
    },
    {
        id: "08",
        lugar: "Oficina administrativa",
        pista: "Entre documentos y trámites se encuentra la siguiente señal."
    },
    {
        id: "09",
        lugar: "Jardín",
        pista: "Busca un lugar donde el verde predomina y puedes tomar aire."
    },
    {
        id: "10",
        lugar: "Sala de estudio",
        pista: "Es un lugar para concentrarse y preparar trabajos."
    },
    {
        id: "11",
        lugar: "Entrada principal",
        pista: "Muchos comienzan y terminan aquí su recorrido por el campus."
    },
    {
        id: "12",
        lugar: "Punto de encuentro",
        pista: "Es el lugar donde varias personas pueden reunirse."
    }
];

function estadoInicial() {
    return {
        iniciado: false,
        completados: [],
        piezas: [],
        cooldowns: {},
        completado: false
    };
}

function obtenerEstado() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE));
        return datos ? { ...estadoInicial(), ...datos } : estadoInicial();
    } catch {
        return estadoInicial();
    }
}

function guardarEstado(estado) {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}

function siguienteDesafio(estado) {
    return DESAFIOS.find(d => !estado.completados.includes(d.id));
}

function iniciarJuego() {
    const estado = obtenerEstado();
    estado.iniciado = true;
    guardarEstado(estado);
    mostrarPista();
}

function mostrarPista() {
    const estado = obtenerEstado();
    const inicio = document.getElementById("inicio");
    const progreso = document.getElementById("progreso");

    if (!estado.iniciado) return;

    inicio.hidden = true;
    progreso.hidden = false;

    if (estado.completados.length === DESAFIOS.length) {
        document.getElementById("tituloPista").textContent =
            "¡Has encontrado los 12 QR!";
        document.getElementById("pistaActual").textContent =
            "Reúne las 6 piezas y escanea el QR final del rompecabezas.";
        document.getElementById("estadoJuego").textContent =
            `Piezas únicas: ${estado.piezas.length} de 6`;
        return;
    }

    const siguiente = siguienteDesafio(estado);

    document.getElementById("tituloPista").textContent =
        `Busca el QR ${siguiente.id}`;

    document.getElementById("pistaActual").textContent =
        siguiente.pista;

    document.getElementById("estadoJuego").textContent =
        `Desafíos resueltos: ${estado.completados.length} de 12 | Piezas únicas: ${estado.piezas.length} de 6`;
}

window.addEventListener("DOMContentLoaded", mostrarPista);
