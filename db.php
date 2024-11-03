<?php
$dsn = 'sqlite:path project.db'; // แทนที่ด้วย path ของฐานข้อมูลของคุณ
try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
