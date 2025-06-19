<?php
include_once("../config/bd.php");

$action = $_REQUEST['action'] ?? '';

if ($action == 'read') {
    $sql = "SELECT * FROM prueba.venta ORDER BY ven_ide DESC";
    $res = pg_query($conexion, $sql);

    $data = array();
    while ($row = pg_fetch_assoc($res)) {
        $data[] = $row;
    }

    echo json_encode(array("data" => $data));
}

if ($action == 'create') {
    $ser = $_POST['ven_ser'];
    $num = $_POST['ven_num'];
    $cli = $_POST['ven_cli'];
    $mon = $_POST['ven_mon'];

    $sql = "INSERT INTO prueba.venta (ven_ser, ven_num, ven_cli, ven_mon)
            VALUES ('$ser', '$num', '$cli', '$mon') RETURNING ven_ide";
    $res = pg_query($conexion, $sql);
    $row = pg_fetch_assoc($res);

    echo json_encode(array("ven_ide" => $row['ven_ide']));
}

if ($action == 'update') {
    $ide = $_POST['ven_ide'];
    $ser = $_POST['ven_ser'];
    $num = $_POST['ven_num'];
    $cli = $_POST['ven_cli'];
    $mon = $_POST['ven_mon'];

    $sql = "UPDATE prueba.venta SET ven_ser='$ser', ven_num='$num', ven_cli='$cli', ven_mon='$mon'
            WHERE ven_ide = '$ide'";
    pg_query($conexion, $sql);

    echo json_encode(array("success" => true));
}

if ($action == 'save_detalle') {
    $ide = $_POST['v_d_ide'];
    $ven = $_POST['ven_ide'];
    $pro = $_POST['v_d_pro'];
    $uni = $_POST['v_d_uni'];
    $can = $_POST['v_d_can'];
    $est = $_POST['est_ado'];

    if ($ide == 0) {
        $sql = "INSERT INTO prueba.venta_detalle (ven_ide, v_d_pro, v_d_uni, v_d_can, est_ado)
                VALUES ('$ven', '$pro', '$uni', '$can', '$est')";
    } else {
        $sql = "UPDATE prueba.venta_detalle SET v_d_pro='$pro', v_d_uni='$uni', v_d_can='$can', est_ado='$est'
                WHERE v_d_ide = '$ide'";
    }

    pg_query($conexion, $sql);
    echo json_encode(array("success" => true));
}

if ($action == 'read_detalle') {
    $ven = $_REQUEST['ven_ide'];
    $sql = "SELECT * FROM prueba.venta_detalle WHERE ven_ide = '$ven' AND est_ado = 1 ORDER BY v_d_ide";
    $res = pg_query($conexion, $sql);

    $data = array();
    while ($row = pg_fetch_assoc($res)) {
        $data[] = $row;
    }

    echo json_encode(array("data" => $data));
}

if ($action == 'delete') {
    $ven = $_POST['ven_ide'];

    $sql1 = "UPDATE prueba.venta SET ven_ser='ANULADO' WHERE ven_ide = '$ven'";
    $sql2 = "UPDATE prueba.venta_detalle SET est_ado = 0 WHERE ven_ide = '$ven'";

    pg_query($conexion, $sql1);
    pg_query($conexion, $sql2);

    echo json_encode(array("success" => true));
}
?>
