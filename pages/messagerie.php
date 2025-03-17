<?php
define('ROOT', dirname(__FILE__));
require_once ROOT . "/config.php";
require_once ROOT . "/authentification.php";
if (session_status() !== PHP_SESSION_ACTIVE)
    session_start();

$email = isset($_SESSION['email']) && !empty($_SESSION['email']) ? $_SESSION['email'] : null;
$psw = isset($_SESSION['psw']) && !empty($_SESSION['psw']) ? $_SESSION['psw'] : null;

if (isset($email, $psw)) {
    $Auth = new Auth($email, $psw);
    $user = $Auth->user();
    if (isset($user) && !empty($user) && empty($user[0])) {
        include_once ROOT . "/admin_message.php";
    } else {
        echo 'Tu es un imposteur UwU';
        include_once ROOT . "/login.php";
    }
} else {
    include_once ROOT . "/login.php";
}