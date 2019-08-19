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
$option = (isset($params['option'])) ? $params['option']: null;
/* extra params */
$team_param = (isset($params['team'])) ? $params['team']: null;
$player_param= (isset($params['player'])) ? $params['player']: null;

switch($option){
    case 'team':
        /* populate all team on the select option */
        echo (is_null($option)) ? json_encode(array('error'=>'Enable to retrieve teams')) :
            json_encode(array('result'=> super_rugby::get_all_team()));
        break;
    case 'players':
        /* populate players for the selected team option */
        $teams = ($team_param) ? explode(' ', $team_param) : 0;
        echo (is_null($option) || is_null($team_param)) ? json_encode(array('error'=>'Enable to retrieve players - check the team: '.$team_param)) :
            json_encode(array('result'=> super_rugby::get_players((is_array($teams)) ? end($teams) : 0)));
        break;
    case 'reference':
        /* add current player reference */
        $players = (isset($player_param['name'])) ? explode(' ', $player_param['name']) : 0;
        echo (is_null($option) || is_null($player_param)) ? json_encode(array('error'=>'Enable to update players reference')) :
            json_encode(array('result'=> super_rugby::update_player_reference($player_param['id'], $players)));
        break;
    case 'lookup':
        /* populate lookup players */
        echo (is_null($option)) ? json_encode(array('error'=>'Enable to retrieve lookup players')) :
            json_encode(array('result'=> super_rugby::get_lookup_players()));
        break;
    case 'deletelookup':
        /* populate lookup players */

        echo (is_null($option)) ? json_encode(array('error'=>'Enable to process your request')) :
            json_encode(array('result'=> super_rugby::delete_lookup_players($player_param['id'])));
        break;
        break;
    default:
        echo json_encode(array('error'=>'Wrong parameters specified'));
        break;
}

