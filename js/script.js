// crear posicion aleatoria
function crearEstrellaRandom() {
    const estrella = document.createElement('img');

    var ruta = window.location.pathname;
    var pagina = ruta.split("/").pop();

    if (pagina == "index.html" || pagina == "" || pagina == "niveles.html" || pagina == "iniciar-sesion.php" || pagina == "registrarse.php") {
        estrella.src = "imagenes/landing/estrella.png";
    }else{
        estrella.src = "../../imagenes/landing/estrella.png";
    }
    
    estrella.className = 'estrella';
      
    // tamaño aleatorio
    const mida = Math.floor(Math.random() * 20) + 5; 
    estrella.style.width = `${mida}px`;
    estrella.style.height = `${mida}px`;

    // obtener el div "primera_parte"
    const contenedor = document.getElementById('div_estrellas');
    
    // posicion aleatoria dentro del div
    const ampleDiv = contenedor.clientWidth;
    const alturaDiv = contenedor.clientHeight;
    const posicioX = Math.random() * ampleDiv;
    const posicioY = Math.random() * alturaDiv;
    estrella.style.left = `${posicioX}px`;
    estrella.style.top = `${posicioY}px`;

    // animación
    estrella.style.animation = `creixerDecreixer ${Math.random() * 2 + 1}s infinite`;

    // agregar la estrella al div
    contenedor.appendChild(estrella);

    // visibilidad true
    estrella.style.opacity = 1;
}

// generar X estrellas
function generarEstrelles() {
    for (let i = 0; i < 50; i++) {
        crearEstrellaRandom();
    }
}

// llamada a la función
generarEstrelles();

function subir() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToHistoria() {
    const section = document.getElementById("historia");
    section.scrollIntoView({ behavior: "smooth" });
}

function scrollToQuiSom() {
    const section = document.getElementById("quisom");
    section.scrollIntoView({ behavior: "smooth" });
}

/*BOTON PARA ATRAS GENERAL*/

function goBack() {
    window.location.href = '/index.html';
}

/*NIVELES*/
// Al cargar la página, revisar y desbloquear niveles basados en el progreso guardado
// document.addEventListener('DOMContentLoaded', () => {
//     for (let i = 2; i <= 5; i++) {
//         if (localStorage.getItem(`nivel${i - 1}Completado`) === 'true') {
//             document.getElementById(`boton-joc${i}`).disabled = false;
//         }
//     }
// });

// Función para desbloquear el siguiente nivel
// function unlockLevel(nextLevel) {
//     localStorage.setItem(`nivel${nextLevel - 1}Completado`, 'true');
//     document.getElementById(`boton-joc${nextLevel}`).disabled = false;

//     // Redirigir al nivel seleccionado
//     location.href = `./juegos/nivel${nextLevel - 1}/pantalla-precarga-nivel${nextLevel - 1}.html`;
// }