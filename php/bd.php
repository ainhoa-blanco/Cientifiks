<?php
session_start();

function openBd(){

    $servername = "***";
    $username = "***";
    $pass = "***";

    $connexio = new PDO("mysql:host=$servername;dbname=b31_37391808_cientifiks", $username, $pass);
    $connexio->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $connexio->exec("SET NAMES 'utf8'");

    return $connexio;
}


function closeBd($conexion) {
$conexion = null;


return $conexion;
}

// function insertPuntos($usuari_id, $joc_id, $punts, $temps) {
//     $conexion = openBd();

//     // Preparar la consulta de inserción o actualización
//     $sentenciaText = "
//         INSERT INTO ranking (usuari_id, joc_id, punts, temps)
//         VALUES (:usuari_id, :joc_id, :punts, :temps)
//         ON DUPLICATE KEY UPDATE
//         punts = VALUES(punts), temps = VALUES(temps)
//     ";
//     $sentencia = $conexion->prepare($sentenciaText);

//     // Enlazar parámetros
//     $sentencia->bindParam(':usuari_id', $usuari_id);
//     $sentencia->bindParam(':joc_id', $joc_id);
//     $sentencia->bindParam(':punts', $punts);
//     $sentencia->bindParam(':temps', $temps);

//     // Ejecutar la consulta
//     $sentencia->execute();

//     $conexion = closeBd($conexion);
//     return true; // Operación realizada con éxito
// }

function insertRegister($username, $pass) {
    $conexion = openBd();

    // Verificar si el usuario ya existe
    $sentenciaText = "select * from usuari where username = :username";
    $sentencia = $conexion->prepare($sentenciaText);
    $sentencia->bindParam(':username', $username);
    $sentencia->execute();

    // Si ya existe un usuario con ese nombre
    if ($sentencia->rowCount() > 0) {
        $conexion = closeBd($conexion);
        return 0; // Usuario ya existe
    }

    // Si no existe, proceder a insertar
    $tipoUsuari = 1;
    $pass = password_hash($pass, PASSWORD_DEFAULT);

    $sentenciaText = "insert into usuari (username, password, tipus_usuari_id) VALUES ( :username, :pass, :tipoUsuari)";
    $sentencia = $conexion->prepare($sentenciaText);

    $sentencia->bindParam(':username', $username);
    $sentencia->bindParam(':pass', $pass);
    $sentencia->bindParam(':tipoUsuari', $tipoUsuari);

    $sentencia->execute();
    $lastId = $conexion->lastInsertId();

    $_SESSION['actualUser'] = $lastId;

    $conexion = closeBd($conexion);
    return 1; // Usuario registrado correctamente
}

function login($username, $pass) {
    $conexion = openBd();

    $sentenciaText = "select * from usuari where username = :username";
    $sentencia = $conexion->prepare($sentenciaText);
    $sentencia->bindParam(':username', $username);
    $sentencia->execute();


    if ($sentencia->rowCount() > 0) {
        $usuario = $sentencia->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($pass, $usuario['password'])) {
            $_SESSION['actualUser'] = $usuario['id'];
            return 0;
        } else {
            

            return 1;
        }
    } else {
        
        return 2;
    }


    $conexion = closeBd($conexion);
}


?>
