/**
 * - Abstract.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'underscore',
    'uiClass'
], function (_, Class) {

    var Abstract = _.extend({
        defaults: {
            options: [],
            data: {},
            children: [],
        },

        /**
         * Return the template for the element
         *
         * @returns {string}
         */
        getTemplate: function () {
            return 'Gene_BlueFoot/component/core/stage/structural/abstract.html'
        }

    });

    return Class.extend(Abstract);
});