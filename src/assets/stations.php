<?php
$pdo = new PDO("mysql:dbname=skimap;host=localhost;charset=utf8mb4", "root", "password");

$sql = <<<'SQL'
SELECT 
    s.id, s.nom,
	altitude_maxi, altitude_mini, pistes, remontee 
    ,ST_X(`location`) as lng, ST_Y(`location`) as lat
FROM 
    skimap_stations s
WHERE
    massif=:massif
SQL;

$statement = $pdo->prepare($sql);
$statement->bindParam(':massif', $_GET['massif'], PDO::PARAM_INT);
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);
