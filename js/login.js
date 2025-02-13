            // Obtener el parámetro 'codi' de la URL
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let urlParam = urlParams.get("codi");

            const messageElement = document.getElementById("message");

            // Verificar el valor de 'codi' y mostrar el mensaje correspondiente
            if (urlParam === "1") {
                messageElement.textContent = "Usuario o contraseña incorrectos.";
            } else if (urlParam === "0") {
                // Redirigir al index.html si 'codi' es 0
                window.location.href = "index.html";
            } else if (urlParam === "2") {
                messageElement.textContent = "Usuario no reconocido.";
            } 