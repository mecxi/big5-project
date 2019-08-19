<?php
/**
 * @provier: Big5games
 * User: Mecxi
 * Date: 3/6/2017
 * Time: 3:39 PM
 */

/* check if the page is been requested directly */
if (!defined('BASE_URI')){
    require_once('../../config.php');
    /* redirect to the dashboard */
    header('location:'. BASE_URI . '/scrapp');
    exit();
}
?>

<main class="main" role="main">
<!-- Your Page Content Here -->
<section class="section">
    <div class="container">
        <!-- title -->
        <div class="row">
            <div class="col-md-12">
                <hgroup class="title-group text-center">
                    <h3 class="section-title">Super Rugby 2016/2017</h3>
                    <h5 class="subtitle">Mutliple Urls are now supported</h5>
                </hgroup>
            </div>
        </div>
        <!-- log / references options -->
        <div class="row">
            <!-- log -->
            <div class="col-md-7">
                <h4 class="title">Log</h4>
                <div class="col-md-12 log-box"><span></span></div>
                <h4>&nbsp;</h4>
                <div class="form-group">
                    <textarea class="form-control" id="url_area" placeholder="Enter url. Separate multiple urls with comma"></textarea>
                </div>
                <div class="btn-duo">
                    <button class="btn btn-default rounded" role="button">Start Scrapping</button>
                    <button class="btn btn-default rounded" role="button">Reset Database</button>
                </div>

            </div>
            <!-- references -->
            <div class="col-md-5">
                <div class="col-xs-12">
                    <h4 class="title">Look Up Reference</h4>
                    <h5 class="subtitle">Reference Match Settings:</h5>
                    <label class="radio-inline radio-opt"><input type="radio" name="accuracy" value="0" checked><span class="subtitle">By firstname</span></label>
                    <label class="radio-inline radio-opt"><input type="radio" name="accuracy" value="1"><span class="subtitle">By lastname</span></label>
                    <label class="radio-inline radio-opt"><input type="radio" name="accuracy" value="2"><span class="subtitle">By none</span></label>
                    <h5 class="subtitle">Current player being referenced:</h5>
                </div>
                <div class="col-xs-6">
                    <label for="team_reference">Referenced Team</label>
                    <select id="team_reference" class="form-control"><option value="0">Select Team</option></select>
                </div>
                <div class="col-xs-6">
                    <label for="players_reference">Referenced Player</label>
                    <select id="players_reference" class="form-control"><option value="0">Select a player</option></select>
                </div>
                <h4>&nbsp;</h4>
                <div class="col-xs-12 referenced-box">
                    <!-- Collapse -->
<!--                    <div class="panel panel-default">-->
<!--                        <div class="panel-heading" role="tab">-->
<!--                            <h4 class="panel-title">-->
<!--                                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#" aria-expanded="false">-->
<!--                                    Dave Lolohea | New South Wales Waratahs-->
<!--                                </a>-->
<!--                            </h4>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="panel panel-default">-->
<!--                        <div class="panel-heading" role="tab">-->
<!--                            <h4 class="panel-title">-->
<!--                                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#" aria-expanded="false">-->
<!--                                    Second Question-->
<!--                                </a>-->
<!--                            </h4>-->
<!--                        </div>-->
<!--                    </div>-->
                    <!-- / Collapse end -->
                </div>
            </div>
        </div>
        <!-- print / lookup -->
        <div class="row">
            <div class="col-md-7">
                <h4>&nbsp;</h4>
                <div class="col-xs-6">
                    <select id="team_print_option" class="form-control"><option value="all">Print All</option></select>
                </div>
                <div class="col-xs-6">
                    <button class="btn btn-default rounded" role="button">Print CSV</button>
                </div>
            </div>
            <div class="col-md-5">
                <h4>&nbsp;</h4>
                <div class="col-xs-6">
                    <select id="lookup_players" class="form-control"><option value="0">Look Up List</option></select>
                </div>
                <div class="col-xs-6">
                    <button class="btn btn-default rounded" role="button">Delete Lookup Reference</button>
                </div>
            </div>
        </div>
        <!-- data-table references -->
        <div class="row">
        </div>
    </div>
</section>

</main>