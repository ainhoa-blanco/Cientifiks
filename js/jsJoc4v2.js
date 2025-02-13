document.addEventListener('DOMContentLoaded', (event) => {
  const contenedor = document.getElementById('contenedor-juego');
  const gotasAgua = Array.from(document.querySelectorAll('.imagen-agua'));
  const personaje = document.querySelector('.imagen-anna');
  const espada = Array.from(document.querySelectorAll('.imagen-espada'));
  let agua = 0;
  let vida = 5;
  let tiempoRestante = 90; // Tiempo en segundos
  let dificultad = 2; // Nivel inicial de dificultad

  let vidasText = document.getElementById('textVidas');
  let scoreText = document.getElementById('textScore');
  let timerText = document.getElementById('textTimer');

  vidasText.innerHTML = vida;
  scoreText.innerHTML = agua;

  const contenedorAncho = contenedor.offsetWidth;
  const contenedorAlto = contenedor.offsetHeight;
  const invulnerabilidadDuracion = 500;
  let esInvulnerable = false;

  personaje.style.left = "50px";
  personaje.style.top = "50px";

  // Función para posicionar elementos aleatoriamente en el contenedor
  function posicionarElementoAleatoriamente(elemento) {
    const elementoAncho = elemento.offsetWidth || 50;
    const elementoAlto = elemento.offsetHeight || 50;
    const margenX = 50;
    const margenY = 50;
    const posicionX = Math.random() * (contenedorAncho - elementoAncho - margenX * 2) + margenX;
    const posicionY = Math.random() * (contenedorAlto - elementoAlto - margenY * 2) + margenY;
    elemento.style.left = `${posicionX}px`;
    elemento.style.top = `${posicionY}px`;
  }

  // Configuración inicial de enemigos
  let enemigos = [];
  function configurarEnemigos() {
    enemigos = Array.from(document.querySelectorAll('.imagen-enemigo'));
    enemigos.forEach(imagen => {
      posicionarElementoAleatoriamente(imagen);
      inicializarDireccionAleatoria(imagen);
    });
  }

  // Función para asignar una dirección inicial aleatoria
  function inicializarDireccionAleatoria(elemento) {
    elemento.dataset.velX = Math.random() < 0.5 ? -1 : 1;
    elemento.dataset.velY = Math.random() < 0.5 ? -1 : 1;
  }

  // Función para mover una imagen y hacerla rebotar en los bordes
  function moverImagen(imagen) {
    const cantidadMovimiento = 2;
    let xActual = parseFloat(imagen.style.left) || 0;
    let yActual = parseFloat(imagen.style.top) || 0;
    let velX = parseFloat(imagen.dataset.velX) || 1;
    let velY = parseFloat(imagen.dataset.velY) || 1;
    const imagenAncho = imagen.offsetWidth || 50;
    const imagenAlto = imagen.offsetHeight || 50;

    xActual += velX * cantidadMovimiento;
    yActual += velY * cantidadMovimiento;

    if (xActual <= 0 && velX < 0) velX = -velX;
    else if (xActual + imagenAncho >= contenedorAncho && velX > 0) velX = -velX;

    if (yActual <= 0 && velY < 0) velY = -velY;
    else if (yActual + imagenAlto >= contenedorAlto && velY > 0) velY = -velY;

    imagen.style.left = `${xActual}px`;
    imagen.style.top = `${yActual}px`;
    imagen.dataset.velX = velX;
    imagen.dataset.velY = velY;
  }

  // Temporizador
  const intervaloTimer = setInterval(() => {
    if (tiempoRestante > 0) {
      tiempoRestante--;
      const minutos = String(Math.floor(tiempoRestante / 60)).padStart(2, '0');
      const segundos = String(tiempoRestante % 60).padStart(2, '0');
      timerText.innerHTML = `${minutos}:${segundos}`;
    } else {
      alert("Has acabat el temps! Els teus punts son: " + agua);
      enviarPuntos("4",agua);
      clearInterval(intervaloTimer);
      clearInterval(intervaloMovimiento);
      // unlockLevel(5);
    }
  }, 1000);

  function enviarPuntos(juego, puntos) {
    fetch('/php/guardar_punts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ juego: juego, puntos: puntos })
    })

}

  // Incrementar dificultad
  const intervaloDificultad = setInterval(() => {
    dificultad++;
    enemigos.forEach(enemigo => {
      enemigo.dataset.velX *= 1.2; // Incrementa velocidad en un 20%
      enemigo.dataset.velY *= 1.2;
    });
    if (dificultad % 5 === 0) agregarEnemigos(3);
  }, 10000);

  // Intervalo para mover los enemigos y verificar colisiones
  const intervaloMovimiento = setInterval(() => {
    enemigos.forEach(imagen => moverImagen(imagen)); // Mueve los enemigos
    verificarColisiones();
  }, 30);

  // Función para agregar enemigos
  function agregarEnemigos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const enemigo = document.createElement('img');
      enemigo.classList.add('imagen-enemigo');
      enemigo.style.width = "50px";
      enemigo.style.height = "50px";
      enemigo.src = "../../imagenes/marc/Items/Item_Powerup_Enemy_18.png";
      posicionarElementoAleatoriamente(enemigo);
      inicializarDireccionAleatoria(enemigo);
      contenedor.appendChild(enemigo);
      enemigos.push(enemigo);
    }
  }

  // Movimiento del personaje siguiendo el cursor
  contenedor.addEventListener('mousemove', (e) => {
    const rect = contenedor.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const personajeAncho = personaje.offsetWidth;
    const personajeAlto = personaje.offsetHeight;

    const nuevaX = Math.min(Math.max(0, mouseX - personajeAncho / 2), contenedor.offsetWidth - personajeAncho);
    const nuevaY = Math.min(Math.max(0, mouseY - personajeAlto / 2), contenedor.offsetHeight - personajeAlto);

    personaje.style.left = `${nuevaX}px`;
    personaje.style.top = `${nuevaY}px`;
  });

  // Función para verificar colisiones
  function verificarColisiones() {
    const personajeRect = personaje.getBoundingClientRect();

    // Colisiones con gotas de agua
    gotasAgua.forEach(gota => {
      const gotaRect = gota.getBoundingClientRect();
      if (
        personajeRect.left < gotaRect.right &&
        personajeRect.right > gotaRect.left &&
        personajeRect.top < gotaRect.bottom &&
        personajeRect.bottom > gotaRect.top &&
        !esInvulnerable // Verificar si no es invulnerable
      ) {
        posicionarElementoAleatoriamente(gota);
        agua += 1;
        scoreText.innerHTML = agua;
        agregarEnemigos(2);

        // Aplicar invulnerabilidad temporal
        esInvulnerable = true;
        personaje.classList.add('invulnerable'); // Añadir clase CSS para indicar invulnerabilidad

        setTimeout(() => {
          esInvulnerable = false;
          personaje.classList.remove('invulnerable'); // Quitar clase CSS después de la duración de la invulnerabilidad
        }, invulnerabilidadDuracion);
      }
    });

    // Colisiones con la espada
    espada.forEach(espada => {
      const espadaRect = espada.getBoundingClientRect();
      if (
        personajeRect.left < espadaRect.right &&
        personajeRect.right > espadaRect.left &&
        personajeRect.top < espadaRect.bottom &&
        personajeRect.bottom > espadaRect.top
      ) {
        for (let i = 0; i < 2; i++) {
          if (enemigos.length > 0) {
            const enemigo = enemigos.pop();
            enemigo.remove();
          }
        }
        posicionarElementoAleatoriamente(espada);
      }
    });

    // Colisiones con enemigos
    enemigos.forEach(enemigo => {
      const enemigoRect = enemigo.getBoundingClientRect();
      if (
        personajeRect.left < enemigoRect.right &&
        personajeRect.right > enemigoRect.left &&
        personajeRect.top < enemigoRect.bottom &&
        personajeRect.bottom > enemigoRect.top &&
        !esInvulnerable
      ) {
        vida -= 1;
        vidasText.innerHTML = vida;
        enemigo.style.display = "none";
        personaje.style.left = "50px";
        personaje.style.top = "50px";
        esInvulnerable = true;

        document.body.classList.add('shake');

        setTimeout(() => {
          document.body.classList.remove('shake');
        }, 500);

        setTimeout(() => {
          esInvulnerable = false;
          enemigo.style.display = "block";
        }, invulnerabilidadDuracion);
        if (vida <= 0) {
          alert("Has perdut totes les vides! Els teus punts son: " + agua);
          enviarPuntos("4", agua);
          window.location.href='../../niveles.html';
        }
      }
    });
  }

  // Configuración inicial
  configurarEnemigos();
});
