<?php
/**
 * data fetcher
 * */

/* set display errors */
error_reporting(E_ALL); ini_set('display_errors', 1);
/* set time zone */
date_default_timezone_set("Africa/Johannesburg");

function curlHTTPRequest($url, $params=null){
    /* initialise curl resource */
    $curl = curl_init();

    /* result container, whether we are getting a feedback form url or an error */
    $result = null;

    /* set resources options for GET REQUEST */
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $url,
        CURLOPT_CONNECTTIMEOUT => 10000, //attempt a connection within 10sec
        CURLOPT_FAILONERROR => 1,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_POST => 1,
        CURLOPT_HTTPHEADER => array('Content-Type: text/xml; charset=utf-8'),
        CURLINFO_HEADER_OUT => 1,
        CURLOPT_POSTFIELDS => $params,
        CURLOPT_FOLLOWLOCATION => 1
    ));


    /* execute curl */
    $result = curl_exec($curl);

    if(curl_error($curl)){
        $result = 'Error: "' . curl_error($curl) . '" - Code: ' . curl_errno($curl)
            . ' - HTTP HEADER INFO - '. print_r(curl_getinfo ( $curl), true);
    }
    /* close request to clear up some memory */
    curl_close($curl);

    /* return the result */
    return $result;
}

function process_request($url){
    $html = curlHTTPRequest($url);
    $config = array('indent' => TRUE,
        'output-xhtml' => TRUE,
        'wrap' => 200);

    $parse_html = tidy_parse_string($html, $config, 'UTF8');
    $parse_html->cleanRepair();
    return trim(preg_replace("/(<\/?)(\w+):([^>]*>)/", "$1$2$3", $parse_html));
}

/* retrieve required parameters */
$params = json_decode(file_get_contents('php://input'), true);

echo (is_null($params)) ? 'parameter empty' :
    (count($params) == 1 && (isset($params['link']))) ? process_request($params['link']) : 'Wrong parameter submitted. Please review';
