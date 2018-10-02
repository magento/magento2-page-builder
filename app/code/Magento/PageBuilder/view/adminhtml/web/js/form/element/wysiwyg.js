/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_Ui/js/form/element/wysiwyg',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/page-builder'
], function ($, Wysiwyg, $t, events, PageBuilder) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added PageBuilder functionality
     */
    return Wysiwyg.extend({
        defaults: {
            elementSelector: '> textarea',
            pageBuilder: {},
            visiblePageBuilder: false,
            isComponentInitialized: false,
            wysiwygConfigData: {},
            pageBuilderEditButtonText: $t('Edit with Page Builder'),
            isWithinModal: false,
            modal: false,
        },

        /**
         * @inheritdoc
         */
        initialize: function () {
            this._super();

            if (!this.wysiwygConfigData()['pagebuilder_button']) {
                this.initPageBuilder();
            }

            return this;
        },

        /**
         * @inheritdoc
         */
        initObservable: function () {
            this._super()
                .observe('visiblePageBuilder wysiwygConfigData loading');

            return this;
        },

        /**
         * Handle button click, init the Page Builder application
         */
        pageBuilderEditButtonClick: function (context, event) {
            var modalInnerWrap = $(event.currentTarget).parents(".modal-inner-wrap");

            // Determine if the Page Builder instance is within a modal
            this.isWithinModal = modalInnerWrap.length === 1;
            if (this.isWithinModal) {
                this.modal = modalInnerWrap;
            }

            this.initPageBuilder();
            this.toggleFullScreen();
        },

        /**
         * Init Page Builder
         */
        initPageBuilder: function () {
            if (!this.isComponentInitialized) {
                this.loading(true);
                this.pageBuilder = new PageBuilder(this.wysiwygConfigData(), this.initialValue);
                this.initPageBuilderListeners();
            }

            if (!this.wysiwygConfigData()['pagebuilder_button']) {
                this.visiblePageBuilder(true);
            }
        },

        /**
         * Toggle Page Builder full screen mode
         */
        toggleFullScreen: function () {
            events.trigger('stage:' + this.pageBuilder.id + ':toggleFullscreen', {});
        },

        /**
         * Init various listeners on the stage
         */
        initPageBuilderListeners: function () {
            var id = this.pageBuilder.id;

            events.on('stage:' + id + ':readyAfter', function () {
                this.isComponentInitialized = true;
                this.loading(false);
            }.bind(this));

            events.on('stage:' + id + ':masterFormatRenderAfter', function (args) {
                this.value(args.value);
            }.bind(this));

            events.on('stage:' + id + ':fullScreenModeChangeAfter', function (args) {
                if (!args.fullScreen && this.wysiwygConfigData()['pagebuilder_button']) {
                    this.visiblePageBuilder(false);

                    if (this.isWithinModal && this.modal) {
                        this.modal.css({
                            transform: "",
                            transition: ""
                        });
                    }
                } else if (args.fullScreen && this.wysiwygConfigData()['pagebuilder_button']) {
                    this.visiblePageBuilder(true);

                    if (this.isWithinModal && this.modal) {
                        this.modal.css({
                            transform: "none",
                            transition: "none"
                        });
                    }
                }
            }.bind(this));
        }
    });
});
