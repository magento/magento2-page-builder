/**
 * WYSIWYG UI Component
 *
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
    'Gene_BlueFoot/js/component/stage',
    'Gene_BlueFoot/js/component/stage/build',
    'Gene_BlueFoot/js/component/stage/panel',
    'mageUtils',
    'Magento_Variable/variables'
], function (Wysiwyg, $, confirmationPrompt, alertPrompt, $t, applyMain, ko, registry, jQuery, Stage, Build, Panel, utils) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added BlueFoot functionality
     */
    return Wysiwyg.extend({
        defaults: {
            domNode: false,
            elementSelector: 'textarea.textarea',
            stageActive: false,
            stage: {},
            stageId: utils.uniqueid(),
            stageContent: [],
            showBorders: false,
            loading: false,
            userSelect: true,
            panel: new Panel(),
            isFullScreen: false,
            originalScrollTop: false,
            links: {
                stageActive: false,
                stage: {},
                stageId: false,
                stageContent: [],
                showBorders: false,
                loading: false,
                userSelect: true,
                isFullScreen: false
            },
            config: {
                name: 'stage'
            }
        },

        /**
         *
         * @returns {exports}
         */
        initObservable: function () {
            var self = this;
            this._super()
                .observe('value stageId stageActive stageContent showBorders loading userSelect isFullScreen');

            // Modify the scroll position based on an update
            this.isFullScreen.subscribe(function (fullScreen) {
                if (!fullScreen) {
                    self.originalScrollTop = jQuery(window).scrollTop();
                    _.defer(function () {
                        jQuery(window).scrollTop(0);
                    });
                }
            }, this, "beforeChange");
            this.isFullScreen.subscribe(function (fullScreen) {
                if (!fullScreen) {
                    _.defer(function () {
                        jQuery(window).scrollTop(self.originalScrollTop);
                    });
                }
            });

            return this;
        },

        /**
         *
         * @param {HTMLElement} node
         */
        setElementNode: function (node) {
            this.domNode = node;
            this.bindBlueFootButton(node);

            var buildInstance = new Build(this.initialValue);
            if (buildInstance.canBuild()) {
                this.loading(true);
                return this.buildBlueFoot(false, buildInstance);
            }

            $(node).bindings({
                value: this.value
            });
        },

        /**
         * Any events fired on the WYSIWYG component should be ran on the stage
         *
         * @param eventName
         * @param params
         */
        emit: function (eventName, params) {
            return this.stage.emit(eventName, params);
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
         */
        buildBlueFoot: function (event, buildInstance) {
            var self = this;
            if (event) {
                event.stopPropagation();
            }

            // Create a new instance of stage, a stage is created for every WYSIWYG that is replaced
            this.stage = new Stage(
                this,
                this.stageContent
            );

            // On stage ready show the interface
            this.stage.on('stageReady', function () {
                self.stageActive(true); // Display the stage UI
                self.visible(false); // Hide the original WYSIWYG editor
            });

            // Create a new instance of the panel
            this.panel.bindStage(this.stage);

            // Build the stage instance using any existing build data
            this.stage.build(buildInstance);
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
