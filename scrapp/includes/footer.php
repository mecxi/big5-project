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

<!-- Footer -->
<footer class="footer" role="contentinfo">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
<!--                <ul class="social-list">-->
<!--                    <li><a href="#" class="icon icon-facebook"></a></li>-->
<!--                    <li><a href="#" class="icon icon-twitter"></a></li>-->
<!--                    <li><a href="#" class="icon icon-pinterest"></a></li>-->
<!--                    <li><a href="#" class="icon icon-flickr"></a></li>-->
<!--                    <li><a href="#" class="icon icon-dribbble"></a></li>-->
<!--                    <li><a href="#" class="icon icon-behance"></a></li>-->
<!--                </ul>-->
                <nav class="foter-navbar" role="navigation">
                    <ul class="footer-nav" role="menubar">
                        <li role="menuitem"><a href="#">Rugby</a></li>
                        <li role="menuitem"><a href="#">Soccer</a></li>
<!--                        <li role="menuitem"><a href="#">Press</a></li>-->
<!--                        <li role="menuitem"><a href="#">Contact</a></li>-->
<!--                        <li role="menuitem"><a href="#">Terms</a></li>-->
<!--                        <li role="menuitem"><a href="#">Privacy</a></li>-->
                    </ul>
                </nav>
                <p class="copyright">big5games Scrapper version 1.2</a></p>
            </div>
        </div>
    </div>
</footer>

<!-- Scripts
–––––––––––––––––––––––––––––––––––––––––––––––––– -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="<?php echo ASSETS; ?>js/vendor/jquery-1.11.3.min.js"><\/script>')</script>
<script src="<?php echo ASSETS; ?>js/bootstrap.min.js"></script>

<script src="<?php echo ASSETS; ?>js/vendor/jquery.appear.js"></script>
<script src="<?php echo ASSETS; ?>js/vendor/slick.min.js"></script>
<script src="<?php echo ASSETS; ?>js/vendor/jquery.countTo.js"></script>
<script src="<?php echo ASSETS; ?>js/vendor/jquery.parallax.min.js"></script>
<script src="<?php echo ASSETS; ?>js/vendor/jquery.magnific-popup.min.js"></script>

<script src="<?php echo ASSETS; ?>js/main.js"></script>
<script>
    /* initialise the back-end server */
    var server = "<?php echo LOCALHOST; ?>";
    var base_uri = server + '/big5/scrapp';
</script>
<script src="<?php echo ASSETS; ?>custom/js/custom.js"></script>
<?php
/*
 * Load only required scrapper modules
 */
switch($view){
    case 'rugby.php':
        echo '<script src="'. BASE_URI .'/scrapp/modules/espn_scrapper_2016.js"></script><script src="'. BASE_URI .'/scrapp/modules/espn_scrapper_2017.js"></script>';
        break;
}
?>
</body>
</html>