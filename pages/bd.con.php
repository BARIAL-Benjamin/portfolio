<?php
class ConnexionPDO
{
    protected static PDO $cnx;
    private static array $env = SETTINGS["pdo"]; // Récupère les informations de connexion à la base de données
    public function __construct()
    {
        if (!empty(self::$env)) {
            try {
                self::$cnx = new PDO(self::$env['TYPE'] . ":host=" . self::$env['SERVER'] . ":" . self::$env['PORT'] . ";dbname=" . self::$env['DB'] . ";charset=UTF8", self::$env['USER'], self::$env['PASSWORD']);
                self::$cnx->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                var_dump($e->getCode(), $e->getMessage(), $e->getFile(), $e->getLine());
            }
        } else {
            die();
        }
    }
}