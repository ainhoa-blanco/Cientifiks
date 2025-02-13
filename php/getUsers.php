<?php

// Configuración de cabeceras
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Incluir archivo que maneja la conexión a la base de datos
include 'bd.php';

error_reporting(E_ALL); 
ini_set('display_errors', 1);

try {
    // Abrir conexión a la base de datos
    $conexion = openBd();

    // Consulta SQL
    $query = "SELECT r.usuari_id, 
                     u.username,
                     r.joc_id, 
                     SUM(r.punts) AS punts_por_juego,
                     t.total_punts
              FROM ranking r
              JOIN (
                  SELECT usuari_id, 
                         SUM(punts) AS total_punts
                  FROM ranking
                  WHERE joc_id IN (1, 2, 3, 4, 5)
                  GROUP BY usuari_id
                  ORDER BY total_punts DESC
                  LIMIT 10
              ) t ON r.usuari_id = t.usuari_id
              INNER JOIN usuari u ON r.usuari_id = u.id
              WHERE r.joc_id IN (1, 2, 3, 4, 5)
              GROUP BY r.usuari_id, r.joc_id
              ORDER BY t.total_punts DESC, r.usuari_id, r.joc_id;";

    // Preparar y ejecutar la consulta
    $stmt = $conexion->prepare($query);
    $stmt->execute();

    // Obtener los resultados
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Cerrar la conexión
    closeBd($conexion);

    // Procesar y estructurar los datos
    $data = [];
    foreach ($ranking as $row) {
        $usuari_id = $row['usuari_id'];
        if (!isset($data[$usuari_id])) {
            $data[$usuari_id] = [
                'usuari_id' => $usuari_id,
                'username' => $row['username'],
                'total_punts' => $row['total_punts'],
                'juegos' => []
            ];
        }
        $data[$usuari_id]['juegos'][] = [
            'joc_id' => $row['joc_id'],
            'punts' => $row['punts_por_juego']
        ];
    }

    // Convertir datos a array numérico
    $response = array_values($data);

    // Devolver la respuesta en formato JSON
    echo json_encode([
        'status' => 'success',
        'data' => $response
    ]);
} catch (Exception $e) {
    // Manejar errores
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
