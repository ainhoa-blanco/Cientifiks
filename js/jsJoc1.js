const tamanoPez = 30; // Tamaño del pez en px
let posicionPez = { x: 300, y: 300 }; // Posición inicial del pez
let posicionGusano = obtenerPosicionAleatoria(); // Posición inicial del gusano
let puntuacion = 0; // Puntuación en gusanos comidos
let respuestasCorrectas = 0;
let intervaloJuego;
let direccion = { x: 0, y: 0 }; // Dirección inicial

let cronometroIniciado = false; // Indica si el cronómetro ha empezado
let tiempoInicial = 0; // Tiempo inicial para calcular la diferencia
let intervaloCronometro; // Variable para almacenar el tiempo

let vidas = 5; // Número inicial de vidas
const vidasContainer = document.createElement('div'); // Contenedor para mostrar las vidas
vidasContainer.style.position = 'absolute';
vidasContainer.style.top = '10px';
vidasContainer.style.left = '10px';
vidasContainer.style.zIndex = '1000';
document.body.appendChild(vidasContainer);

// Configuracion de la caja de juego
const cajaJuego = document.querySelector('.j1-caja-centrada');
const pez = new Image();
pez.src = '../../imagenes/ivan/Fish_Arriba.png';
pez.style.position = 'absolute';
pez.style.width = `${tamanoPez}px`;
pez.style.height = `${tamanoPez}px`;

const gusano = new Image();
gusano.src = '../../imagenes/ivan/worm.png';
gusano.style.position = 'absolute';
gusano.style.width = `${tamanoPez}px`;
gusano.style.height = `${tamanoPez}px`;

cajaJuego.appendChild(pez);
cajaJuego.appendChild(gusano);

function iniciarJuego() {
    document.addEventListener('keydown', cambiarDireccion);
    intervaloJuego = setInterval(actualizarJuego, 200);
}

function cambiarDireccion(e) {
    if (!cronometroIniciado) {
        iniciarCronometro();
    }
    switch (e.key) {
        case 'ArrowUp':
            direccion = { x: 0, y: -tamanoPez };
            pez.style.transform = 'rotate(0deg)'; // Rotación hacia arriba
            break;
        case 'ArrowDown':
            direccion = { x: 0, y: tamanoPez };
            pez.style.transform = 'rotate(180deg)'; // Rotación hacia abajo
            break;
        case 'ArrowLeft':
            direccion = { x: -tamanoPez, y: 0 };
            pez.style.transform = 'rotate(270deg)'; // Rotación hacia la izquierda
            break;
        case 'ArrowRight':
            direccion = { x: tamanoPez, y: 0 };
            pez.style.transform = 'rotate(90deg)'; // Rotación hacia la derecha
            break;
    }
}

function mostrarVidas() {
    vidasContainer.innerHTML = ''; // Limpia las imágenes existentes
    for (let i = 0; i < vidas; i++) {
        const vidaImg = new Image();
        vidaImg.src = '../../imagenes/ivan/vidaIvan.png';
        vidaImg.style.width = '30px';
        vidaImg.style.height = '30px';
        vidaImg.style.marginRight = '5px';
        vidasContainer.appendChild(vidaImg);
    }
}

mostrarVidas();

function iniciarCronometro() {
    cronometroIniciado = true;
    tiempoInicial = Date.now();
    intervaloCronometro = setInterval(actualizarCronometro, 1000);
}

function actualizarCronometro() {
    const tiempoActual = Date.now();
    const segundosTranscurridos = Math.floor((tiempoActual - tiempoInicial) / 1000);
    const minutos = Math.floor(segundosTranscurridos / 60);
    const segundos = segundosTranscurridos % 60;
    document.getElementById('j1-temporizador').textContent = `Tiempo: ${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

function detenerCronometro() {
    clearInterval(intervaloCronometro);
    cronometroIniciado = false;
}


function actualizarJuego() {
    posicionPez.x += direccion.x;
    posicionPez.y += direccion.y;

    // Limitar el pez dentro de la caja
    if (
        posicionPez.x < 0 || posicionPez.y < 0 ||
        posicionPez.x + tamanoPez > 600 || posicionPez.y + tamanoPez > 600
    ) {
        perderVida("¡Has perdido una vida por tocar el borde!");
        return;
    }

    // Comprobar colisiones entre pez y gusano
    if (posicionPez.x === posicionGusano.x && posicionPez.y === posicionGusano.y) {
        puntuacion++;
        if (puntuacion === 4) {
            clearInterval(intervaloJuego); // Pausa el juego para la pregunta
            hacerPregunta();
        } else {
            posicionGusano = obtenerPosicionAleatoria();
            actualizarPosiciones();
        }
    }

    actualizarPosiciones();
}
function perderVida(mensaje) {
    vidas--;
    mostrarVidas(); // Actualiza la visualización de las vidas
    posicionPez = { x: 300, y: 300 }; // Restablece la posición inicial
    direccion = { x: 0, y: 0 }; // Deten el movimiento del pez
    actualizarPosiciones();

    if (vidas === 0) {
        terminarJuego("¡Has perdido todas tus vidas!");
    } else {
        mostrarModalPerderVida(mensaje); // Muestra el modal con el mensaje cuando se choca
    }
}

function mostrarModalPerderVida(mensaje) {
    // Actualiza el mensaje en el modal
    document.getElementById('j1-mensajePerderVida').textContent = mensaje;

    // Muestra el modal
    document.getElementById('j1-modalPerderVida').style.display = 'flex';
}

function j1CerrarModalPerderVida() {
    document.getElementById('j1-modalPerderVida').style.display = 'none';
}



function actualizarPosiciones() {
    pez.style.left = `${posicionPez.x}px`;
    pez.style.top = `${posicionPez.y}px`;
    gusano.style.left = `${posicionGusano.x}px`;
    gusano.style.top = `${posicionGusano.y}px`;
}

function obtenerPosicionAleatoria() {
    const x = Math.floor(Math.random() * (600 / tamanoPez)) * tamanoPez;
    const y = Math.floor(Math.random() * (600 / tamanoPez)) * tamanoPez;
    return { x, y };
}

function calcularPuntos() {
    const tiempoActual = Date.now();
    const segundosTranscurridos = Math.floor((tiempoActual - tiempoInicial) / 1000);

    if (segundosTranscurridos <= 80) return 100;
    if (segundosTranscurridos <= 100) return 90;
    if (segundosTranscurridos <= 120) return 80;
    if (segundosTranscurridos <= 140) return 70;
    if (segundosTranscurridos <= 160) return 60;
    if (segundosTranscurridos <= 180) return 40;
    return 0; // Si supera el tiempo se lleva 0 puntos
}

// Terminar el juego y enviar la puntuación
function terminarJuego(mensaje) {
    clearInterval(intervaloJuego);
    detenerCronometro();
    document.getElementById("j1-textoFinJuego").innerText = mensaje;

    // Calcular puntos y enviarlos
    const puntos = calcularPuntos();
    console.log(`Puntuación calculada: ${puntos}`);

    // Mostrar modal de fin de juego
    document.getElementById("j1-modalFinJuego").style.display = "flex";

    if (respuestasCorrectas === 8) {
        enviarPuntos("1", puntos);
        document.getElementById("continuarBtn").style.display = "inline-block";
        document.getElementById("reiniciarBtn").style.display = "none";
    } else {
        document.getElementById("reiniciarBtn").style.display = "inline-block";
        document.getElementById("continuarBtn").style.display = "none";
    }
}

// Enviar los puntos
function enviarPuntos(juego, puntos) {
    fetch('/php/guardar_punts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ juego: juego, puntos: puntos })
    })
}


function continuarJuego() {
    window.location.href = "../../niveles.html";
}

// Reseteo del juego
function j1ReiniciarJuego() {
    document.getElementById("j1-modalFinJuego").style.display = "none";
    posicionPez = { x: 300, y: 300 };
    posicionGusano = obtenerPosicionAleatoria();
    direccion = { x: 0, y: 0 };
    puntuacion = 0;
    respuestasCorrectas = 0;
    actualizarPosiciones();
    iniciarJuego();
}

// Preguntas
function hacerPregunta() {
    const preguntas = [
        { p: "¿Cuántos días tiene una semana?", a: "A. Cinco", b: "B. Siete", c: "C. Diez", d: "D. Doce", correcto: "B" },
        { p: "¿Qué planeta es conocido como el Planeta Rojo?", a: "A. Venus", b: "B. Marte", c: "C. Júpiter", d: "D. Saturno", correcto: "B" },
        { p: "¿Cuántas patas tiene una araña?", a: "A. Seis", b: "B. Ocho", c: "C. Diez", d: "D. Doce", correcto: "B" },
        { p: "¿Qué forma tiene una gota de agua?", a: "A. Cuadrada", b: "B. Redonda", c: "C. Triangular", d: "D. Estrella", correcto: "B" },
        { p: "¿De dónde viene el agua de la lluvia?", a: "A. Del mar", b: "B. Del cielo", c: "C. De las nubes", d: "D. De los árboles", correcto: "C" },
        { p: "¿Cuál es el océano más grande del mundo?", a: "A. Atlántico", b: "B. Índico", c: "C. Ártico", d: "D. Pacífico", correcto: "D" },
        { p: "¿Qué forma de agua es visible cuando hierve?", a: "A. Sólida", b: "B. Líquida", c: "C. Gaseosa", d: "D. Plasmática", correcto: "C" },
        { p: "¿Cuál es el planeta más cercano al sol?", a: "A. Venus", b: "B. Marte", c: "C. Mercurio", d: "D. Júpiter", correcto: "C" },
        { p: "¿Cuál es el continente más grande?", a: "A. África", b: "B. Asia", c: "C. Europa", d: "D. América", correcto: "B" },
        { p: "¿Qué tipo de animal es un delfín?", a: "A. Pez", b: "B. Mamífero", c: "C. Reptil", d: "D. Ave", correcto: "B" },
        { p: "¿Cuál es el estado del agua a 0°C?", a: "A. Líquido", b: "B. Sólido", c: "C. Gaseoso", d: "D. Ninguno", correcto: "B" },
        { p: "¿Qué es el sistema solar?", a: "A. Un sistema de estrellas", b: "B. Un conjunto de planetas que giran alrededor de una estrella", c: "C. Un conjunto de lunas", d: "D. Una galaxia", correcto: "B" },
        { p: "¿Qué es un volcán?", a: "A. Una montaña cubierta de nieve", b: "B. Una abertura en la Tierra por donde sale magma", c: "C. Una formación de nubes", d: "D. Un tipo de roca", correcto: "B" },
        { p: "¿Cuántos huesos tiene el cuerpo humano?", a: "A. 206", b: "B. 150", c: "C. 250", d: "D. 300", correcto: "A" },
        { p: "¿Cuál es el río más largo del mundo?", a: "A. Amazonas", b: "B. Nilo", c: "C. Yangtsé", d: "D. Misisipi", correcto: "A" },
        { p: "¿Qué color tienen las hojas de los árboles en otoño?", a: "A. Verdes", b: "B. Marrones y naranjas", c: "C. Azules", d: "D. Blancas", correcto: "B" },
        { p: "¿Qué órgano del cuerpo humano bombea sangre?", a: "A. Cerebro", b: "B. Corazón", c: "C. Pulmón", d: "D. Hígado", correcto: "B" },
        { p: "¿Qué planeta tiene anillos a su alrededor?", a: "A. Saturno", b: "B. Júpiter", c: "C. Marte", d: "D. Urano", correcto: "A" },
        { p: "¿Qué instrumento musical tiene teclas blancas y negras?", a: "A. Guitarra", b: "B. Piano", c: "C. Violín", d: "D. Flauta", correcto: "B" },
        { p: "¿Qué parte del cuerpo humano nos permite oír?", a: "A. Ojos", b: "B. Boca", c: "C. Orejas", d: "D. Nariz", correcto: "C" },
        { p: "¿Qué es una estrella fugaz?", a: "A. Un meteorito que entra en la atmósfera terrestre", b: "B. Una estrella que brilla más de lo normal", c: "C. Un planeta pequeño", d: "D. Un cometa", correcto: "A" },
        { p: "¿Qué ave no puede volar?", a: "A. Águila", b: "B. Pingüino", c: "C. Loro", d: "D. Golondrina", correcto: "B" },
        { p: "¿Cuál es el metal más ligero?", a: "A. Oro", b: "B. Hierro", c: "C. Litio", d: "D. Cobre", correcto: "C" },
        { p: "¿Cuántos lados tiene un hexágono?", a: "A. Cinco", b: "B. Seis", c: "C. Siete", d: "D. Ocho", correcto: "B" },
        { p: "¿Qué día se celebra la Navidad?", a: "A. 31 de diciembre", b: "B. 25 de diciembre", c: "C. 1 de enero", d: "D. 24 de noviembre", correcto: "B" },
        { p: "¿Cuál es el animal terrestre más rápido?", a: "A. León", b: "B. Elefante", c: "C. Guepardo", d: "D. Tortuga", correcto: "C" }
    ];

    // Restablece los estilos para que no se mantenga el boton rojo en la siguiente pregunta
    const opciones = document.querySelectorAll(".j1-opcion");
    opciones.forEach(opcion => {
        opcion.style.backgroundColor = ""; // Restablece el color de fondo
        opcion.disabled = false;          // Habilita el botón
    });

    // Selecciona y muestra una pregunta aleatoria
    const pregunta = preguntas[Math.floor(Math.random() * preguntas.length)];
    document.getElementById("j1-textoPregunta").innerText = pregunta.p;
    opciones[0].innerText = pregunta.a;
    opciones[1].innerText = pregunta.b;
    opciones[2].innerText = pregunta.c;
    opciones[3].innerText = pregunta.d;

    document.getElementById("j1-modalPregunta").style.display = "flex";

    opciones.forEach(opcion => {
        opcion.onclick = function () {
            verificarRespuesta(opcion, pregunta.correcto);
        };
    });
}

function verificarRespuesta(opcion, respuestaCorrecta) {
    if (opcion.getAttribute("data-respuesta") === respuestaCorrecta) {
        respuestasCorrectas++;
        puntuacion = 0; // Reinicia la puntuacion de gusanos
        document.getElementById("j1-modalPregunta").style.display = "none";
        document.getElementById("j1-modalCorrecto").style.display = "flex";
        
        if (respuestasCorrectas === 8) {
            terminarJuego("¡Felicidades! Has respondido correctamente a las 8 preguntas. Pasemos al siguiente juego");
            window.location.href = "../../niveles.html";
            // unlockLevel(2);
        }
    } else {
        opcion.style.backgroundColor = "red";
        opcion.disabled = true;
    }
}

function j1CerrarModalCorrecto() {
    document.getElementById("j1-modalCorrecto").style.display = "none";
    if (respuestasCorrectas < 8) {
        iniciarJuego(); // Solo reinicia el juego si no se alcanzaron las 8 respuestas correctas
    }
}

// Inicio juego
iniciarJuego();