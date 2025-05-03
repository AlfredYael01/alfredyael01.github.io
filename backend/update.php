<?php
// Activer les erreurs pour debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/vendor/autoload.php';

use MongoDB\Client;
use MongoDB\BSON\Regex;

// Connexion MongoDB Atlas
try {
    $client = new Client(
        "mongodb+srv://bigusel3ss:Cux5dYnrGX3kZNJR@combokfu-cluster.zwpf7rz.mongodb.net/?retryWrites=true&w=majority&appName=comboKfu-cluster",
        [],
        ['serverApi' => new MongoDB\Driver\ServerApi(MongoDB\Driver\ServerApi::V1)]
    );
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion MongoDB: " . $e->getMessage()]);
    exit;
}

$db = $client->PersonnageWakfu;
$collection = $db->Information;

// Récupération des données POST
$titre = $_POST['classe'] ?? '';
if (empty($titre)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Paramètre 'classe' manquant"]);
    exit;
}

// Préparer les nouvelles données
$updateData = [
    'titre' => $_POST['titre'] ?? '',
    'version' => $_POST['version'] ?? '',
    'codeDeck' => $_POST['codeDeck'] ?? '',
    'codeApti' => $_POST['codeApti'] ?? '',
    'lienZenith' => $_POST['lienZenith'] ?? '',
    'role' => $_POST['role'] ?? '',
    'fort' => $_POST['fort'] ?? '',
    'neutre' => $_POST['neutre'] ?? '',
    'faible' => $_POST['faible'] ?? '',
    'burstT2' => $_POST['burstT2'] ?? '',
    'burstT3' => $_POST['burstT3'] ?? '',
];

// Gérer les images
$images = [];
if (isset($_FILES['imgSkin1']) && $_FILES['imgSkin1']['error'] == 0) {
    $images['imgSkin1'] = moveImage($_FILES['imgSkin1']);
}
if (isset($_FILES['imgSkin2']) && $_FILES['imgSkin2']['error'] == 0) {
    $images['imgSkin2'] = moveImage($_FILES['imgSkin2']);
}
if (isset($_FILES['imgZenith']) && $_FILES['imgZenith']['error'] == 0) {
    $images['imgZenith'] = moveImage($_FILES['imgZenith']);
}
if (isset($_FILES['imgRotation']) && $_FILES['imgRotation']['error'] == 0) {
    $images['imgRotation'] = moveImage($_FILES['imgRotation']);
}

if (!empty($images)) {
    $updateData['images'] = $images;
}

// Mise à jour dans MongoDB
try {
    $result = $collection->updateOne(
        ['titre' => new Regex('^' . preg_quote($titre) . '$', 'i')],
        ['$set' => $updateData]
    );

    if ($result->getModifiedCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Aucune modification effectuée"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur update: " . $e->getMessage()]);
}

// Fonction pour sauvegarder l'image uploadée
function moveImage($file) {
    $uploadsDir = "uploads/";
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0777, true);
    }
    $filename = basename($file['name']);
    $targetPath = $uploadsDir . $filename;
    move_uploaded_file($file['tmp_name'], $targetPath);
    return $targetPath;
}
?>
