<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET['classe'])) {
    echo json_encode(['error' => 'Classe non définie']);
    exit;
}

$classe = preg_replace('/[^a-zA-Z0-9_]/', '', $_GET['classe']); // sécurité

try {
    $pdo = new PDO('mysql:host=localhost;port=3306;dbname=wakfuclasse;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM `$classe` LIMIT 1");
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode($data);
    } else {
        echo json_encode(['error' => "Aucune donnée trouvée pour la classe $classe"]);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur PDO : ' . $e->getMessage()]);
    exit;
}
