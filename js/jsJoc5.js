const container = document.getElementById('joc5part2');
let punts = 300;
let tempsRestant = 59;
let velocitatRata = 5;
const tempsText = document.getElementById('temps_ainhoa');

function iniciarContador() {
    const interval = setInterval(() => {
        const minuts = Math.floor(tempsRestant / 60);
        const segons = tempsRestant % 60;
        tempsText.textContent = `Temps: ${minuts}:${segons < 10 ? '0' : ''}${segons}`;

        if (tempsRestant <= 0) {
            document.querySelectorAll('.murcielago').forEach(murcielago => {
                murcielago.src = '../../imagenes/ainhoa/murcielago.png';
            });
            const anna = document.getElementById('anna_gif');
            anna.src = '../../imagenes/ainhoa/annaSaltant.png';
            anna.style.height = "440px";
            setTimeout(() => {
                enviarPuntos("5", punts);
                clearInterval(interval);
                alert("Temps acabat!");
                window.location.href = '../../index.html';
            }, 100)
        } else {
            tempsRestant--;
        }
    }, 1000);
}


function saltarAnna() {
    const anna = document.getElementById('anna_gif');
    let saltant = false;
    let teclaPresionada = false;

    function saltar() {
        if (!saltant) {
            saltant = true;
            anna.src = '../../imagenes/ainhoa/annaSaltant.png';
            anna.style.height = "440px";
            anna.style.transform = "translateY(-200px)";

            setTimeout(() => {
                anna.src = '../../imagenes/ainhoa/anna.gif';
                anna.style.height = "420px";
                anna.style.transform = "translateY(0)";
                setTimeout(() => {
                    saltant = false;
                }, 500);
            }, 500);
        }
    }

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space" && !teclaPresionada) {
            teclaPresionada = true;
            saltar();
            event.preventDefault();
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.code === "Space") {
            teclaPresionada = false; // tornar a poder presionar espai
        }
    });
}

function desapareixerTuberia() {
    const tuberia = document.getElementById('tuberia_ainhoa');
    tuberia.style.left = `0px`;

    const intervaltuberia = setInterval(() => {
        const posicioTuberia = parseInt(tuberia.style.left, 10);
        tuberia.style.left = `${posicioTuberia - 5}px`;

        if (posicioTuberia <= -tuberia.offsetWidth) {
            tuberia.remove();
            clearInterval(intervaltuberia);
        }
    }, 30);
}

function moureTerra() {
    const terra = document.getElementById('terra_ainhoa');
    const terra2 = document.getElementById('terra_ainhoa2');
    terra.style.left = `0px`;
    terra2.style.left = `${terra.offsetWidth}px`;

    setInterval(() => {
        const posicioTerra = parseInt(terra.style.left, 10);
        const posicioTerra2 = parseInt(terra2.style.left, 10);
        terra.style.left = `${posicioTerra - 5}px`;
        terra2.style.left = `${posicioTerra2 - 5}px`;

        if (posicioTerra <= -terra.offsetWidth) {
            terra.style.left = `${container.offsetWidth}px`; // reposicio del terra a la dreta
        } else if (posicioTerra2 <= -terra2.offsetWidth) {
            terra2.style.left = `${container.offsetWidth}px`;
        }

    }, 20);
}

function crearRata() {
    const rata = document.createElement('img');
    rata.src = '../../imagenes/ainhoa/rata.png';
    rata.alt = "rata";
    rata.className = 'rata';
    rata.style.position = 'absolute';
    rata.style.top = `720px`;
    rata.style.left = `2000px`;
    rata.colisionado = false;
    container.appendChild(rata);

    const moureRata = setInterval(() => {
        const posicioActual = parseInt(rata.style.left, 10);
        rata.style.left = `${posicioActual - velocitatRata}px`;

        if (posicioActual < -200) {
            clearInterval(moureRata);
            rata.remove();
        } else {
            verificarColision(rata);
        }
    }, 5);
}

function crearMurcielago() {
    const murcielago = document.createElement('img');
    murcielago.src = '../../imagenes/ainhoa/murcielago.gif';
    murcielago.alt = "murcielago";
    murcielago.className = 'murcielago';
    murcielago.style.position = 'absolute';
    murcielago.style.top = `250px`;
    murcielago.style.left = `2000px`;
    murcielago.colisionado = false;
    murcielago.style.height = `100px`;
    container.appendChild(murcielago);

    const moureMurcielago = setInterval(() => {
        const posicioActual = parseInt(murcielago.style.left, 10);
        murcielago.style.left = `${posicioActual - velocitatRata}px`; // tmb x el murcielago

        if (posicioActual < -200) {
            clearInterval(moureMurcielago);
            murcielago.remove();
        } else {
            verificarColision(murcielago);
        }
    }, 5);
}

function verificarColision(animal) {
    const anna = document.getElementById('anna_gif');
    const annaRect = anna.getBoundingClientRect();
    const animalRect = animal.getBoundingClientRect();

    if (
        annaRect.left < animalRect.right &&
        annaRect.right > animalRect.left &&
        annaRect.top < animalRect.bottom &&
        annaRect.bottom > animalRect.top &&
        !animal.colisionado
    ) {
        container.classList.add('shake');
        restarVida();
        animal.colisionado = true;
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
    }
}

function restarVida() {
    const anna = document.getElementById('anna_gif');
    punts -= 25;

    const punts_info = document.getElementById('vides_ainhoa');
    punts_info.textContent = `Punts: ${Math.max(punts, 0)}`;

    if (punts <= 0) {
        punts_info.textContent = `Punts: 0`;
        anna.src = '../../imagenes/ainhoa/annaSaltant.png';

        document.querySelectorAll('.murcielago').forEach(murcielago => {
            murcielago.src = '../../imagenes/ainhoa/murcielago.png';
        });

        anna.style.position = "relative";
        anna.style.top = "185px";
        anna.style.height = "465px";

        setTimeout(() => {
            alert("Has perdut");
            window.location.href = window.location.href;
        }, 100);
    }
}

function reduirVelocitat() {
    setInterval(() => {
        velocitatRata -= 0.5; // aumenta velocitat murcielago y rata
    }, 20000);
}

function iniciarAparicionRatasYMurcielagos() {
    crearRata(); // pk la 1a rata apareixi inmediatament
    setTimeout(crearMurcielago, 750) //pk el 1r ratpanat apareixi entre la 1a y 2a rata
    setInterval(() => {
        crearRata();
        setTimeout(crearMurcielago, 750); // pk el ratpanat apareixi entre les rates (alternat)
    }, 1500);
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

function jugar() {
    iniciarContador();
    saltarAnna();
    desapareixerTuberia();
    moureTerra();
    iniciarAparicionRatasYMurcielagos();
    reduirVelocitat();
}

jugar();