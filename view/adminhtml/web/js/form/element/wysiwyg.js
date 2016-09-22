/**
 * WYSIWYG UI Component
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'Magento_Ui/js/form/element/wysiwyg',
    'Magento_Ui/js/lib/view/utils/async',
    'ko',
    'uiRegistry',
    'jquery',
    'bluefoot/stage',
    'bluefoot/stage/build',
    'bluefoot/common',
    'Magento_Variable/variables'
], function (Wysiwyg, $, ko, registry, jQuery, Stage, Build, Common) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added BlueFoot functionality
     */
    return Wysiwyg.extend({
        defaults: {
            elementSelector: 'textarea.textarea',
            stageActive: false,
            stage: {},
            stageId: Common.guid(),
            stageContent: [],
            showBorders: false,
            links: {
                stageActive: false,
                stage: {},
                stageId: false,
                stageContent: [],
                showBorders: false
            }
        },

        /**
         *
         * @returns {exports}
         */
        initObservable: function () {
            this._super()
                .observe('value stageId stageActive stageContent showBorders');

            return this;
        },

        /**
         *
         * @param {HTMLElement} node
         */
        setElementNode: function (node) {
            $(node).bindings({
                value: this.value
            });

            this.bindBlueFootButton(node);
            this.checkForBlueFootContent(node);
        },

        /**
         * Check to see if the WYSIWYG already contains BlueFoot content
         */
        checkForBlueFootContent: function (node) {
            var build = new Build();
            if (build.parseStructure($(node).val())) {
                return this.buildBlueFoot(false, build, node);
            }
        },

        /**
         * Retrieve the panel from the registry
         *
         * @returns {*}
         */
        getBlueFootPanel: function () {
            return registry.get('bluefoot-panel');
        },

        /**
         * Bind a click event to the BlueFoot init button
         *
         * @param node
         */
        bindBlueFootButton: function (node) {
            $(node).prevAll('.buttons-set').find('.init-gene-bluefoot').on('click', this.buildBlueFoot.bind(this));
        },

        /**
         * Handle a click event requesting that we build BlueFoot
         *
         * @param event
         * @param buildInstance
         * @param node
         */
        buildBlueFoot: function (event, buildInstance, node) {
            var button,
                panel;
            if (event) {
                event.stopPropagation();
                button = jQuery(event.currentTarget);
            }
            if (panel = this.getBlueFootPanel()) {
                panel.buildPanel();

                // Create a new instance of stage, a stage is created for every WYSIWYG that is replaced
                this.stage = new Stage(this, this.stageId, this.stageContent);

                // Are we building from existing data?
                if (buildInstance && node) {
                    buildInstance.buildStage(this.stage);
                    button = $(node).prevAll('.buttons-set').find('.init-gene-bluefoot');
                } else {
                    // Add an initial row to the stage
                    this.stage.addRow(this.stage);
                }

                // Hide the WYSIWYG and display the stage
                button.parents('[data-namespace]').hide();
                if (button.parents('.admin__control-grouped').length > 0) {
                    // Add bluefoot active class to transform the field area full width
                    button.parents('.admin__control-grouped').addClass('bluefoot-active');
                }

                // Mark the stage as active bringing it into display
                this.stageActive(true);

                // Update the panel instance to realise our new stage instance
                panel.updateStages();

            } else {
                console.warn('Unable to locate the BlueFoot panel for initialization.');
            }
        },

        /**
         * Return the BlueFoot stage templage
         *
         * @returns {string}
         */
        getStageTemplate: function () {
            return 'Gene_BlueFoot/component/core/stage.html';
        }

    });
});
