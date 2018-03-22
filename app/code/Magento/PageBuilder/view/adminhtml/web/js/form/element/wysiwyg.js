/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'Magento_Ui/js/form/element/wysiwyg',
    'Magento_Ui/js/lib/view/utils/async',
    'Magento_PageBuilder/js/modal/dismissible-confirm',
    'Magento_Ui/js/modal/alert',
    'mage/translate',
    'mage/apply/main',
    'jquery',
    'mageUtils',
    'Magento_PageBuilder/js/component/event-bus',
    'Magento_PageBuilder/js/component/stage-builder',
    'Magento_PageBuilder/js/component/stage/panel',
    'Magento_PageBuilder/js/utils/directives'
], function (
    _,
    Wysiwyg,
    confirmationPrompt,
    alertPrompt,
    $t,
    applyMain,
    $,
    utils,
    EventBus,
    buildStage,
    Panel,
    directives
) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added PageBuilder functionality
     */
    return Wysiwyg.extend({
        defaults: {
            stageTemplate: 'Magento_PageBuilder/component/stage.html',
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
            isComponentInitialized: false,
            wysiwygConfigData: {},
            interacting: false,
            templateManagerTitle: $t('Template Manager'),
            stageLoadingMessage: $t('Please hold! we\'re just retrieving your content...'),
            links: {
                stageActive: false,
                stage: {},
                stageId: false,
                stageContent: [],
                showBorders: false,
                loading: false,
                userSelect: true,
                isFullScreen: false,
                wysiwygConfigData: {}
            },
            listens: {
                isFullScreen: 'onFullScreenChange'
            },
            config: {
                name: 'stage'
            }
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();
            this.getPanel();

            return this;
        },

        /** @inheritdoc */
        initObservable: function () {
            this._super()
               .observe('value stageId stageActive stageContent showBorders loading userSelect')
               .observe('isFullScreen wysiwygConfigData interacting');

            // Modify the scroll position based on an update
            this.isFullScreen.subscribe(function (fullScreen) {
                if (!fullScreen) {
                    this.originalScrollTop = $(window).scrollTop();
                    _.defer(function () {
                        $(window).scrollTop(0);
                    });
                }
            }, this, 'beforeChange');

            return this;
        },

        /**
         * Full screen changes handler.
         *
         * @param {Boolean} fullScreen
         */
        onFullScreenChange: function (fullScreen) {
            if (!fullScreen) {
                _.defer(function () {
                    $(window).scrollTop(this.originalScrollTop);
                    //hide page builder area in case if we open full screen mode from button
                    this.hidePageBuilderArea();
                }.bind(this));
            }
        },

        /** @inheritdoc */
        setElementNode: function (node) {
            this.domNode = node;

            if (!this.isComponentInitialized) {
                // Hide the original WYSIWYG editor
                $('#toggle' + node.id).hide();
                $('#' + node.id).hide();

                if (this.wysiwygConfigData()['pagebuilder_button']) {
                    //process case when page builder is initialized using button
                    this.bindPageBuilderButton(node);
                    this.handleUseDefaultButton(node);
                } else {
                    this.buildPageBuilder();
                }

                return;
            }

            this._super();
        },

        /**
         * Returns panel object
         *
         * @return {Panel}
         */
        getPanel: function () {
            this.panel = this.panel || new Panel();

            return this.panel;
        },

        /**
         * Hide page builder area
         *
         * @return void
         */
        hidePageBuilderArea: function () {
            if (this.wysiwygConfigData()['pagebuilder_button']) {
                this.isComponentInitialized = false;
                this.stageActive(false);
                this.visible(true);
                $(this.domNode).hide();
            }
        },

        /**
         * Bind a click event to the PageBuilder init button
         *
         * @param {HTMLElement} node
         */
        bindPageBuilderButton: function (node) {
            //Move selectors to configuration
            $(node).prevAll('.buttons-set').find('.init-magento-pagebuilder')
                .on('click', this.displayPageBuilderInFullScreenMode.bind(this));
        },

        /**
         * Handles the 'Use Default Value' checkbox
         *
         * @param {HTMLElement} node
         */
        handleUseDefaultButton: function (node) {
            //Move selectors to configuration
            var defaultButton = $('div.admin__field-service input[id="' + this.uid + '_default"]'),
                editPageBuilderButton = $(node).prevAll('.buttons-set').find('.init-magento-pagebuilder')[0];

            if (defaultButton.is(':checked')) {
                editPageBuilderButton.disable();
                editPageBuilderButton.style.pointerEvents = 'none';
            }
            $(document).on('click', 'div.admin__field-service input[id="' + this.uid + '_default"]', function () {
                if (this.checked) {
                    editPageBuilderButton.disable();
                    editPageBuilderButton.style.pointerEvents = 'none';
                } else {
                    editPageBuilderButton.enable();
                    editPageBuilderButton.style.pointerEvents = 'auto';
                }
            });
        },

        /**
         * Displays page builder based on configuration
         * @param  {Event} event
         * @return void
         */
        displayPageBuilderInFullScreenMode: function (event) {
            var isFullScreen = true;

            this.isComponentInitialized = true;

            if (!_.isEmpty(this.stage)) {
                this.isFullScreen(isFullScreen);
                //handle case, when pagebuilder was previously opened
                this.stageActive(true);
            } else {
                //initialize page builder on first click
                this.buildPageBuilder(event, isFullScreen);
            }
        },

        /**
         * Handle a click event requesting that we build PageBuilder
         *
         * @param {Event} event
         * @param {Boolean} isFullScreenMode
         * @return void
         */
        buildPageBuilder: function (event, isFullScreenMode) {
            var self = this,
                isFullScreeMode = isFullScreenMode || false,

                /**
                 * @param {Stage} stage
                 */
                bindStage = function (stage) {
                    self.stage = stage;
                    EventBus.on('stage:ready', function (stageReadyEvent, params) {
                        if (params.stage.id === self.stage.id) {
                            self.isFullScreen(isFullScreeMode);
                        }
                    });
                };

            this.loading(true);

            if (typeof event !== 'undefined') {
                event.stopPropagation();
            }

            buildStage(
                this,
                this.getPanel(),
                this.stageContent,
                directives.removeQuotesInMediaDirectives(this.initialValue),
                bindStage
            );
            this.stageActive(true);

            this.isComponentInitialized = true;
        },

        /**
         * Return the PageBuilder stage templage
         *
         * @returns {String}
         */
        getStageTemplate: function () {
            return this.stageTemplate;
        },

        /**
         * Throw a confirmation dialog in the exterior system.
         *
         * @param {Object} options
         * @return void
         */
        confirmationDialog: function (options) {
            if (options.actions &&
                ['always', 'confirm', 'cancel'].some(function (action) {
                    return typeof options.actions[action] === 'function';
                })
            ) {
                confirmationPrompt(options);
            } else {
                throw new Error('Wysiwyg.confirmationDialog: options.actions' +
                    ' must include at least one "always", "confirm", or "cancel" callback');
            }
        },

        /**
         * Throw an alert dialog in the exterior system.
         *
         * @param {Object} options
         * @return void
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
        }
    });
});
