window.addEventListener('load', () => {
    fetch('/php/getUsers.php') // Cambia esta URL si es necesario
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            const tabla = document.querySelector('.tabla'); // Selecciona la tabla o contenedor
            for (const usuario of datos.data) {
                const tr = document.createElement('tr'); // Crea una fila (tr)

                // Agregar columnas (td) para los datos principales
                createTd(tr, usuario.username); // Columna: Nombre de usuario
                createTd(tr, usuario.total_punts); // Columna: Total de puntos

                // Agregar columnas dinámicas para los juegos
                for (let i = 1; i <= 5; i++) {
                    const juego = usuario.juegos.find((j) => j.joc_id === i);
                    createTd(tr, juego ? juego.punts : '0'); // Si no hay datos del juego, coloca 0
                }

                tabla.appendChild(tr); // Agrega la fila a la tabla
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    // Función para crear una celda (td) y agregarla a una fila (tr)
    function createTd(tr, text) {
        const td = document.createElement('td');
        td.textContent = text; // Asigna el texto a la celda
        tr.appendChild(td); // Agrega la celda a la fila
    }
});
