<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$pdo = new PDO('mysql:host=localhost;port=3306;dbname=wakfuclasse;charset=utf8', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (!isset($_POST['classe'])) {
    echo json_encode(["error" => "Nom de classe manquant"]);
    exit;
}

$table = preg_replace('/[^a-zA-Z0-9_]/', '', $_POST['classe']);

$columns = [
    "Titre", "Version", "Code_deck", "Code_apti", "Lien_zenith",
    "Role", "PointFort", "PointNeutre", "Point Faible", "BurstT2", "Burst_T1_T3"
];

// Images (ne pas update si vide)
$images = [
    "Image_cra", "Image_cra_skin", "Image_zenith_wakfu", "img_rotation_opti_detaille"
];

$data = [];
$setParts = [];

foreach ($columns as $col) {
    $val = $_POST[$col] ?? "";
    $setParts[] = "`$col` = :$col";
    $data[$col] = $val;
}

foreach ($images as $img) {
    if (!empty($_FILES[$img]['name'])) {
        $filename = "uploads/" . basename($_FILES[$img]['name']);
        move_uploaded_file($_FILES[$img]['tmp_name'], "../../image/" . basename($filename));
        $setParts[] = "`$img` = :$img";
        $data[$img] = $filename;
    }
}

$sql = "UPDATE `$table` SET " . implode(", ", $setParts) . " LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute($data);

echo json_encode(["success" => true, "message" => "Données mises à jour avec succès."]);
