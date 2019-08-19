/**
 * Created by Mecxi on 2/26/2017.
 */

/*
 * @project: Big5game - ESPN - Super Rugby - Screen Scrapper
 * @author: Mecxi Musa
 * @version: 1.2
 * @history:
 * 1.1 : added missing player reference option on missing match scrapping
 * 1.2 : improve UI and fix related bugs
 *
 */


/* initialise common tags */
var scrapper_log = $('.log-box span');
var reference_box = $('.referenced-box');
var team_select_ref = $('#team_reference');
var player_select_ref = $('#players_reference');
var print_team_option = $('#team_print_option');

/* populate needed list */
populate_option_team();

/* reference box auto scrolling */
var log_auto_scroll = setInterval(function(){
    auto_scroll();
}, 100);


//$('#url_name').on('focusin', function(){
//    $(this).val('');
//});
//$('#teams').on('focusin', function(){
//      $(this).val('');
//});

/* start scrapping */
$('button:contains("Start Scrapping")').click(function(){
    /* check auto scroll */
    if (log_auto_scroll === false){
        log_auto_scroll = setInterval(function(){
            auto_scroll();
        }, 100);
    }
    /* clean up the scrapping logger */
    scrapper_log.html('');
    /* get user input and start scrapping process */
    start_scrapping($('#url_area').val());
});

/* Print CSV */
$('button:contains("Print CSV")').click(function(){
    /* check auto scroll */
    if (log_auto_scroll === false){
        log_auto_scroll = setInterval(function(){
            auto_scroll();
        }, 100);
    }
    request_printing_report('CSV', print_team_option.find('option:selected').val());
});

/* Reset current Databse to 0 */
$('button:contains("Reset Database")').click(function(){
    /* check auto scroll */
    if (log_auto_scroll === false){
        log_auto_scroll = setInterval(function(){
            auto_scroll();
        }, 100);
    }

    /* get user action confirmation */
    var r=confirm("Are you sure to reset current database ?");
    if (r == true){
        /* clean up the scrapping logger */
       scrapper_log.html('');
        reference_box.html('');
        team_select_ref.html('<option value="0">Select Team</option>');
        player_select_ref.html('<option value="0">Select a player</option>');
        process_reset(null);
        ///* check input request */
        //var user_input = $('#teams');
        //if (user_input.val().length === 0){
        //    process_reset(null);
        //} else {
        //    process_reset(user_input.val());
        //}
    }
});

/* delete selected lookup players */
$('button:contains("Delete Lookup Reference")').click(function(){
    /* check auto scroll */
    if (log_auto_scroll === false){
        log_auto_scroll = setInterval(function(){
            auto_scroll();
        }, 100);
    }
   var selected_option = $('#lookup_players option:selected').val();
    if (selected_option == '0'){
        scrapper_log.append(current_timestamp() + 'Please select a player in the lookup list to delete<br>');
    } else {
        delete_lookup_players(selected_option);
    }
});

/* Process reset Request */
function process_reset(user_teams){
    scrapper_log.append(current_timestamp() + 'Resetting database has started<br>');
    $.ajax({
        url: server +'/big5/job_processor.php',
        data: {'job':'RESETDB', 'teams':user_teams},
        type: 'POST',
        dataType: 'json',
        success:function(result){
            //alert(JSON.stringify(result));
            scrapper_log.append(current_timestamp() + result.result +'<br>');
        },
        error: function(){
            console.log('Error connecting to the server');
            scrapper_log.append(current_timestamp() + 'Error connecting to the server<br>');
        }
    });
}

/** start screen scrapping **/
function start_scrapping(url){
    scrapper_log.append(current_timestamp() + 'Scrapping process has started successfully.<br>');
    /* clear global variables */
    players = []; team = [];

    /* reset options no match selection */
    reference_box.html('');
   team_select_ref.html('<option value="0">Select Team</option>');
    player_select_ref.html('<option value="0">Select a player</option>');

    /* initialise targeted Super Rugby matches links - for now */
    var espn_urls = {rugby : []};

    /* check if multiple links is requested */
    if (url.match(',') !== null){
        var urls = url.split(',');
        for (var j=0; j < urls.length; ++j){
            //alert(urls[j].trim());
            espn_urls.rugby.push({link: urls[j].trim(), flow: 1});
        }
    } else {
        espn_urls.rugby.push({link: url.trim(), flow: 1});
    }

    /* Process all Super Rugby links */
    for (var i=0; i < espn_urls.rugby.length; ++i){
        /* track 2016 or 2017 espn link request */
        var scrapper_year = (espn_urls.rugby[i].link.match('en.espn.co.uk') || espn_urls.rugby[i].link.match('scrum')) ? '2016' :
            ((espn_urls.rugby[i].link.match('www.espn.co.uk') || espn_urls.rugby[i].link.match('gameId=')) ? '2017' : null);
        //alert(espn_urls.rugby[i].flow);
        if (scrapper_year == '2016'){
            espn_scrapper_2016(espn_urls.rugby[i]);
        } else if (scrapper_year == '2017'){
            /* track process for better report in the log {p_total: total process, p_current: current process being handled}*/
            espn_scrapper_2017(espn_urls.rugby[i], i, {p_total: espn_urls.rugby.length, p_current: i});
        } else {
            scrapper_log.append(current_timestamp() + 'Enable to scrap URL : '+ espn_urls.rugby[i].link+' - Error: Unsupported URL<br>');
        }
    }

}

function espn_scrapper_2016(obj, timer){
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
               process_scrapping_result_16(result, obj);
           },
           error: function () {
               console.log('Error connecting to the server');
               scrapper_log.append(current_timestamp() + 'Error connecting to the server<br>');
           }
       });
    }, (timer == undefined) ? 1000 : (20000 * timer));
}

/* process scrapping result 2017 */
function process_scrapping_result_16(result, obj){
    /* initialise the base url */
    var base_url = 'http://en.espn.co.uk';
    var el = $('<div></div>');
    el.html(result);
    /* Determine the workflow */
    switch (obj.flow){
        case 1:
            // flow 1: target the frame containing the scoring board
            $('#scrumContent iframe', el).each(function(){
                //alert($(this).attr('src'));
                obj.link = base_url + $(this).attr('src');
                obj.flow = 2;
                /* process flow 2 recursively */
                espn_scrapper_2016(obj);
            });
            break;
        case 2:
            // flow 2: Get today match stats
            /*** Get today match stats and scoring data ***/
            var today_fixture = '';
            var today_team = [];
            $('#liveMthSubNav .liveMthSubNavBG table td table tr', el).each(function(){
                var today_match = $('<div></div>'); today_match.html($(this));
                $('td:nth-child(2)', today_match).each(function(){
                    /* find today fixture */
                    if ($(this).attr('class') == 'liveSubNavText'){
                        today_fixture += $(this).first().contents().eq(1).text();
                        today_fixture += $(this).first().contents().eq(2).text();
                        //alert(today_fixture);
                    }

                    /* find today match and scoring */
                    if ($(this).attr('class') == 'liveSubNavText1'){
                        //alert($(this).first().contents().eq(2).text());
                        var objA = {};
                        var objB = {};
                        var score = $(this).first().contents().eq(2).text(); score = score.split('-');
                        objA.score = score[0]; objB.score = score[1];
                        objA.name = $(this).first().contents().eq(0).text().trim();
                        objB.name = $(this).first().contents().eq(4).text().trim();
                        /* get winning statistic */
                        objA.type = 'HOME'; objB.type = 'AWAY';
                        objA.final = (score[0] > score[1]) ? 'W': ((score[0] == score[1]) ? 'D':'L');
                        objB.final = (score[0] < score[1]) ? 'W': ((score[0] == score[1]) ? 'D':'L');
                        today_team.push(objA);
                        today_team.push(objB);
                    }
                });
            });
            scrapper_log.append(current_timestamp() + 'Today Fixture : '+ today_fixture+'<br>');
            scrapper_log.append(current_timestamp() + 'Today Match : '+ today_team[0].name+ ' VS '+ today_team[1].name+'<br>');

            //console.log(today_team);

            var team = [];
            team.push($('#liveLeft table tr td:nth-child(2) span', el).text());
            team.push($('#liveLeft table tr td:nth-child(4) span', el).text());
            //scrapper_log.append(current_timestamp() + 'Rugby teams found : '+ team[0]+ ' | '+ team[1]+'<br>');

            /* get all players appearances stats */
            var players = [];
            /** Team A linesUP **/
            $('#liveRight .tabber .tabbertab h2:contains("Teams")', el).next().find('tr:nth-child(7) td').each(function(){
                var lineups = $('<div></div>'); lineups.html($(this));
                $('.divTeams table', lineups).each(function(){
                    var appear = $('<div></div>'); appear.html($(this));
                    var start_replacement = 0;
                    $('tr', appear).each(function(){
                        var td = $('<div></div>'); td.html($(this));
                        var list = [];
                        var tracklist = 0;
                        $('td', td).each(function(){
                            /* escape td with a direct anchor from the list */
                            var td = $(this);
                            if (!td.children().attr('class')){
                                if (tracklist < 2){
                                    /* add player no. and pos. */
                                    list.push(td.text().trim());
                                    ++tracklist;
                                } else {
                                    /* check player name */
                                    if (td.find('table td a').attr('href')){
                                        //alert('anchor name found');
                                        /* add player name */
                                        list.push(td.find('table td a').text());
                                        if (start_replacement == 0){
                                            /* check appearance throughout the game */
                                            if (td.find('table td a').attr('class') == 'liveLineupTextblk'){
                                                list.push('FL'); // played full game
                                            } else {
                                                list.push('HL'); // was replaced
                                            }
                                        } else {
                                            /* players on the bunch | check if players sub-in */
                                            if (td.find('table td a').attr('class') == 'liveLineupTextblk'){
                                                list.push('HL'); // was replaced
                                            } else {
                                                list.push('NL');
                                            }
                                        }
                                    } else {
                                        //alert('anchor not found');
                                        /* check if we reach replacement category */
                                        if (td.text().trim() == 'Replacements') start_replacement = 1;
                                        list.push(td.text().trim()); //index name
                                        /* fill in blank wherever possible */
                                        list.push(''); // index appearance
                                        //console.log(list);
                                    }
                                    /* reset the tracklist */
                                    tracklist = 0;
                                }
                            }
                        });
                        /* add on the current player try/Assists/conversions  */
                        //console.log(r_16_add_try_assist_conv(el, list));
                        var extra_scoring = r_16_add_try_assist_conv(el, list);

                        if (extra_scoring.length !== 0) players.push(extra_scoring);

                    });
                });
            });

            scrapper_log.append(current_timestamp() + 'Scrapping Players lineups for both teams completed successfully.<br>');

            //console.log(players);

            //alert('check added tries for all');

            /*

             /* create a stats object */
            var legA = {}, legB = {};
            /* initialise */
            legA.team = []; legA.team.push(today_team[0]);
            legA.lineups = [];
            legB.team = []; legB.team.push(today_team[1]);
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
                            assist:players[i][5]
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
                            assist:players[i][5]
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
            process_espn_result(espn_match);
            break;
    }
}
/* add extra data to the current player try/Assists/conversions  */
function r_16_add_try_assist_conv(el, player){
    /* process conversion for current player */
    //$('#liveRight .tabber .tabbertab h2:contains("Teams")', el).next().find('tr:nth-child(5) td').each(function(){
    //    var current = $(this).contents().eq(2).text().trim();
    //    //alert('Processing try_assist_fn:: '+selected_tries.length + ' - player::'+ player[2]);
    //    /* check if given array (player) has more than 4 list of data */
    //    var conversions = (current == undefined || current == 'none' || current.length === 0) ? 0 : current;
    //
    //    /* replace array index */
    //    /* get current conversions linesup */
    //    if (typeof  conversions == 'string' && player[2] != undefined){
    //        //alert(typeof conversions + ' | '+ conversions);
    //        conversions = conversions.split(' '); // player name, conversions
    //        //alert('separted_tries='+conversions[0] + ' -- ' + conversions[1]);
    //        console.log(conversions);
    //        /* process conversions */
    //        /* find players in conversions array */
    //        var players_conv = [];
    //        for (var i=0; i < conversions.length; ++i){
    //            var cursor = conversions[i];
    //            if (cursor[0].match(/[A-Z|a-z|ü|é]/i) !== null){
    //                if (i < 2 ){
    //                    if (i < 1){
    //                        players_conv.push(conversions[i]);
    //                    } else {
    //                        players_conv[0] = conversions[0] + ' '+ conversions[i];
    //                    }
    //                } else {
    //                    players_conv.push(conversions[i]);
    //                }
    //            } else {
    //                players_conv.push(conversions[i]);
    //            }
    //        }
    //
    //        console.log(players_conv);
    //        var conv_found = 0;
    //        var added = 0;
    //        /* find a match */
    //        for (var j=0; j < players_conv.length; ++j){
    //            if (conv_found == 1) ++added;
    //            //alert(players_conv[j]);
    //            var cursor_p = players_conv[j].trim();
    //            if (cursor_p[0].match(/^\wÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÞþÐð$/) != null){
    //                if (conv_found == 1) conv_found = 0;
    //                if (player[2].match(players_conv[j]) != null){
    //                    alert('FOUND!!!');
    //                    conv_found = 1;
    //                }
    //            }
    //        }
    //
    //        if (added != 0) {
    //            players.push(added);
    //            console.log(player);
    //            alert('CHECK CONV');
    //        }
    //    }
    //});
    /* process tries, assists, yellow/red card */
    $('#liveRight .tabber .tabbertab > h2 ', el).next().each(function(){
       //if (player[2] !== undefined) alert(player[2] + '===='+$(this).prev().html());
        if ($(this).prev().text().trim() != 'Teams' && $(this).prev().text().trim() != 'Match stats'){
           $('tr', $(this).html()).each(function(){
               var tracker = 0;
               var td_data = [];
               var td = $('<div></div>'); td.html($(this));
               $('td', td).each(function(){
                   //alert($(this).html());
                    switch (tracker){
                        case 1:
                            td_data.push($(this).text().trim()); //name
                            break;
                        case 2:
                            td_data.push($(this).text().trim()); //tries/assist
                            break;
                        case 13:
                            td_data.push($(this).text().trim()); //yellow/red card
                            break;
                    }
                   ++tracker;
               });
               //console.log(td_data);
               /* process current assist, tries, yellow/red */
               if (player[2] !== undefined && (td_data[0] !== undefined && td_data[0].length !== 0)){
                   /* check if current data has surname abbr + name */
                   if (td_data[0].match(' ') !== null){
                       var name_surname = td_data[0].split(' ');
                       //alert('PROCESSING !!!!');
                       if (player[2].match(name_surname[1]) !== null && (player[2][0] == name_surname[0][0])){
                           /* push if current player array is less than 4 el */
                           var tries_assists = td_data[1].split('/');
                           if (player.length > 4){
                               player[5] = tries_assists[0]; // try
                               player[6] = tries_assists[1]; // assist
                           } else {
                               player.push(tries_assists[0]);
                               player.push(tries_assists[1]);
                           }
                       }
                   } else {
                       //alert('PROCESSING !!!!');
                       if (player[2].match(td_data[0]) !== null){
                           /* push if current player array is less than 4 el */
                           var tries_assists_p = td_data[1].split('/');
                           if (player.length > 4){
                               player[5] = tries_assists_p[0]; // try
                               player[6] = tries_assists_p[1]; // assist
                           } else {
                               player.push(tries_assists_p[0]);
                               player.push(tries_assists_p[1]);
                           }
                       }
                   }
               }
               //if (player[2] !== undefined) alert(player[2] + '==='+$(this).html());
           });
        }
    });
    return player;
}

/* process today screen scrapping */
function process_espn_result(espn_match, process_stat){
    $.ajax({
        url: server + '/big5/espn_process.php',
        data: JSON.stringify({
            result: espn_match
        }),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(result){
            //alert(JSON.stringify(result));
            //alert(typeof result.result);
            if (typeof result.result == 'string'){
                scrapper_log.append(current_timestamp() + result.result+'<br>');
                scrapper_log.append(current_timestamp() + 'Please use the below button to print the result in CSV below' + '<br>');
            } else {
                var errors = result.result;
                /* process lookup references - no match options */
                no_match_options(errors);
                for(var i=0; i < errors.length; ++i){
                    scrapper_log.append(current_timestamp() + errors[i].error + '<br>');
                }
                //console.log(process_stat);
                //alert(typeof process_stat);

                /* check current process for reporting */
                if (process_stat !== undefined){
                    var current_log = (process_stat.p_total == (process_stat.p_current + 1)) ? current_timestamp() + 'All operation have been completed successfully. You may choose to print it in CSV below' + '<br>':
                    current_timestamp() + 'Operation '+ (process_stat.p_current + 1) +' out of '+ process_stat.p_total +' has been completed ...' + '<br>';
                    scrapper_log.append(current_log);
                } else {
                    scrapper_log.append(current_timestamp() + 'Operation has been completed successfully. You may choose to print it in CSV below' + '<br>');
                }
            }
        },
        error: function(){
            console.log('Error processing the scrapping result. please report the error to the dev');
            scrapper_log.append(current_timestamp()+ 'Internal Error occurred processing the scrapping result. Retry operation or report to DEV<br>');
        }
    });
}

/* Process printing request */
function request_printing_report(format, team){
    var form = document.createElement("form");
    form.setAttribute("method", 'POST');
    form.setAttribute("action", server +'/big5/job_processor.php');
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", 'job');
    hiddenField.setAttribute("value", format);
    var hiddenFieldOpt = document.createElement("input");
    hiddenFieldOpt.setAttribute("type", "hidden");
    hiddenFieldOpt.setAttribute("name", 'team');
    hiddenFieldOpt.setAttribute("value", team);

    form.appendChild(hiddenField);
    form.appendChild(hiddenFieldOpt);

    document.body.appendChild(form);
    form.submit();
}

/* current timestamp */
function current_timestamp(){
    var today = new Date();
    var Y = today.getFullYear();
    var M = today.getMonth();
    var D = today.getDate();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    return '['+Y+'-'+M+'-'+D+' '+h+':'+m+':'+s+'] ';
}


/* populate team on select option */
function populate_option_team(){
    $(document).ready(function(){
       print_team_option.html('<option value="all">Print All</option>');
        /* populate team */
        $.ajax({
            url: server + '/big5/options.php',
            data: JSON.stringify({
                option: 'team'
            }),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result){
                //alert(JSON.stringify(result));
                if (result.result){
                    var list = result.result;

                    for (var i=0; i < list.length; ++i){
                        print_team_option.append('<option value="'+list[i]+'">'+list[i]+'</option>');
                    }
                } else {
                    scrapper_log.append(current_timestamp()+ result.error +'<br>');
                }
            },
            error: function(){
                scrapper_log.append(current_timestamp()+ 'Enable to load print option<br>');
            }
        });

        /* populate lookup players */
        /* clear container */
        $('#lookup_players').html('<option value="0">Look Up List</option>');
        $.ajax({
            url: server + '/big5/options.php',
            data: JSON.stringify({
                option: 'lookup'
            }),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result){
                if (result.result == null || result.error){
                    scrapper_log.append(current_timestamp()+ 'Enable to populate lookup players<br>');
                } else {
                    var players = result.result;
                    for (var i=0; i < players.length; ++i){
                        $('#lookup_players').append('<option value="'+players[i].id+'">'+players[i].firstname+' '+players[i].lastname+'</option>');
                    }
                }
            },
            error: function(){
                scrapper_log.append(current_timestamp()+ 'Enable to load lookup players<br>');
            }
        });
    });
}

/* populate no match options */
function no_match_options(obj_result){

    var team = [];
    if (obj_result !== undefined){
        for(var i=0; i < obj_result.length; ++i){
            /* split the result */
            var errors = obj_result[i].error.split('**');
            //alert(errors[1]);
            var el = $('<div></div>'); el.html(errors[1]);
            var text_reference = $('i', el).text();
            /* find team for reference */
            var t = text_reference.split('|');
            reference_box.append('<div class="panel panel-default" title="Add current player to lookup list">\
                                <div class="panel-heading" role="tab">\
                                    <h4 class="panel-title">\
                                        <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#" aria-expanded="false" player_name="'+t[0].trim()+'">\
                                        '+text_reference+'\
                                        </a>\
                                    </h4>\
                                </div>\
                            </div>');
            //alert(t[1]);
            //team.push(t[1].trim());
            /* prevent to duplicate team names */
           if (team.toString().match(t[1].trim()) == null){
               team.push(t[1]);
           }
        }
    }
    /* populate team options */
    for (var j=0; j < team.length; ++j){
       team_select_ref.append('<option value="'+team[j]+'">'+team[j]+'</option>');
    }
    /* initialise button event on click */
    $('.panel-default').each(function(){
        $(this).on('click', function(){
            add_player_reference($(this).find('a').attr('player_name'), $(this));
        });
    });
    //console.log(team);
}

/* populate players for a select team option */
team_select_ref.on('change', function(){
    /* check auto scroll */
    if (log_auto_scroll === false){
        log_auto_scroll = setInterval(function(){
            auto_scroll();
        }, 100);
    }

    //alert($(this).find('option:selected').val());
    var selected_team =  $(this).find('option:selected').val();
    /* clear existing options */
   player_select_ref.html('<option value="0">Select a player</option>');
    $.ajax({
        url: server + '/big5/options.php',
        data: JSON.stringify({
            option: 'players',
            team: selected_team
        }),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(result){
            if (result.result == null || result.error){
                scrapper_log.append(current_timestamp()+ 'Enable to populate players list for team :'+selected_team+'<br>');
            } else {
                var players = result.result;
                for (var i=0; i < players.length; ++i){
                    player_select_ref.append('<option value="'+players[i].id+'">'+players[i].firstname+' '+players[i].lastname+'</option>');
                }
            }
        },
        error:function(){
            scrapper_log.append(current_timestamp()+ 'Enable to connect to server<br>');
        }
    });
});

/* process add player reference */
function add_player_reference(player_ref_btn, btn){
    /* check auto scroll */
    if (log_auto_scroll === false){
        log_auto_scroll = setInterval(function(){
            auto_scroll();
        }, 100);
    }

    /* check users selected players to add the reference */
    var selected_player_id = player_select_ref.find('option:selected').val();
    if (selected_player_id == '0'){
        scrapper_log.append(current_timestamp()+ 'Please select a player from the lookup Reference list<br>');
    } else {
        /* check player reference for accuracy */
        var sel_opt = player_select_ref.find('option:selected').html().split(' ');
        var btn_opt = player_ref_btn.split(' ');
        //alert(sel_opt.slice(-1).pop() + '--'+btn_opt.slice(-1).pop());
        //alert($('[name="accuracy"]:checked').val());
        switch ($('[name="accuracy"]:checked').val()){
            case '0':
                /*firstname accuracy */
                if (sel_opt[0] == btn_opt[0]){
                    //alert(player_ref_btn + ' your reference: '+ selected_player_id);
                    process_add_reference(selected_player_id, player_ref_btn, btn);
                } else {
                    scrapper_log.append(current_timestamp()+ '<i style="background-color: #4b0000">Error updating lookup list</i> - current player by firstname does not match your referenced player. Please check match settings<br>');
                }
                break;
            case '1':
                /* lastname accuracy */
                if (sel_opt.slice(-1).pop() == btn_opt.slice(-1).pop()){
                    //alert(player_ref_btn + ' your reference: '+ selected_player_id);
                    process_add_reference(selected_player_id, player_ref_btn, btn);
                } else {
                    scrapper_log.append(current_timestamp()+ '<i style="background-color: #4b0000">Error updating lookup list</i> - current player by lastname does not match your referenced player. Please check match settings<br>');
                }
                break;
            case '2':
                /* no accuracy reference */
                process_add_reference(selected_player_id, player_ref_btn, btn);
                break;
        }

    }
}

function process_add_reference(id, player, btn){
    $.ajax({
        url: server + '/big5/options.php',
        data: JSON.stringify({
            option: 'reference',
            player: {
                id: id,
                name:player
            }
        }),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(result){
            if (result.error){
                scrapper_log.append(current_timestamp()+ '<i style="background-color: #4b0000">Internal error has occurred</i> - '+result.error+'<br>');
            } else {
                scrapper_log.append(current_timestamp()+ result.result[0]+'<br>');
                /* disable the trigger button */
                btn.fadeOut('slow');
                /* reload the lookup list */
                populate_option_team();
            }
        },
        error: function(){
            scrapper_log.append(current_timestamp()+ 'Enable to connect to server<br>');
        }
    });
}

/* process delete lookup players */
function delete_lookup_players(id){
    /* check auto scroll */
    if (log_auto_scroll === false){
        log_auto_scroll = setInterval(function(){
            auto_scroll();
        }, 100);
    }

    $.ajax({
        url: server + '/big5/options.php',
        data: JSON.stringify({
            option: 'deletelookup',
            player: {id: id}
        }),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(result){
            if (result.error){
                scrapper_log.append(current_timestamp()+ '<i style="background-color: #4b0000">Internal error has occurred</i> - '+result.error+'<br>');
            } else {
                scrapper_log.append(current_timestamp()+ result.result[0]+'<br>');
                populate_option_team();
            }
        },
        error: function(){
            scrapper_log.append(current_timestamp()+ 'Enable to connect to server<br>');
        }
    });
}

function auto_scroll(){
    var current_height = parseInt(scrapper_log.css('height').slice(0, -2));
    /* check if log box > 200 px */
    if (current_height > 200){
        scrapper_log.parent().scrollTop(500000);
    }
    /* disable if user is initiating the scrolling */
    scrapper_log.parent().hover(function(){
        window.clearInterval(log_auto_scroll);
        log_auto_scroll = false;
    });
}