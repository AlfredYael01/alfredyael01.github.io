<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET['classe'])) {
    echo json_encode(['success' => false, 'error' => 'Classe non définie']);
    exit;
}

$classe = $_GET['classe'];
$jsonPath = __DIR__ . '/../public/data/classes-data.json';

if (!file_exists($jsonPath)) {
    echo json_encode(['success' => false, 'error' => 'Fichier JSON introuvable']);
    exit;
}

$data = json_decode(file_get_contents($jsonPath), true);

if (!isset($data[$classe])) {
    echo json_encode(['success' => false, 'error' => "Données non trouvées pour la classe $classe"]);
    exit;
}

echo json_encode($data[$classe]);
