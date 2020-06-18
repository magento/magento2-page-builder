# Workflow tips

## Save page

When you are working on a page and changing the master.html template, you need to Save the page in the Admin UI and make some kind of change to the preview template on the Admin UI. Otherwise, you will not see your changes in the browser. This is due to how Page Builder updates changes: it will not update the master template until changes have been made to the page.

## Setup and cache

If you change something in the configuration of your extension and the change is not visible, run `bin/magento setup:upgrade` to ensure that the configuration is updated.
to execute the `bin/magento setup:upgrade` command.

## Check vendor code

When using example code from the (https://github.com/magento-devdocs/pagebuilder-examples)[PageBuilderExamples] in your project,
and your modification shows no result, make sure you have adopted the latest version of the config XML files if needed.
