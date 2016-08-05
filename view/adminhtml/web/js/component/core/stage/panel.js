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
    var blockModel = function (block) {
        this.identifier = ko.observable(block.identifier);
        this.name = ko.observable(block.name);
        this.icon_class = ko.observable(block.icon_class);
        this.icon = ko.computed(function () {
            return '<i class="fa ' + this.icon_class() + '"></i>';
        }.bind(this));
        this.show_in_page_builder = ko.observable(block.show_in_page_builder);
        this.sort_order = ko.observable(block.sort_order);
    };

    /**
     * Group model to handle groups in the left panel
     *
     * @param group
     */
    var groupModel = function (group) {
        this.code = ko.observable(group.code);
        this.name = ko.observable(group.name);
        this.icon = ko.observable(group.icon);
        this.sort_order = ko.observable(group.sort_order);
        this.blocks = ko.observableArray([]);

        // Ability to add a block into a group model
        this.addBlock = function (block) {
            this.blocks.push(new blockModel(block));
        }.bind(this)
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
            jQuery('body').on('click', Config.getInitConfig('init_button_class'), this.buildPanel.bind(this));
        },

        buildPanel: function () {
            if (!this.built) {
                console.log('init config');
                // Build the config via an Ajax request
                Config.initConfig(function (config) {
                    console.log(Config.getConfig());
                    console.log('build time baby');
                }, false, Config.getStoreId());
            }
        }
    });
});