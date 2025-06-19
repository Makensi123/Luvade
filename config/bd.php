<?php

$db_server = "localhost";
$db_user = "postgres";
$db_name = "prueba";
$db_password = "admin";
$db_puerto = "5432";

$conexion = pg_connect("host=$db_server port=$db_puerto dbname=$db_name user=$db_user password=$db_password");

if (!$conexion) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

?>