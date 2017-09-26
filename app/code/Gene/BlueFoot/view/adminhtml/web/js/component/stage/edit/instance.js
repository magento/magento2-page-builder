/**
 * - Edit/Instance.js
 * Handles all interactions with the panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'uiComponent',
    'ko',
    'jquery'
], function (Component, ko, jQuery) {

    /**
     * Extend the component for BlueFoot panel specific functionality
     */
    return Component.extend({
        defaults: {
            panels: []
        },

        /**
         * Initializes observable properties.
         *
         * @returns {Model} Chainable.
         */
        initObservable: function () {
            this._super()
                .observe('panels');

            return this;
        },

        /**
         * Add a panel
         *
         * @param panel
         */
        addPanel: function (panel) {
            this.panels.push({id: panel});
        }
    });
});