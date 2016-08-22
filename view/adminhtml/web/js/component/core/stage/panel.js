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

            // Record the stages DOM elements on the page
            this.stages = false;
        },

        /**
         * Build the panel, check to see if panel is built first
         */
        buildPanel: function () {
            // Do we need to rebuild the panel?
            if (!this.built) {
                this.populatePanel();
                this.bindEvents();
            } else {
                this.updateStages();
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

                    this.built = true;
                    this.updateStages();
                } else {
                    console.warn('Configuration is not properly initialized, please check the Ajax response.');
                }

            }.bind(this), false, Config.getStoreId());
        },

        /**
         * Update the stages cache with any new stages
         */
        updateStages: function () {
            this.stages = jQuery('body').find('[data-role="bluefoot-stage"]');
        },

        /**
         * Bind events for the panel
         */
        bindEvents: function () {
            var that = this,
                stageInView = false,
                timeout;

            // Attach a scroll event to the window to monitor stages coming in and out of view
            jQuery(window).scroll(function () {
                if (that.built && that.stages.length > 0) {
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        stageInView = false;
                        that.stages.each(function () {
                            if (that._elementInViewport(jQuery(this))) {
                                stageInView = true;
                                return false;
                            }
                        });

                        that.visible(stageInView);
                    }, 100);
                }
            });
        },

        /**
         * Determine if an element is within the view port
         *
         * @param el
         * @returns {boolean}
         * @private
         */
        _elementInViewport: function (el) {
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }

            var rect = el.getBoundingClientRect();

            return (
                (rect.top + rect.height) >= 0 &&
                rect.left >= 0 &&
                (rect.bottom - rect.height) <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    });
});