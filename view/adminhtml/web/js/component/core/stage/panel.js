define([
    'uiComponent',
    'ko',
    'jquery',
    'bluefoot/config',
    'bluefoot/modal'
], function(Component, ko, jQuery, Config, Modal) {

    /**
     * The block model sits within a group
     *
     * @param block
     */
    var Block = function (block) {
        this.code = ko.observable(block.code);
        this.name = ko.observable(block.name);
        this.icon = ko.observable(block.icon);
    };

    /**
     * Group model to handle groups in the left panel
     *
     * @param id
     * @param group
     */
    var Group = function (id, group) {
        this.id = ko.observable(id);
        this.code = ko.observable(group.code);
        this.name = ko.observable(group.name);
        this.icon = ko.observable(group.icon); // @todo this is inconsistent, as blocks just store an icon class
        this.sort = ko.observable(group.sort);
        this.blocks = ko.observableArray([]);

        // Ability to add a block into a group model
        this.addBlock = function (block) {
            this.blocks.push(new Block(block));
        }.bind(this);
    };

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

            // Add bindings to the document
            this.bind();
        },

        /**
         * Bind a click event to the body listening for clicks on init buttons
         */
        bind: function () {
            jQuery(document).on('click', Config.getInitConfig('init_button_class'), this.buildPanel.bind(this));
        },

        buildPanel: function (event) {
            if (!this.built) {
                this.populatePanel();
            }
        },

        populatePanel: function () {
            // Initialize the full configuration
            Config.initConfig(function (config) {
                // Verify the configuration contains the required information
                if (typeof config.contentTypeGroups !== 'undefined' &&
                    typeof config.contentTypes !== 'undefined')
                {
                    // Populate the groups array with our groups
                    var groups = {};
                    jQuery.each(config.contentTypeGroups, function (id, group) {
                        groups[id] = new Group(id, group);
                        this.groups.push(groups[id]);
                    }.bind(this));

                    // Add blocks into the groups
                    jQuery.each(config.contentTypes, function (id, block) {
                        if (typeof groups[block.group] !== 'undefined') {
                            groups[block.group].addBlock(block);
                        }
                    }.bind(this));

                    // Clean up
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