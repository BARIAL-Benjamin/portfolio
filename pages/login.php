<?php

$onRegister = isset($_GET['register']) && !empty($_GET['register']) && $_GET['register'] == '1';
$email = isset($_POST['email']) && !empty($_POST['email']) ? $_POST['email'] : null;
$psw1 = isset($_POST['psw1']) && !empty($_POST['psw1']) ? $_POST['psw1'] : null;

if (!$onRegister) {
    if (isset($email, $psw1)) {
        $email = (string) filter_var(filter_var(trim(strip_tags($email)), FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL);
        $pswH = password_hash($psw1, PASSWORD_DEFAULT);
        $Auth = new Auth($email, $pswH);
        $user = $Auth->user();
        if (!empty($user)) {
            if (session_status() !== PHP_SESSION_ACTIVE)
                session_start();
            $_SESSION['email'] = $email;
            $_SESSION['psw'] = $pswH;
            header('Location: /portfolio/pages/messagerie.php');
        } else {
            echo "Impossible de vous identifier !";
        }
    }
} else {
    $psw2 = isset($_POST['psw2']) && !empty($_POST['psw2']) ? $_POST['psw2'] : null;
    if (isset($email, $psw1, $psw2)) {
        $email = (string) filter_var(filter_var(trim(strip_tags($email)), FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL);
        if ($psw1 == $psw2) {
            if (preg_match('/[a-zA-Z0-9&._\-\*]{8,}/', $psw1)) {
                $pswH = password_hash($psw1, PASSWORD_DEFAULT);
                if (Auth::register($email, $pswH)) {
                    if (session_status() !== PHP_SESSION_ACTIVE)
                        session_start();
                    $_SESSION['email'] = $email;
                    $_SESSION['psw'] = $pswH;
                    echo "Enregistrement réussie";
                } else {
                    echo "Impossible de vous enregistrer !";
                }
            }
        } else {
            echo "Les deux mots de passes ne correspondent pas";
        }
    }
}

$action = "./" . basename($_SERVER['SCRIPT_FILENAME']);

?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../css/styles.min.css">
    <link rel="shortcut icon" href="../assets/favicon.webp" type="image/webp">
    <script type="module" src="../js/app.js" defer></script>
    <title><?= $onRegister ? "Enregistrement" : "Identification" ?></title>
</head>

<body>
    <header id="postit">
        <nav>
            <ul>
                <li><a data-page="../">Accueil</a></li>
                <li><a data-page="cv.html">CV</a></li>
                <li><a data-page="portfolio.html">Portfolio</a></li>
                <li><a data-page="contact.html">Contact</a></li>
                <li><a data-page="competences.html">Compétences</a></li>
                <li><a data-page="messagerie.php">Messagerie</a></li>
                <?php if (isset($_SESSION['mail'], $_SESSION['psw'])) { ?>
                    <li><a data-page="admin_message.php">Messagerie</a></li>
                <?php } ?>
            </ul>
        </nav>
    </header>
    <main id="content">
        <h1><?= $onRegister ? "Enregistrement" : "Identification" ?></h1>
        <?php if (!$onRegister) { ?>
            <a href="<?= $action ?>?register=1">S'enregistrer</a>
        <?php } else { ?>
            <a href="<?= $action ?>">S'identifier</a>
        <?php } ?>
        <form action="<?= $action ?>" method="post">
            <label for="email">Votre email</label>
            <input type="email" name="email" id="email" value="benjamin@test.com">
            <label for="psw1">Votre mot de passe</label>
            <input type="password" name="psw1" id="psw1" value="12345678">
            <?php if ($onRegister) { ?>
                <label for="psw2">Confirmer</label>
                <input type="password" name="psw2" id="psw2" value="12345678">
                <input type="submit" value="S'enregistrer">
            <?php } else { ?>
                <input type="submit" value="S'identifier">
            <?php } ?>
        </form>
        <footer><span id="copyright"></span><a href="./portfolio.apk" target="_blank" download>Télécharger l'app</a>
        </footer>
    </main>
    <div id="cur"></div>
</body>

</html>