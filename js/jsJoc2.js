// Variables del juego
let hook = document.getElementById("hook");
let trashItems = document.querySelectorAll(".trash");
let pezItems = document.querySelectorAll(".pez")
let timerElement = document.getElementById("timer");
let scoreElement = document.getElementById("score"); // Contador de puntos
let timer = 60;
let score = 0; // Puntos iniciales
let gameInterval;
let hookMovingDown = false;

// Función para mover el gancho hacia abajo mientras el ratón esté presionado
document.body.onmousedown = function() {
    hookMovingDown = true;
};
document.body.onmouseup = function() {
    hookMovingDown = false;
};

// Actualizar el temporizador
function startTimer() {
    gameInterval = setInterval(() => {
        timer--;
        timerElement.textContent = `Tiempo: ${timer}`;
        
        if (timer <= 0) {
            clearInterval(gameInterval);
            alert(`¡Tiempo agotado! Has conseguido ${score} puntos.`);
            enviarPuntos("2", score);
            window.location.href = '../../niveles.html';
            
        }
    }, 1000);
}

// Movimiento del gancho
function moveHook() {
    let hookTop = parseInt(window.getComputedStyle(hook).top);

    if (hookMovingDown) {
        if (hookTop < window.innerHeight - 50) {
            hook.style.top = hookTop + 10 + "px";
        }
    } else {
        if (hookTop > 0) {
            hook.style.top = hookTop - 5 + "px";
        }
    }
}

// Movimiento de los objetos de basura de izquierda a derecha
function moveTrash() {
    let velocidad = 3;
    trashItems.forEach(trash => {
        let trashLeft = parseInt(window.getComputedStyle(trash).left);
        trash.style.left = (trashLeft + velocidad) % window.innerWidth + "px";
        velocidad += 1;
        if (isColliding(hook, trash)) {
            trash.style.display = "none";
           
            trash.classList.add("collected");

            setTimeout(() => {
                trash.style.display = "none";
            }, 500);

            // Sumar puntos por basura recogida
            score += 100;
            scoreElement.textContent = `Puntos: ${score}`;
        }
    });

    if (document.querySelectorAll(".trash:not(.collected)").length === 0) {
        clearInterval(gameInterval);
        alert(`¡Felicidades! Has ganado con ${score} puntos.`);
        enviarPuntos("2", score);
        window.location.href = '../../niveles.html';
        // unlockLevel(3);
        
    }
}

function movePez() {
    let velocidad = 8;
    pezItems.forEach(pez => {
        let pezRight = parseInt(window.getComputedStyle(pez).right);
        pez.style.right = (pezRight + velocidad) % window.innerWidth + "px";
        velocidad -= 1;
        if (isColliding(hook, pez)) {
            pez.style.display = "none";
           
            pez.classList.add("collected");

            setTimeout(() => {
                pez.style.display = "none";
            }, 500);

            // Restar puntos por pez recogido
            score -= 100;
            scoreElement.textContent = `Puntos: ${score}`;
        }
    });

}

// Función para verificar colisiones
function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
        rect1.bottom >= rect2.bottom ||
        rect1.bottom <= rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Iniciar el juego
function startGame() {
    startTimer();
    setInterval(moveHook, 50);
    setInterval(moveTrash, 50);
    setInterval(movePez,50);
}

startGame();

// Enviar puntos al servidor
function enviarPuntos(juego, puntos) {
    fetch('/php/guardar_punts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ juego: juego, puntos: puntos })
    });
}
