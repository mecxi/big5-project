<?php
/**
 * big5game Screen Scrapper Backend updater process
 * User: Mecxi
 * Date: 2/22/2017
 * Time: 12:10 PM
 * process and update incoming screen scrapper result
 */

require_once('config.php');

/* retrieve required parameters */
$params = json_decode(file_get_contents('php://input'), true);
/* update the screen scrapper result */
$scrapper_result = (isset($params['result'])) ? $params['result']: null;
$update_errors = null;

//echo '<pre>'. print_r($scrapper_result, true).'</pre>';


if ($scrapper_result){
    /* process for each team */
    foreach($scrapper_result as $fixtures){
        $team = $fixtures['team'];
        $last_team_name = explode(' ', $team[0]['name']);
//        echo '<pre>'. print_r($last_team_name, true).'</pre>';
//        echo end($last_team_name);
        $current_team_stat = array($team[0]['type'], $team[0]['final']);
        $lineups = $fixtures['lineups'];
        /* find players linesup */
        foreach($lineups as $player){
            /* check if the player exist for the actual team */
            $player_name = explode(' ', $player['name']);

            if (super_rugby::has_player((isset($player_name[0])) ? $player_name[0] : null, (isset($player_name[1])) ? $player_name[1] : null, end($last_team_name))){
                /* update the player stats */
                super_rugby::update_player_stats(appearance_stat($player['appearance']),
                    (isset($player['tries'])) ? $player['tries'] : 0,
                    (isset($player['assist'])) ? $player['assist'] : 0,
                    $current_team_stat,
                    (isset($player['conv'])) ? $player['conv'] : 0,
                    (isset($player['dgoal'])) ? $player['dgoal'] : 0,
                    (isset($player['pgoal'])) ? $player['pgoal'] : 0,
                    $player_name[0], $player_name[1], end($last_team_name));
            } else {
                /* check first current player in the lookup table */
                $player_id = super_rugby::is_in_lookup($player_name[0], end($player_name));
                if (is_null($player_id)){
                    $update_errors[] = array('error'=> 'Enable to update current player ** <i style="background-color: #4b0000">' . $player['name']. ' | '. $team[0]['name'] .'</i> ** Name no match - Add reference');
                } else {
                    super_rugby::update_player_stats(appearance_stat($player['appearance']),
                        (isset($player['tries'])) ? $player['tries'] : 0,
                        (isset($player['assist'])) ? $player['assist'] : 0,
                        $current_team_stat,
                        (isset($player['conv'])) ? $player['conv'] : 0,
                        (isset($player['dgoal'])) ? $player['dgoal'] : 0,
                        (isset($player['pgoal'])) ? $player['pgoal'] : 0,
                        $player_name[0], $player_name[1], end($last_team_name), $player_id);
                }
            }

        }
    }
}


/* set appareance stats */
function appearance_stat($abbr){
    $stat = array('full'=>0, 'part'=>0, 'reserved'=>0);
    switch($abbr){
        case 'FL':
            $stat['full'] = '1';
            break;
        case 'HL':
            $stat['part'] = '1';
            break;
        case 'NL':
            $stat['reserved'] = '1';
            break;
    }
    return $stat;
}

echo (is_null($update_errors)) ? json_encode(array('result'=>'All players stats have been updated successfully')) :
    json_encode(array('result'=>$update_errors));