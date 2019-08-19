/**
 * Created by Mecxi on 2/28/2017.
 */

/*
 * @project: Big5game - ESPN Screen Scrapper
 * @author: Mecxi Musa
 * @version: 1.0
 * @history:
 * 1.1 : added missing player reference option on missing match scrapping
 * 1.2 : improve UI and fix related bugs
 *
 */


function espn_scrapper_2017(obj, timer, process_stat){
    setTimeout(function(){
        /* clean global variables */
        if (timer != undefined) {
            players = []; team = [];
        }

        $.ajax({
            url: server + '/big5/fetcher.php',
            data: JSON.stringify({
                link: obj.link
            }),
            type: 'POST',
            success: function (result) {
                scrapper_log.append(current_timestamp() + 'Scrapping URL : '+ obj.link+'<br>');
                process_scrapping_result_17(result, obj, process_stat);
            },
            error: function () {
                console.log('Error connecting to the server');
                scrapper_log.append(current_timestamp() + 'Error connecting to server<br>');
            }
        });

    }, (timer == undefined) ? 1000 : (20000 * timer));
}
/* global variables */
var players = [];
var team = [];
/* process scrapping result 2017 */
function process_scrapping_result_17(result, obj, process_stat){
    /* initialise the base url */
    var base_url = 'http://www.espn.co.uk';
    var el = $('<div></div>');
    el.html(result);
    /* Determine the workflow */
    switch (obj.flow){
        case 1:
            // no redirect needed process data
            /*** Get today match fixture ***/
            //var today_fixture = $('title', el).text();
            scrapper_log.append(current_timestamp() + 'Today Fixture : '+ $('title', el).text() +'<br>');
            /** Get today match score, team **/
            if (get_today_match(el, team) === true){
                /*** Get today linesup-appearances **/
                get_appearances_linesup(el, players);
                /* get the player stats link and create a second flow */
                if (players.length > 0 && team.length > 0){
                    obj.link = base_url + get_player_stat_link(el);
                    obj.flow = 2;
                    espn_scrapper_2017(obj, undefined, process_stat);
                } else {
                    scrapper_log.append(current_timestamp() + 'Enable to continue - could not read current URL: '+obj.link+'<br>');
                }
            } else {
                scrapper_log.append(current_timestamp() + 'Enable to continue - could not read today fixture URL: '+obj.link+'<br>');
            }

            break;
        case 2:
            /* add extra scores, try, assist, conversions, goals */
            if (r_17_add_try_assist_conv_dropgoal(el, players)){
                scrapper_log.append(current_timestamp() + 'Scrapping Players score for both teams completed successfully.<br>');

                /* create a stats object */
                var legA = {}, legB = {};
                /* initialise */
                legA.team = []; legA.team.push(team[0]);
                legA.lineups = [];
                legB.team = []; legB.team.push(team[1]);
                legB.lineups = [];
                for(var i=0; i < players.length; ++i){
                    if (i < 26){
                        if (players[i][2] == 'Team' || players[i][2] == 'Replacements'){}
                        else {
                            legA.lineups.push({
                                no:players[i][0],
                                pos:players[i][1],
                                name:players[i][2],
                                appearance:players[i][3],
                                tries:players[i][4],
                                assist:players[i][5],
                                conv:players[i][6],
                                dgoal:players[i][7],
                                pgoal:players[i][8]
                            });
                        }
                    } else {
                        if (players[i][2] == 'Team' || players[i][2] == 'Replacements'){}
                        else {
                            legB.lineups.push({
                                no:players[i][0],
                                pos:players[i][1],
                                name:players[i][2],
                                appearance:players[i][3],
                                tries:players[i][4],
                                assist:players[i][5],
                                conv:players[i][6],
                                dgoal:players[i][7],
                                pgoal:players[i][8]
                            });
                        }
                    }
                }

                /* load into global array */
                var espn_match = [];
                espn_match.push(legA);
                espn_match.push(legB);
                //console.log(espn_match);
                //alert("CHECK FINAL");

                scrapper_log.append(current_timestamp() + 'Starting processing scrapping result<br>');
                /* process and update the scrapping result */
                process_espn_result(espn_match, process_stat);

            } else {
                scrapper_log.append(current_timestamp() + 'An internal error occurred scoring players.<br>');
            }

            break;
    }
}
/* get player_stat link */
function get_player_stat_link(el){
    var link = '';
    $('#gamepackage-links-wrap ul', el).each(function(){
        var menu_list = $('<div></div>'); menu_list.html($(this));
        $('li', menu_list).each(function(){
            if ($(this).find('a').attr('name').match('playerstats') != null){
                link = $(this).find('a').attr('href');
            }
        });
    });
    return link;
}
/* get today match */
function get_today_match(el, team){

    $('#reduxion #custom-nav > .competitors', el).each(function(){
        var tracker = 0;
       $(this).children().each(function(){
            if ($(this).attr('class') != 'game-status'){
                var obj = {};
                var current_team = $('<div></div>'); current_team.html($(this));
                // add name
                $('.team-info > a', current_team).each(function(){
                    obj.name = $(this).find('span:nth-child(1)').text();
                });
                // add score
                $('.score-container > div', current_team).each(function(){
                    obj.score = $(this).text().trim();
                });
                // add type
                obj.type = (tracker == 0) ? 'HOME': 'AWAY';
                ++tracker;
                team.push(obj);
                //console.log(obj);
            }
       });
    });
    /* add winning result */
    if (team.length !== 0 ){
        if (team[0].score > team[1].score) {
            team[0].final = 'W';
            team[1].final = 'L';
        } else if (team[0].score == team[1].score){
            team[0].final = 'D';
            team[1].final = 'D';
        } else {
            team[0].final = 'L';
            team[1].final = 'W';
        }

        return true;
    } else {
        return false;
    }

}

/* get today appearances */
function get_appearances_linesup(el, players){
    /* for each lineup */
    $('#reduxion .main-content .col-one .row-wrapper > .content-tab', el).each(function(){
        var content_tab = $('<div></div>'); content_tab.html($(this));
        $('.content table', content_tab).each(function(){
            var replacements = 0;
           $(this).children().each(function(){
               if ($(this).prop('tagName') != 'CAPTION'){
                    if ($(this).prop('tagName') == 'THEAD'){
                        if ($(this).find('tr th:nth-child(1)').text().trim() == 'Replacements'){
                            players.push(['','', 'Replacements', '', '']); replacements = 1;
                        } else {
                            players.push(['','', 'Team', '0', '0', '0', '0', '0', '0']);
                        }
                    } else {
                        var table = $('<div></div>'); table.html($(this));
                        /* players appearances data */
                        $('tr', table).each(function(){
                            var td = $('<div></div>'); td.html($(this));
                            $('td', td).each(function(){
                                var span_list = $(this).find('span').contents();
                                //console.log(span_list);
                                //alert(span_list.eq(0).text() + '--'+ span_list.eq(1).text());
                                //alert('check');
                                /* get player name/pos */
                                var extra_info = span_list.eq(1).text().split(',');
                                var appear = (replacements == 0) ? ((span_list.eq(1).attr('style') == 'font-weight:bold;') ? 'FL' : 'HL'):
                                    ((span_list.eq(1).attr('style') == 'font-weight:bold;') ? 'HL': 'NL');
                                /* push found data in the current context */
                                players.push([span_list.eq(0).text().trim(), extra_info[1].trim(), extra_info[0].trim(), appear, '0', '0', '0', '0', '0']);
                            });
                        });
                    }
               }
           });
        });
    });
}

/* get try, assist, conversions */
function r_17_add_try_assist_conv_dropgoal(el, players){
    var processed = false;
    $('#reduxion .main-content .col-b > div', el).each(function(){
        if ($(this).attr('class').match('tabbedTable') != null){
           //alert($(this).find('.tab-content').html());
            var tab_content = $('<div></div>'); tab_content.html($(this).find('.tab-content').html());
            $('.table-wrap', tab_content).each(function(){
                var table = $('<div></div>'); table.html($(this));
                $('tbody tr', table).each(function(){
                    var current_row_data = []; // names, Tries, Assist, conv, penalties, drop goals converted, points
                    var td = $('<div></div>'); td.html($(this));
                    $('td', td).each(function(){
                       var c_name = $(this).find('a').text();
                        if ($(this).find('a').attr('target') == '_blank'){
                            current_row_data.push($(this).find('a').text());
                        } else {
                            current_row_data.push($(this).text().trim());
                        }
                    });
                    //console.log(current_row_data);
                    /* process current player */
                    var names = current_row_data[0].replace(/\s/g, "");
                    var pre = names.slice(0,1);
                    var lastname = names.slice(1);
                    //alert(pre + '--'+ lastname);
                    var key = is_player_matched([pre, lastname], players);
                    if ( key !== false){
                        players[key][4] = current_row_data[1];
                        players[key][5] = current_row_data[2];
                        players[key][6] = current_row_data[3];
                        players[key][7] = current_row_data[5];
                        players[key][8] = current_row_data[4];
                        //console.log(players[key]);
                        processed = true;
                    }
                    //alert('CHECK!!!!');
                });
            });

        }
    });
    return processed;
}

/* match current player */
function is_player_matched(current_player, players){

    for(var i=0; i < players.length; ++i){
        var names = players[i][2].split(' ');
        //alert('players::'+ names[0][0]+' - '+names[1]+' TO MATCH::'+current_player[0]+'--'+current_player[1]);
        if (names[1] !== undefined){
            if ((names[1].match(current_player[1]) !== null) && (names[0][0] == current_player[0])){
                //console.log(players[i][2]);
                //alert('FOUND A MATCH');
                return i;
            }
        }
    }
    return false;
}