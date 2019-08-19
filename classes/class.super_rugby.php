<?php
/**
 * Big5game :: ESPN Super Rugby Object
 * User: Mecxi
 * Date: 2/22/2017
 * Time: 12:40 PM
 */

class super_rugby
{
    /* check players exists for a particular team in db */
    public static function has_player($firstname, $lastname, $team)
    {
        /* check names for single or double quote */
        $firstname = (strpos($firstname, "'") !== false) ? str_replace("'", "\'", $firstname) : $firstname;
        $lastname = (strpos($lastname, "'") !== false) ? str_replace("'", "\'", $lastname) : $lastname;

        if (is_bool(db::sql("SELECT * FROM `superrugby_2016_scores_18` WHERE first_name LIKE '$firstname%' AND last_name LIKE '$lastname%' AND Team LIKE '%$team';", DB_NAME))){
            return 0;
        } else {
            return mysqli_num_rows(db::sql("SELECT * FROM `superrugby_2016_scores_18` WHERE first_name LIKE '$firstname%' AND last_name LIKE '$lastname%' AND Team LIKE '%$team';", DB_NAME));
        }
    }

    /* update current player appearance */
    public static function update_player_stats($appearance, $tries, $assist, $team_stats, $conv, $dgoal, $pgoal, $firstname, $lastname, $team, $player_id=null)
    {
        /* initialise extra values */
        $win = ($team_stats[0] == 'HOME' && $team_stats[1] == 'W') ? 1 : 0;
        $draw = (($team_stats[0] == 'HOME' || $team_stats[0] == 'AWAY') && ($team_stats[1] == 'D')) ? 1: 0;
        $away_win = ($team_stats[0] == 'AWAY' && $team_stats[1] == 'W') ? 1 : 0;

        /* check names for single or double quote */
        $firstname = (strpos($firstname, "'") !== false) ? str_replace("'", "\'", $firstname) : $firstname;
        $lastname = (strpos($lastname, "'") !== false) ? str_replace("'", "\'", $lastname) : $lastname;

        if ($player_id){
            return db::sql("UPDATE `superrugby_2016_scores_18` SET full_appearance = '".$appearance['full']."', part_appearance = '". $appearance['part']."' , try = $tries, assist = $assist,
        win = $win, draw = $draw, away_win = $away_win, conversion = $conv, drop_goal = $dgoal, penalty = $pgoal
        WHERE player_id = '$player_id';", DB_NAME);
        } else {
            return db::sql("UPDATE `superrugby_2016_scores_18` SET full_appearance = '".$appearance['full']."', part_appearance = '". $appearance['part']."' , try = $tries, assist = $assist,
        win = $win, draw = $draw, away_win = $away_win, conversion = $conv, drop_goal = $dgoal, penalty = $pgoal
        WHERE first_name LIKE '$firstname%' AND last_name LIKE '$lastname%' AND Team LIKE '%$team';", DB_NAME);
        }

    }

    /* return all data from the table */
    public static function fetch_data($opt)
    {
        $result = ($opt == 'all') ? db::sql("SELECT * FROM `superrugby_2016_scores_18`", DB_NAME):
            db::sql("SELECT * FROM `superrugby_2016_scores_18` WHERE Team = '$opt'", DB_NAME);
        $return_result = null;
        if (mysqli_num_rows($result)){
            while(list($round, $match_id, $player_id, $first_name, $last_name, $country, $position, $bonus_points, $full_appearance, $part_appearance, $win, $draw,	$away_win, $away_draw, $try, $assist, $conversion, $penalty, $drop_goal, $yellow_card, $red_card, $man_of_the_match) = mysqli_fetch_array($result)){
                $return_result[] = array(
                    'round'=>$round,
                    'match_id'=>$match_id,
                    'player_id'=>$player_id,
                    'first_name'=>$first_name,
                    'last_name'=>$last_name,
                    'team'=>$country,
                    'position'=>$position,
                    'bonus_points'=>$bonus_points,
                    'full_appearance'=>$full_appearance,
                    'part_appearance'=>$part_appearance,
                    'win'=>$win,
                    'draw'=>$draw,
                    'away_win'=>$away_win,
                    'away_draw'=>$away_draw,
                    'try'=>$try,
                    'assist'=>$assist,
                    'conversion'=>$conversion,
                    'penalty'=>$penalty,
                    'drop_goal'=>$drop_goal,
                    'yellow_card'=>$yellow_card,
                    'red_card'=>$red_card,
                    'man_of_the_match'=>$man_of_the_match
                );
            }
        }
        return $return_result;
    }

    /* reset appearances to 0 */
    public static function reset_data($teams=null)
    {
        if (is_null($teams)){
            return db::sql("UPDATE `superrugby_2016_scores_18` SET bonus_points = 0, full_appearance = 0, part_appearance = 0, win = 0, draw = 0, away_win = 0, away_draw = 0, try = 0,
                    assist = 0, conversion = 0, penalty = 0, drop_goal = 0, yellow_card = 0, red_card = 0, man_of_the_match = 0;", DB_NAME);
        } else {
            return db::sql("UPDATE `superrugby_2016_scores_18` SET bonus_points = 0, full_appearance = 0, part_appearance = 0, win = 0, draw = 0, away_win = 0, away_draw = 0, try = 0,
                    assist = 0, conversion = 0, penalty = 0, drop_goal = 0, yellow_card = 0, red_card = 0, man_of_the_match = 0 WHERE Team IN ('".trim(strtolower($teams[0]))."', '".trim(strtolower($teams[1]))."');", DB_NAME);
        }
    }

    /* populate select option team for CSV printing */
    public static function get_all_team()
    {
        $result = db::sql("SELECT DISTINCT Team FROM `superrugby_2016_scores_18`;", DB_NAME);
        $all_team = null;
        if (mysqli_num_rows($result)){
            while(list($team) = mysqli_fetch_array($result)){
                $all_team[] = $team;
            }
        }
        return $all_team;
    }

    /* fetch lookup players */
    public static function get_lookup_players()
    {
        $result = db::sql("SELECT player_id, firstname, lastname FROM `super_rugby_lookup_names` ORDER BY firstname;", DB_NAME);
        $player_reference = null;
        if (mysqli_num_rows($result)){
            while(list($player_id, $firstname, $lastname)=mysqli_fetch_array($result)){
                $player_reference[] = array('id'=>$player_id, 'firstname'=>$firstname, 'lastname'=>$lastname);
            }
        }
        return $player_reference;
    }

    public static function delete_lookup_players($id)
    {
        if (db::sql("DELETE FROM `super_rugby_lookup_names` WHERE player_id = '$id'", DB_NAME)){
            return array('Player has been deleted in the lookup successfully!');
        } else {
            return array('Enable to complete your request');
        }
    }

    /* get players for selected team */
    public static function get_players($team)
    {
        $result = db::sql("SELECT player_id, first_name, last_name FROM `superrugby_2016_scores_18` WHERE Team = '$team' ORDER BY first_name;", DB_NAME);
        $player_reference = null;
        if (mysqli_num_rows($result)){
            while(list($player_id, $firstname, $lastname) =  mysqli_fetch_array($result)){
                $player_reference[] = array('id'=>$player_id, 'firstname'=>$firstname, 'lastname'=>$lastname);
            }
        }
        return $player_reference;
    }

    /* update current player reference */
    public static function update_player_reference($id, $player)
    {
        $firstname = (strpos($player[0], "'") !== false) ? str_replace("'", "\'", $player[0]) : $player[0];
        $lastname = (strpos(end($player), "'") !== false) ? str_replace("'", "\'", end($player)) : end($player);

        if (mysqli_num_rows(db::sql("SELECT * FROM `super_rugby_lookup_names` WHERE player_id = '$id' ;", DB_NAME))){
            /* a manual update is required */
            return array('<i style="background-color: #4b0000">Internal error</i> - enable to reference '.  $player[0].' '.$player[1]);
        } else {
            if (is_int(db::sql("INSERT INTO `super_rugby_lookup_names` (player_id, firstname, lastname) VALUES ('$id', '$firstname', '$lastname')", DB_NAME))){
                return array($player[0].' '.$player[1].' has been added to lookup list successfully! Re-run current operation');
            } else {
                return array('<i style="background-color: #4b0000">Internal error</i> - enable to reference '.  $player[0].' '.$player[1]);
            }
        }
    }

    /* find unmatch players on the lookup table */
    public static function is_in_lookup($firstname, $lastname)
    {
        $firstname = (strpos($firstname, "'") !== false) ? str_replace("'", "\'", $firstname) : $firstname;
        $lastname = (strpos($lastname, "'") !== false) ? str_replace("'", "\'", $lastname) : $lastname;

        $result = db::sql("SELECT player_id FROM `super_rugby_lookup_names` WHERE firstname = '$firstname' AND lastname = '$lastname';", DB_NAME);
        if (mysqli_num_rows($result)){
            while(list($player_id) = mysqli_fetch_array($result)){
                return $player_id;
            }
        }
        return null;
    }
}