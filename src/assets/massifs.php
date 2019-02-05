<?php
$pdo = new PDO("mysql:dbname=skimap;host=localhost;charset=utf8mb4", "root", "password");

$sql = <<<'SQL'
SELECT 
    m.id, m.nom, m.pays, p.drapeau ,count(s.id) as stations
FROM 
    skimap_massifs m
INNER JOIN 
    skimap_stations s ON (s.massif = m.id)
INNER JOIN 
    pays p ON (p.code = m.pays)
GROUP BY 
    m.id, m.nom, m.pays, p.drapeau
ORDER BY
    pays
SQL;

$statement = $pdo->prepare($sql);
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);
