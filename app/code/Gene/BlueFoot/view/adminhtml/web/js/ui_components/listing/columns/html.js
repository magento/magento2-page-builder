/**
 * Grid component to render the core html template
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
define([
    'Magento_Ui/js/grid/columns/column'
], function (Column) {
    'use strict';

    return Column.extend({
        defaults: {
            bodyTmpl: 'ui/grid/cells/html'
        }
    });
});