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
    'mageUtils',
    'Magento_PageBuilder/js/component/format/format-validator',
    'Magento_PageBuilder/js/component/stage-builder',
    'Magento_PageBuilder/js/component/stage/panel',
    'Magento_PageBuilder/js/utils/directives'
], function (
    _,
    Wysiwyg,
    $,
    confirmationPrompt,
    alertPrompt,
    $t,
    applyMain,
    ko,
    registry,
    jQuery,
    utils,
    validateFormat,
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
            isButtonEnable: ko.observable(false),
            wysiwygConfigData: {},
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
                .observe('value stageId stageActive stageContent showBorders loading userSelect '
                    + 'isFullScreen wysiwygConfigData');

            // Modify the scroll position based on an update
            this.isFullScreen.subscribe(function (fullScreen) {
                if (!fullScreen) {
                    self.originalScrollTop = jQuery(window).scrollTop();
                    _.defer(function () {
                        jQuery(window).scrollTop(0);
                    });
                }
            }, this, 'beforeChange');
            this.isFullScreen.subscribe(function (fullScreen) {
                if (!fullScreen) {
                    _.defer(function () {
                        jQuery(window).scrollTop(self.originalScrollTop);
                        //hide page builder area in case if we open full screen mode from button
                        self.hidePageBuilderArea();
                    });
                }
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
            this.bindPageBuilderButton(node);

            if (!this.isComponentInitialized) {

                if (this.wysiwygConfigData()['pagebuilder_button']) {
                    //process case when page builder is initialized using button
                    this.bindPageBuilderButton(node);
                    this.handleUseDefaultButton(node);
                } else {
                    this.buildPageBuilder();
                }

                return;
            }
            $(node).bindings({
                value: this.value
            });
        },

        /**
         * Returns panel object
         *
         * @return {Panel}
         */
        getPanel: function () {
            if (!this.panel) {

                this.panel = new Panel();
            }

            return this.panel;
        },

        /**
         * Hide page builder area
         *
         * @return void
         */
        hidePageBuilderArea: function () {

            if (this.wysiwygConfigData()['enable_pagebuilder']) {
                this.isComponentInitialized = false;
                this.stageActive(false);
                this.visible(true);
                $(this.domNode).hide();
            }
        },

        /**
         * Any events fired on the WYSIWYG component should be ran on the stage
         *
         * @param {String} eventName
         * @param {String} params
         */
        emit: function (eventName, params) {
            return this.stage.emit(eventName, params);
        },

        /**
         * Bind a click event to the PageBuilder init button
         *
         * @param {HTMLElement} node
         */
        bindPageBuilderButton: function (node) {
            // Hide wysiwyg text area and toogle buttons
            $('#' + node.id).hide();

            if (this.wysiwygConfigData()['hide_toogle_buttons']) {
                $('#toggle' + node.id).hide();
            }
            $(node).prevAll('.buttons-set').find('.init-magento-pagebuilder')
                .on('click', this.displayPageBuilderInFullScreenMode.bind(this));
        },

        /**
         * Handles the 'Use Default Value' checkbox
         *
         * @param {HTMLElement} node
         */
        handleUseDefaultButton: function (node) {
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
            var isFullScreen = this.wysiwygConfigData().openInFullScreen || false;

            this.isComponentInitialized = true;

            if (!$.isEmptyObject(this.stage)) {

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
                bindStage = function (stage) {
                    self.stage = stage;
                    stage.on('stageReady', function () {
                        self.stageActive(true);
                        self.visible(false);
                    });
                };

            this.loading(true);

            this.isFullScreen(isFullScreeMode);

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

            // On stage ready show the interface
            this.stage.on('stageReady', function () {
                self.stageActive(true); // Display the stage UI
                self.visible(false); // Hide the original WYSIWYG editor
            });

            this.isComponentInitialized = true;
        },

        /**
         * Return the PageBuilder stage templage
         *
         * @returns {String}
         */
        getStageTemplate: function () {
            return 'Magento_PageBuilder/component/stage.html';
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
                throw new Error('Wysiwyg.confirmationDialog: options.actions must include at least one \"always\", \"confirm\", or \"cancel\" callback');
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
        },

        /**
         * Run the apply function to load modules detected in the DOM.
         */
        applyConfigFor: function () {
            return applyMain.applyFor.apply(null, arguments);
        }

    });
});
