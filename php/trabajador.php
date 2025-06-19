<?php
include_once("../config/bd.php");

$action = $_REQUEST['action'] ?? '';

if ($action == 'lista') {
    $sql = "SELECT * FROM prueba.trabajador WHERE est_ado = 1 ORDER BY tra_ide DESC";
    $resultado = pg_query($conexion, $sql);

    $data = array();
    while ($fila = pg_fetch_assoc($resultado)) {
        $data[] = $fila;
    }

    echo json_encode(array("data" => $data));
}

if ($action == 'insertar') {
    $cod = $_POST['tra_cod'];
    $nom = $_POST['tra_nom'];
    $pat = $_POST['tra_pat'];
    $mat = $_POST['tra_mat'];

    $sql = "INSERT INTO prueba.trabajador (tra_cod, tra_nom, tra_pat, tra_mat)
            VALUES ('$cod', '$nom', '$pat', '$mat')";
    $res = pg_query($conexion, $sql);

    echo json_encode(array("success" => $res ? true : false));
}

if ($action == 'modificar') {
    $ide = $_POST['tra_ide'];
    $cod = $_POST['tra_cod'];
    $nom = $_POST['tra_nom'];
    $pat = $_POST['tra_pat'];
    $mat = $_POST['tra_mat'];

    $sql = "UPDATE prueba.trabajador SET tra_cod = '$cod', tra_nom = '$nom', tra_pat = '$pat', tra_mat = '$mat'
            WHERE tra_ide = '$ide'";
    $res = pg_query($conexion, $sql);

    echo json_encode(array("success" => $res ? true : false));
}

if ($action == 'eliminar') {
    $ide = $_POST['tra_ide'];

    $sql = "UPDATE prueba.trabajador SET est_ado = 0 WHERE tra_ide = '$ide'";
    $res = pg_query($conexion, $sql);

    echo json_encode(array("success" => $res ? true : false));
}
?>
