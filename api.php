<?php
// Affichage des erreurs pour debug (désactive en prod)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Définir que la réponse est du JSON
header('Content-Type: application/json; charset=utf-8');

// Inclure l'autoload de Composer
require_once __DIR__ . '/vendor/autoload.php';

use MongoDB\Client;
use MongoDB\Driver\ServerApi;
use MongoDB\BSON\Regex;

// Connexion à MongoDB Atlas
try {
    $uri = 'mongodb+srv://bigusel3ss:Cux5dYnrGX3kZNJR@combokfu-cluster.zwpf7rz.mongodb.net/?retryWrites=true&w=majority&appName=comboKfu-cluster';
    $apiVersion = new ServerApi(ServerApi::V1);

    $client = new Client($uri, [], ['serverApi' => $apiVersion]);

    // Vérification de la connexion (ping)
    $client->selectDatabase('admin')->command(['ping' => 1]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de connexion à MongoDB: " . $e->getMessage()]);
    exit;
}

// Sélectionner base et collection
$db = $client->PersonnageWakfu;
$collection = $db->Information;

// Récupérer le paramètre "classe" dans l'URL
$classe = $_GET['classe'] ?? '';

if (empty($classe)) {
    http_response_code(400);
    echo json_encode(["error" => "Paramètre 'classe' manquant"]);
    exit;
}

// Rechercher le document correspondant
try {
    $document = $collection->findOne([
        'titre' => new Regex('^' . preg_quote($classe) . '$', 'i') // Insensible à la casse
    ]);

    if (!$document) {
        http_response_code(404);
        echo json_encode(["error" => "Classe non trouvée"]);
        exit;
    }

    // Transformer l'ObjectId en chaîne
    $documentArray = $document->getArrayCopy();
    if (isset($documentArray['_id']) && $documentArray['_id'] instanceof MongoDB\BSON\ObjectId) {
        $documentArray['_id'] = (string) $documentArray['_id'];
    }

    // Retourner les données en JSON propre
    echo json_encode($documentArray, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la recherche: " . $e->getMessage()]);
    exit;
}
?>
