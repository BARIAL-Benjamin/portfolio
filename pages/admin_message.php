<?php
if (session_status() !== PHP_SESSION_ACTIVE)
    session_start();

if (!isset($_SESSION['email'], $_SESSION['psw'])) {
    header("Location: /portfolio");
} else {
    $Auth = new Auth($_SESSION['email'], $_SESSION['psw']);
    $user = $Auth->user();
    if (!isset($user) || empty($user) || !empty($user[0])) {
        header("Location: /portfolio");
    }

    include_once ROOT . "/bd.con.php";

    final class Messagerie extends ConnexionPDO
    {
        public static function getAllMessages()
        {
            if (!isset(parent::$cnx)) {
                new parent;
            }
            $stmt = parent::$cnx->prepare("SELECT * FROM message");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public static function getMessagesUntreated()
        {
            if (!isset(parent::$cnx)) {
                new parent;
            }
            $stmt = parent::$cnx->prepare("SELECT * FROM message WHERE status = :status");
            $stmt->bindValue(':status', 'non traité', PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public static function getMessagesByMail($email)
        {
            if (!isset(parent::$cnx)) {
                new parent;
            }
            $stmt = parent::$cnx->prepare("SELECT * FROM message WHERE email = :email");
            $stmt->bindValue(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public static function getMessagesByName($name)
        {
            if (!isset(parent::$cnx)) {
                new parent;
            }
            $stmt = parent::$cnx->prepare("SELECT * FROM message WHERE nom = :name");
            $stmt->bindValue(':name', $name, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public static function markMessageAsTreated($id)
        {
            if (!isset(parent::$cnx)) {
                new parent;
            }
            $stmt = parent::$cnx->prepare("UPDATE message SET status = :status WHERE id = :id");
            $stmt->bindValue(':status', 'traité', PDO::PARAM_STR);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        }

        public static function deleteMessage($id): bool
        {
            if (!isset(parent::$cnx)) {
                new parent;
            }
            $stmt = parent::$cnx->prepare("DELETE FROM message WHERE id = :id");
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        }
    }

    $action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;
    $id = isset($_GET['id']) && !empty($_GET['id']) ? $_GET['id'] : null;
    $searchValue = isset($_GET['value']) && !empty($_GET['value']) ? $_GET['value'] : null;
    $all = isset($_GET['all']) && !empty($_GET['all']) ? $_GET['all'] : '0';

    $messages = isset($all) && $all == '1' ? Messagerie::getAllMessages() : Messagerie::getMessagesUntreated();

    if (isset($action)) {
        switch ($action) {
            case 'markMessageAsTreated':
                if (isset($id)) {
                    if (Messagerie::markMessageAsTreated($id)) {
                        echo "Message marqué comme traité";
                    } else {
                        echo "Erreur lors du marquage du message comme traité";
                    }
                }
                break;
            case "delete":
                if (isset($id)) {
                    if (Messagerie::deleteMessage($id)) {
                        echo "Message supprimé";
                    } else {
                        echo "Erreur lors de la suppression du message";
                    }
                }
                break;
            case "search":
                $messages = isset($searchValue) && filter_var($searchValue, FILTER_VALIDATE_EMAIL)
                    ? Messagerie::getMessagesByMail($searchValue)
                    : Messagerie::getMessagesByName($searchValue);
                break;
            default:
                echo "Méthode d'action invalide";
                break;
        }
    }

    $file = basename($_SERVER['SCRIPT_FILENAME']);

    ?>

    <!doctype html>
    <html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../css/styles.min.css">
        <link rel="shortcut icon" href="../assets/favicon.webp" type="image/webp">
        <script type="module" src="../js/app.js" defer></script>
        <title>Messagerie</title>
    </head>

    <body>
        <header id="postit">
            <nav>
                <ul>
                    <li><a data-page="../">Accueil</a></li>
                    <?php if (isset($all) && $all !== '1') { ?>
                        <li><a data-page="./<?= $file ?>?all=1">Tout voir</a></li>
                    <?php } else { ?>
                        <li><a data-page="./<?= $file ?>">Cacher les traités</a></li>
                    <?php } ?>
                    <li><a data-page="./disconnect.php">Se déconnecter</a></li>
                </ul>
            </nav>
        </header>
        <main id="content">
            <h1>Messagerie</h1>
            <form action="<?= $file ?>" method="get">
                <input type="text" name="action" value="search" hidden>
                <label for="value">Nom ou Email</label>
                <input type="text" name="value" id="value">
                <input type="submit" value="Rechercher">
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    foreach ($messages as $message) { ?>
                        <tr>
                            <td><?= $message['id'] ?></td>
                            <td><?= $message['nom'] ?></td>
                            <td><?= $message['email'] ?></td>
                            <td><?= $message['message'] ?></td>
                            <td><?= $message['status'] ?></td>
                            <td><a href="./<?= $file ?>?action=markMessageAsTreated&id=<?= $message['id'] ?>">Marquer comme traité</a></td>
                            <?php if ($message['status'] === 'traité') { ?>
                                <td><a href="./<?= $file ?>?action=delete&id=<?= $message['id'] ?>">Supprimé</a></td>
                            <?php } ?>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
            <footer><span id="copyright"></span><a href="./portfolio.apk" target="_blank" download>Télécharger l'app</a>
            </footer>
        </main>
        <div id="cur"></div>
    </body>

    </html>

<?php } ?>