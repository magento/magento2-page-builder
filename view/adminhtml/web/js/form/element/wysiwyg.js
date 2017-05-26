/**
 * WYSIWYG UI Component
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'Magento_Ui/js/form/element/wysiwyg',
    'Magento_Ui/js/lib/view/utils/async',
    'Magento_Ui/js/modal/confirm',
    'Magento_Ui/js/modal/alert',
    'mage/translate',
    'mage/apply/main',
    'ko',
    'uiRegistry',
    'jquery',
    'bluefoot/stage',
    'bluefoot/stage/build',
    'mageUtils',
    'Magento_Variable/variables'
], function (Wysiwyg, $, confirmationPrompt, alertPrompt, $t, applyMain, ko, registry, jQuery, Stage, Build, utils) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added BlueFoot functionality
     */
    return Wysiwyg.extend({
        defaults: {
            elementSelector: 'textarea.textarea',
            stageActive: false,
            stage: {},
            stageId: utils.uniqueid(),
            stageContent: [],
            showBorders: false,
            loading: false,
            userSelect: true,
            links: {
                stageActive: false,
                stage: {},
                stageId: false,
                stageContent: [],
                showBorders: false,
                loading: false,
                userSelect: true,
            }
        },

        /**
         *
         * @returns {exports}
         */
        initObservable: function () {
            this._super()
                .observe('value stageId stageActive stageContent showBorders loading userSelect');

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
            var buildInstance = new Build(),
                buildStructure;
            if (buildStructure = buildInstance.parseStructure($(node).val())) {
                this.loading(true);
                return this.buildBlueFoot(false, buildInstance, buildStructure, node);
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
         * @param buildStructure
         * @param node
         */
        buildBlueFoot: function (event, buildInstance, buildStructure, node) {
            var button,
                panel;
            if (event) {
                event.stopPropagation();
                button = jQuery(event.currentTarget);
            }
            if (panel = this.getBlueFootPanel()) {
                panel.buildPanel();

                // Create a new instance of stage, a stage is created for every WYSIWYG that is replaced
                this.stage = new Stage(
                    this,
                    this.stageId,
                    this.stageContent
                );
                this.stage.build(buildInstance, buildStructure);

                // Are we building from existing data?
                if (buildInstance && node) {
                    button = $(node).prevAll('.buttons-set').find('.init-gene-bluefoot');
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
            return 'Gene_BlueFoot/component/stage.html';
        },

        /**
         * Throw a confirmation dialog in the exterior system.
         * 
         * @param {object} options
         * @returns {null}
         */
        confirmationDialog: function (options) {
            if (options.actions && (
                ['always', 'confirm', 'cancel'].some(function (action) {
                    return typeof options.actions[action] === 'function';
                })
            )) {
                confirmationPrompt(options);
            } else {
                throw new Error('Wysiwyg.confirmationDialog: options.actions must include at least one "always", "confirm", or "cancel" callback');
            }
        },

        /**
         * Throw an alert dialog in the exterior system.
         *
         * @param {object} options
         * @returns {null}
         */
        alertDialog: function (options) {
            if (options.content) {
                options.content = $t(options.content);
                if (options.title) {
                    options.title = $t(options.title);
                }
                alertPrompt(options);
            } else {
                throw new Error('Wysiwyg.alertDialog: options.message must be provided');
            }
        },

        /**
         * Run the apply function to load modules detected in the DOM.
         */
        applyConfigFor: function () {
            return applyMain.applyFor.apply(null, arguments);
        }

    });
});
