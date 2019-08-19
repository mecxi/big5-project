<?php
/**
 * big5game:: Print Request Handler
 * User: Mecxi
 * Date: 2/22/2017
 * Time: 11:20 PM
 */

require_once('config.php');

/* retrieve required parameters */
$requested_job = (isset($_POST['job'])) ? $_POST['job'] : null;
$team_selected = (isset($_POST['team'])) ? $_POST['team']: null;

/* determine incoming job request */
switch($requested_job){
    case 'CSV':
        /* job - print CSV */
        /* output headers so that the file is downloaded rather than displayed */
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=superrugby_2017_scores.csv');

        /* create a file pointer connected to the output stream */
        $output = fopen('php://output', 'w');

        /* fetch data */
        $rugby_report = super_rugby::fetch_data((is_null($team_selected)) ? 'all' : $team_selected);
        if ($rugby_report){
            /* find table header within the result */
            $column_headers = null;
            foreach($rugby_report[0] as $col_head => $value){
                $column_headers[] = $col_head;
            }

            /* output the column headings */
            fputcsv($output, $column_headers);

            /* insert data into CSV */
            for ($i=0; $i < count($rugby_report); ++$i){
                fputcsv($output, $rugby_report[$i]);
            }
        }

        break;
    case 'RESETDB':
        /* Reset appearances to zero in db */
        /* check user input request */
        $user_input = (isset($_POST['teams'])) ? $_POST['teams'] : null;
        //var_dump($user_input);
        /* process user reset request */
        if (is_null($user_input) || !$user_input){
            /*Reset all data */
            if (super_rugby::reset_data() > 0){
                echo json_encode(array('result'=> 'Database have been reset successfully. Use print button to view the data in CSV'));
            } else {
                echo json_encode(array('result'=>'Database record already been reset'));
            }
        } else {
            /* check user input data */
            if (strpos($user_input, ',') !== false){
                $input = explode(',', $user_input);
                if (count($input) < 2 || count($input) > 2){
                    echo json_encode(array('result'=>'Error resetting database. Please check your input only 2 teams required'));
                } else {
                    $rows_modified = super_rugby::reset_data($input);
                    if ($rows_modified > 0){
                        echo json_encode(array('result'=> 'Records successfully reset. Modified no.: '.$rows_modified.'.  Use print button to view the data in CSV'));
                    } else {
                        echo json_encode(array('result'=>'Record already been reset or given teams not found in database'));
                    }
                }
            } else {
                echo json_encode(array('result'=>'Error resetting database. Please check your input only 2 teams required'));
            }
        }
        break;
}
