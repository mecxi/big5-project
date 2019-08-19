# big5-project
a data scoring application &amp; a news feeds aggregating app based

## Project Installation
<config.php>
. Modify the config.php file to set the project directory
. In your apache host configuration, set the document_root as your project folder  
  e.g <DocumentRoot /var/www/project_folder> 
. Update your server IP and the default port in the config file. Please note if any other port than 80 is used, 
  allow the enable port through your firewall
. Create a log folder in your root directory for your custom Database Object Class and set appropriate write permission

<Enabling mod_rewrite>
In order for Apache to understand rewrite rules set in .htaccess, first enable mod_rewrite.
Check your apache documentation for more detail
