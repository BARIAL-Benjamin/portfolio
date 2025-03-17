<?php
require_once "bd.con.php";

final class Auth extends ConnexionPDO {
    protected $email, $psw;
    public function __construct($email, $psw) {
        $this->email = $email;
        $this->psw = $psw;
    }
    public function user()
    {
        if (!isset(parent::$cnx)) {
            new parent;
        }
        $stmt = parent::$cnx->prepare("SELECT 'email', 'psw' FROM admin WHERE email = :email AND psw = :psw");
        $stmt->bindParam(':email', $this->email, PDO::PARAM_STR);
        $stmt->bindParam(':psw', $this->psw, PDO::PARAM_STR);
        $stmt->execute();
        return (array) $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function register($email, $psw) {
        if (!isset(parent::$cnx)) {
            new parent;
        }
        $stmt = parent::$cnx->prepare("INSERT INTO admin (email, psw) VALUES (:email, :psw)");
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':psw', $psw, PDO::PARAM_STR);
        return $stmt->execute();
    }
}