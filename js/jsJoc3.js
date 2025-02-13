sessionStorage.clear();

// reiniciar joc
function reiniciarJuego() {
    tiempoRestante = 90;
    document.getElementById("temps").textContent = "01:30";

    contadorMovimientos = 0;
    document.getElementById("moviments-fets").textContent = " 0"; // moviments fets

    movimientosRestantes = 40;
    document.getElementById("moviments-restants").textContent = ` ${movimientosRestantes}`;

    document.querySelectorAll('.grid, .grid-correcto').forEach((grid, index) => {
        let rotation = 0;
        grid.style.transform = `rotate(${rotation}deg)`;
        sessionStorage.setItem(`rotation-${index}`, rotation);
    });

    // tancar modal
    document.getElementById("customAlert").style.display = "none"; 
    intervalo = setInterval(actualizarContador, 1000);
}

// alerta game over
function mostrarAlerta(message) {
    const alertModal = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");
    const closeButton = document.getElementById("closeAlertButton");

    alertMessage.textContent = message;
    alertModal.style.display = "flex";

    closeButton.addEventListener("click", reiniciarJuego);
}

document.querySelectorAll('.grid, .grid-correcto').forEach((grid, index) => {
    let rotation = parseInt(sessionStorage.getItem(`rotation-${index}`)) || 0;
    grid.style.transform = `rotate(${rotation}deg)`;

    grid.addEventListener('click', () => {
        rotation += 90;

        //reiniciar rotació
        if (rotation === 360) {
            rotation = 0;
        }

        grid.style.transform = `rotate(${rotation}deg)`;
        sessionStorage.setItem(`rotation-${index}`, rotation);

        //contador moviments
        contadorMovimientos++;
        document.getElementById("moviments-fets").textContent = ` ${contadorMovimientos}`;

        // moviments restants
        if (movimientosRestantes > 0) {
            movimientosRestantes--;
            document.getElementById("moviments-restants").textContent = ` ${movimientosRestantes}`;
            if (movimientosRestantes === 0) {
                setTimeout(() => {
                                    mostrarAlerta("GAME OVER");
                }, 200);
            }
        }

        verificarCamino();
    });
});

//validar cami correcte
function verificarCamino() {
    let correcto = true;
    let grids = document.querySelectorAll('.grid');
    let encontradoError = false;

    grids.forEach(function(grid) {
        const rotacion = grid.getAttribute('data-rotacion');

        if (!rotacion) {
            return; 
        }
    
        if (rotacion) {
            const rotaciones = rotacion.split(',');
            const rotacionActual = parseInt(grid.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;

            if (!rotaciones.includes(rotacionActual.toString())) {
                correcto = false;
                encontradoError = true;
            }
        } 
    });

    if (!encontradoError) {
        const puntos = calcularPunts();
        enviarPuntos("3", puntos);
        setTimeout(() => {
            alert('Camino correcto!');
            window.location.href = '../../niveles.html';
        }, 200);
        // unlockLevel(4);
    }
}



// temps
let tiempoRestante = 90; 
const actualizarContador = () => {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    document.getElementById("temps").textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        mostrarAlerta("GAME OVER");
    } else {
        tiempoRestante--;
    }
};
const intervalo = setInterval(actualizarContador, 1000);

// contador moviments fets
let contadorMovimientos = 0;

// contador moviments restants
let movimientosRestantes = 40;


function calcularPunts() {
    const pesTemps = 10; 
    const pesMovimentsRestants = 5; 
    const puntsTemps = tiempoRestante * pesTemps;
    const puntsMoviments = movimientosRestantes * pesMovimentsRestants;

    const puntos = puntsTemps + puntsMoviments;

    return puntos;
}

function enviarPuntos(juego, puntos) {
    fetch('/php/guardar_punts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ juego: juego, puntos: puntos })
    })

}