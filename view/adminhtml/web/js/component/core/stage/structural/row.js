/**
 * - Stage.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/abstract'
], function (Abstract) {

    return Abstract.extend({

        /**
         * Override the template for the row element
         *
         * @returns {string}
         */
        getTemplate: function () {
            return 'Gene_BlueFoot/component/core/stage/structural/row.html'
        }
    });
});