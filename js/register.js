            // Obtener el parámetro 'codi' de la URL
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let urlParam = urlParams.get("codi");

            const messageElement = document.getElementById("message");
            // Verificar el valor de 'codi' y mostrar el mensaje correspondiente
            if (urlParam === "0") {
                messageElement.textContent = "Usuario ya existe";
            } else if (urlParam === "1") {
                // Redirigir al index.html si 'codi' es 0
                window.location.href = "index.html";
            }