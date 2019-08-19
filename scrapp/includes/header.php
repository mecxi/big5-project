<?php
/**
 * User: Mecxi
 * Date: 3/6/2017
 * Time: 2:53 PM
 */

/* check if the page is been requested directly */
if (!defined('BASE_URI')){
    require_once('../../config.php');
    /* redirect to the dashboard */
    header('location:'. BASE_URI . '/scrapp');
    exit();
}

?>

<!DOCTYPE html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <title>big5games</title>
    <meta name="description" content="HTML5 Landing Page Template">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Filip Greksa">

    <!-- FONTS -->
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700,900' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Dosis:300,400,700,800' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="<?php echo ASSETS; ?>css/entypo.css">

    <!-- CSS -->
    <link rel="stylesheet" href="<?php echo ASSETS; ?>css/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo ASSETS; ?>css/slick.css">
    <link rel="stylesheet" href="<?php echo ASSETS; ?>css/magnific-popup.css">
    <link rel="stylesheet" href="<?php echo ASSETS; ?>css/main.css">
    <!-- custom -->
    <link rel="stylesheet" href="<?php echo ASSETS; ?>custom/css/custom.css">

    <!-- Favicon -->
    <link rel="apple-touch-icon" href="<?php echo ASSETS; ?>img/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="<?php echo ASSETS; ?>img/favicon.png">

    <script src="<?php echo ASSETS; ?>js/vendor/modernizr.js"></script>

</head>
<body>

<!-- Preloader -->
<div class="preloader flex flex-middle flex-center">
    <div class="wrapper">
        <div class="loader"></div>
    </div>
</div>


