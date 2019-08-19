<?php
/* Process final data */

/* set display errors */
error_reporting(E_ALL); ini_set('display_errors', 1);
/* set time zone */
date_default_timezone_set("Africa/Johannesburg");

/* retrieve required parameters */
$params = json_decode(file_get_contents('php://input'), true);








