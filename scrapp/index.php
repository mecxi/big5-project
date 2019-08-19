<?php
/**
 * User: Mecxi
 * Date: 3/6/2017
 * Time: 2:34 PM
 */
require_once('../config.php');

/* validate the incoming view page request */
$p = null;
if (isset($_GET['view'])){
    $p = $_GET['view'];
} else if (isset($_POST['view'])){
    $p = $_POST['view'];
}


switch($p){
    case 'rugby':
        /* rugby scrapper view */
        $view = 'rugby.php';
        break;
    case 'soccer':
        /* soccer scrapper view */
    default:
        /* welcome page */
        $view = 'welcome.php';
        break;
}

/* if the view doesn't exist redirect to dashboard */
if (!file_exists('./views/'. $view)){
    $view = 'welcome.php';
}
/* layout requested views */
include_once('./includes/header.php');
include_once('./includes/nav.php');
include_once('./views/'.$view);
include_once('./includes/footer.php');