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
    'bluefoot/stage/panel/group/block',
    'bluefoot/stage/previews',
    'bluefoot/ko-sortable',
    'bluefoot/ko-redactor'
], function (Component, ko, jQuery, Config, Group, GroupBlock, Previews) {

    /**
     * Extend the component for BlueFoot panel specific functionality
     */
    return Component.extend({
        defaults: {
            visible: false,
            groups: [],
            searching: false,
            searchResults: []
        },

        /**
         * Initialize the panel component
         */
        initialize: function () {
            this._super();

            // Load preview templates
            Previews.load();
        },

        /**
         * Bind the stage to the panel instance
         *
         * @param stage
         */
        bindStage: function (stage) {
            var self = this;
            stage.on('stageReady', function () {
                self.populateContentBlocks();
                self.visible(true);
            });
        },

        /**
         * Return the full path to the template
         *
         * @returns {string}
         */
        getTemplate: function () {
            return 'Gene_BlueFoot/component/stage/panel.html';
        },

        /**
         * Initializes observable properties.
         *
         * @returns {Model} Chainable.
         */
        initObservable: function () {
            this._super()
                .observe('visible groups searching searchResults');

            return this;
        },

        /**
         * Conduct a search on the available content blocks
         *
         * @param self
         * @param event
         */
        search: function (self, event) {
            var searchValue = event.currentTarget.value.toLowerCase();
            if (searchValue === '') {
                this.searching(false);
            } else {
                this.searching(true);
                this.searchResults(_.map(
                    _.filter(
                        Config.getInitConfig('contentBlocks'),
                        function (contentBlock) {
                            return contentBlock.name.toLowerCase().indexOf(searchValue) > -1 &&
                                contentBlock.visible === true;
                        }
                    ),
                    function (contentBlock) {
                        // Create a new instance of GroupBlock for each result
                        return new GroupBlock(contentBlock);
                    })
                );
            }
        },

        /**
         * Populate the panel with the content blocks
         */
        populateContentBlocks: function () {
            var self = this,
                groups = Config.getInitConfig('groups'),
                contentBlocks = Config.getInitConfig('contentBlocks');
            // Verify the configuration contains the required information
            if (groups && contentBlocks) {
                // Iterate through the groups creating new instances with their associated content blocks
                _.each(groups, function (group, id) {
                    // Push the group instance into the observable array to update the UI
                    self.groups.push(new Group(
                        id,
                        group,
                        _.map(
                            _.where(contentBlocks, {
                                group: id,
                                visible: true
                            }), /* Retrieve content blocks with group id */
                            function (contentBlock) {
                                return new GroupBlock(contentBlock);
                            }
                        )
                    ));
                });

                // Display the panel
                this.visible(true);
            } else {
                console.warn('Configuration is not properly initialized, please check the Ajax response.');
            }
        }
    });
});