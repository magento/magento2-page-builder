/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict, max-len */

define([
    'underscore',
    'Magento_Ui/js/form/element/wysiwyg',
    'Magento_Ui/js/lib/view/utils/async',
    'Magento_Ui/js/modal/confirm',
    'Magento_Ui/js/modal/alert',
    'mage/translate',
    'mage/apply/main',
    'ko',
    'uiRegistry',
    'jquery',
    'Magento_PageBuilder/js/component/stage',
    'Magento_PageBuilder/js/component/stage/build',
    'Magento_PageBuilder/js/component/stage/panel',
    'mageUtils',
    'Magento_Variable/variables'
], function (_, Wysiwyg, $, confirmationPrompt, alertPrompt, $t, applyMain, ko, registry, jQuery, Stage, Build, Panel, utils) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added PageBuilder functionality
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
            isFullScreen: false,
            originalScrollTop: false,
            isComponentInitialized: ko.observable(false),
            wysiwygConfig: ko.observable(false),
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

            this.wysiwygConfig.subscribe(function(config) {
                this.displayPageBuilder(config);
            }, this);
            return this;
        },

        /**
         *
         * @param {HTMLElement} node
         * @return {void}
         */
        setElementNode: function (node) {
            
            this.domNode = node;
            $(node).bindings({
                value: this.value
            });
        },

        /**
         * Returns panel object
         *
         * @return {*}
         */
        getPanel: function () {
            if (!(this.panel)) {

                this.panel = new Panel();
            }
            return this.panel;
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
         * Bind a click event to the PageBuilder init button
         *
         * @param node
         */
        bindPageBuilderButton: function (node) {
            $(node).prevAll('.buttons-set').find('.init-magento-pagebuilder').on('click', this.buildPageBuilder.bind(this));
        },

        /**
         * Displays page builder based on configuration
         * @param config
         * @return void
         */
        displayPageBuilder: function(config)
        {
            //@todo add some logic to display based on config

            var buildInstance = new Build(this.initialValue),
                isPageBuilderButtonExists =  config.pagebuilder_button || false,
                isFullScreen = config.isFullScreenMode || false;

            if (isPageBuilderButtonExists) {
                this.bindPageBuilderButton(this.domNode);

            }
            //@todo simplify that logic
            if (!this.isComponentInitialized() && !isPageBuilderButtonExists) {
                this.loading(true);
                if (buildInstance.canBuild() && isPageBuilderButtonExists) {
                    this.buildPageBuilder(false, buildInstance);
                } else {
                    this.buildPageBuilder(false);
                }
            }
        },

        /**
         * Handle a click event requesting that we build PageBuilder
         *
         * @param event
         * @param buildInstance
         */
        buildPageBuilder: function (event, buildInstance) {
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
            this.getPanel().bindStage(this.stage);

            // Build the stage instance using any existing build data
            this.stage.build(buildInstance);
            this.isComponentInitialized(true);
        },

        /**
         * Return the PageBuilder stage templage
         *
         * @returns {string}
         */
        getStageTemplate: function () {
            return 'Magento_PageBuilder/component/stage.html';
        },

        /**
         * Throw a confirmation dialog in the exterior system.
         *
         * @param {object} options
         * @returns {null}
         */
        confirmationDialog: function (options) {
            if (options.actions &&
                ['always', 'confirm', 'cancel'].some(function (action) {
                    return typeof options.actions[action] === 'function';
                })
            ) {
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
