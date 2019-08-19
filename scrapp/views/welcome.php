<?php
/**
 * @provider: big5games
 * User: Mecxi
 * Date: 3/6/2017
 * Time: 3:47 PM
 */

/* check if the page is been requested directly */
if (!defined('BASE_URI')){
    require_once('../../config.php');
    /* redirect to the dashboard */
    header('location:'. BASE_URI . '/scrapp');
    exit();
}
?>

<!-- Welcome -->
<header class="header hero flex flex-middle flex-center" role="banner">
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <hgroup class="title-group">
                    <h1 class="bigtitle">Welcome to Big5games Scrapper</h1><br>
                    <h4>Pick Category</h4>
                </hgroup>
                <div class="welcome">
                    <button class="btn btn-default rounded" role="button">Rugby</button>
                    <button class="btn btn-default rounded" role="button">Soccer</button>
                </div>
            </div>
        </div>
    </div>
</header>
