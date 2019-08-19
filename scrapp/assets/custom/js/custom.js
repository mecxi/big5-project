/**
 * Created by Mecxi on 3/6/2017.
 */

/* check the landing page */
var current_page = window.location.pathname.replace('#', '');
current_page = current_page.replace('/big5/scrapp/','');

/* to resolve the menu font-color */
if (current_page.length != 0){
    $('[role="navigation"]').addClass('custom-nav');
}

// Welcome page
/* initialise btn events */
$('.welcome button:contains("Rugby")').on('click', function(){
    window.location.assign(base_uri + '/rugby');
});