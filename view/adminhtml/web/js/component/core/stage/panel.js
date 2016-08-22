/**
 * - Panel.js
 * Handles all interactions with the panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'uiComponent',
    'ko',
    'jquery',
    'bluefoot/config',
    'bluefoot/stage/panel/group',
    'bluefoot/modal',
    'bluefoot/ko-sortable'
], function (Component, ko, jQuery, Config, Group) {

    /**
     * Extend the component for BlueFoot panel specific functionality
     */
    return Component.extend({

        /**
         * Initialize the panel component
         *
         * @param config
         */
        initialize: function (config) {
            this._super();

            // Store the init config in the main model
            Config.setInitConfig(config);

            // Once the panel is built, we don't need to build it again
            this.built = false;

            // Observable information for the panel to be built at a later date
            this.visible = ko.observable(false);
            this.groups = ko.observableArray([]);
        },

        /**
         * Build the panel, check to see if panel is built first
         */
        buildPanel: function () {
            // Do we need to rebuild the panel?
            if (!this.built) {
                this.populatePanel();
                this.built = true;
            }
        },

        /**
         * Populate the panel
         */
        populatePanel: function () {

            // Initialize the full configuration
            Config.initConfig(function (config) {

                // Verify the configuration contains the required information
                if (typeof config.contentTypeGroups !== 'undefined' &&
                    typeof config.contentTypes !== 'undefined') {
                    // Populate the groups array with our groups
                    var groupsLookup = {};
                    var groups = [];
                    jQuery.each(config.contentTypeGroups, function (id, group) {
                        groupsLookup[id] = new Group(id, group);
                        groups.push(groupsLookup[id]);
                    }.bind(this));

                    // Add blocks into the groups
                    jQuery.each(config.contentTypes, function (id, block) {
                        if (typeof groupsLookup[block.group] !== 'undefined') {
                            groupsLookup[block.group].addBlock(block);
                        }
                    }.bind(this));

                    // Update groups all at once
                    this.groups(groups);
                    groupsLookup = {};
                    groups = {};

                    // Display the panel
                    this.visible(true);
                } else {
                    console.warn('Configuration is not properly initialized, please check the Ajax response.');
                }

            }.bind(this), false, Config.getStoreId());
        }
    });
});