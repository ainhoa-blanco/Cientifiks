<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/style.css">
</head>

<body class="body_form">
    <div id="div_estrellas"></div>
        <div id="animated-clouds">
            <div class="animated-cloud left-cloud1"></div>
            <div class="animated-cloud left-cloud2"></div>
            <div class="animated-cloud right-cloud1"></div>
            <div class="animated-cloud right-cloud2"></div>
        </div>
    <div class="in-reg-container">

        <div class="in-reg-container-contenido">
            <h1 class="tituloForms">REGISTRAR-SE</h1>
            <form action="php/controller.php" method="POST">
                <div>
                    <input class="input-index" type="text" placeholder="Nom d'usuari" id="username" name="username" required>
                </div>


                <div>
                    <input class="input-index" type="password" placeholder="Contrasenya" id="pass" name="password" required>
                </div>

                <!-- <div>
                    <input class="input-index" type="email" placeholder="Ejemplo@gmail.com" id="email" name="email">
                </div>


                <div>
                    <input class="input-index" type="number" placeholder="Número de teléfono" id="phone" name="phone"
                        required>
                </div> NO ESTA EN LA BD -->

                <label class="radio-label">
                    Accepto els térmes i condicions
                    <input type="radio" id="checkbox" name="mandatoryRadio" required>

                </label>

                <button class="in-reg-boton-enviar" type="submit" name="insert">Registrar-se</button>
                <p class="p_form">Ja tens compte? Inicia sessió <a class="a_form" href="iniciar-sesion.php">aquí</a></p>
            </form>

            <div id="message" style="color: red;"></div>


        </div>
    </div>
    <script src="js/register.js"></script>
    <script src="js/script.js"></script>
</body>

</html>