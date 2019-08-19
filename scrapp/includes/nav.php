<?php
/**
 * Created by PhpStorm.
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

<!-- Navbar -->
<nav class="navbar navbar-burger navbar-fixed-top is-transparent" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="<?php echo BASE_URI; ?>/scrapp/">big5games</a>
            <span class="sr-only">Toggle navigation</span>
            <button class="icon icon-menu burger-menu"></button>
        </div>
        <div class="menu-wrapper">
            <div class="overlay-menu flex flex-middle">
                <ul class="navigation" role="menubar">
                    <li role="menuitem"><a href="<?php echo BASE_URI; ?>/scrapp/rugby">Rugby</a></li>
                    <li role="menuitem"><a href="<?php echo BASE_URI; ?>/scrapp/soccer">Soccer</a></li>
                </ul>
            </div>
        </div>
    </div>
</nav>
<!-- Content -->