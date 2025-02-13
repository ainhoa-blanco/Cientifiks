<?php
include('bd.php');

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['juego']) || !isset($data['puntos'])) {
        throw new Exception('Datos incompletos');
    }

    $juego = $data['juego'];
    $puntos = $data['puntos'];

    $_SESSION['puntosJuego' . $juego] = $puntos;

    $usuari_id = $_SESSION['actualUser'];
    // $usuari_id = 2;
    $joc_id = $juego;
    if ($usuari_id != null) { 
        insertPuntos($usuari_id, $joc_id, $puntos);
        echo json_encode(['mensaje' => 'Puntos guardados correctamente']);
    } else {
        echo json_encode(['mensaje' => 'Necesitas haber iniciado sesión para guardar los puntos']);
    }
    
} catch (Exception $e) {
    echo json_encode(['mensaje' => $e->getMessage()]);
}

function insertPuntos($usuari_id, $joc_id, $punts) {
    $conexion = openBd();

    // Verificar si el usuario ya está en el ranking para este juego
    $sentenciaText = "SELECT punts FROM ranking WHERE usuari_id = :usuari_id AND joc_id = :joc_id";
    $sentencia = $conexion->prepare($sentenciaText);
    $sentencia->bindParam(':usuari_id', $usuari_id);
    $sentencia->bindParam(':joc_id', $joc_id);
    $sentencia->execute();

    if ($sentencia->rowCount() > 0) {
        // El usuario ya está en el ranking, verificar los puntos
        $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);
        $puntosGuardados = $resultado['punts'];

        if ($punts > $puntosGuardados) {
            // Actualizar los puntos si los nuevos puntos son superiores
            $sentenciaText = "UPDATE ranking SET punts = :punts, temps = now() WHERE usuari_id = :usuari_id AND joc_id = :joc_id";
            $sentencia = $conexion->prepare($sentenciaText);
            $sentencia->bindParam(':punts', $punts);
            $sentencia->bindParam(':usuari_id', $usuari_id);
            $sentencia->bindParam(':joc_id', $joc_id);
            if (!$sentencia->execute()) {
                throw new Exception("Error al ejecutar la consulta: " . implode(", ", $sentencia->errorInfo()));
            }
        }
    } else {
        // Insertar un nuevo registro si el usuario no está en el ranking
        $sentenciaText = "INSERT INTO ranking (usuari_id, joc_id, punts, temps) VALUES (:usuari_id, :joc_id, :punts, now())";
        $sentencia = $conexion->prepare($sentenciaText);
        $sentencia->bindParam(':usuari_id', $usuari_id);
        $sentencia->bindParam(':joc_id', $joc_id);
        $sentencia->bindParam(':punts', $punts);
        if (!$sentencia->execute()) {
            throw new Exception("Error al ejecutar la consulta: " . implode(", ", $sentencia->errorInfo()));
        }
    }

    $conexion = closeBd($conexion);
    return true;
}
?>
