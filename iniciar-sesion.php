    <?php
    
    include './php/bd.php';
    ?>
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

                <h1 class="tituloForms">INICIAR SESSIÓ</h1>

                <form action="./php/controller.php" method="post">
                    <div>
                        <input class="input-index" type="text" placeholder="Nom d'usuari" id="user" name="user">
                    </div>

                    <div>
                        <input class="input-index" type="password"  placeholder="Contrasenya" id="pass" name="password" required>
                    </div>

                    <button class="in-reg-boton-enviar" type="submit" name="pass">Iniciar Sessió</button>
                    <p class="p_form">No tens compte? Registra't <a class="a_form" href="registrarse.php">aquí</a></p>
                </form>

                <!-- Aquí se añadirá el mensaje dinámico en función del valor de codi -->
                <div id="message" style="color: red;"></div>

            </div>

        </div>

        <script src="js/login.js"></script>
        <script src="js/script.js"></script>
    </body>
</html>
