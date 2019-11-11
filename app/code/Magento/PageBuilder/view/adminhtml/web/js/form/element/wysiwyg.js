/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'underscore',
    'Magento_Ui/js/form/element/wysiwyg',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_Ui/js/lib/view/utils/dom-observer',
    'Magento_PageBuilder/js/page-builder',
    'Magento_Ui/js/lib/view/utils/async'
], function ($, _, Wysiwyg, $t, events, domObserver, PageBuilder) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added PageBuilder functionality
     */
    return Wysiwyg.extend({
        defaults: {
            transition: false,
            transitionOut: false,
            elementSelector: '> textarea',
            stageSelector: '.pagebuilder-stage-wrapper',
            pageBuilder: false,
            visiblePageBuilder: false,
            isComponentInitialized: false,
            wysiwygConfigData: {},
            pageBuilderEditButtonText: $t('Edit with Page Builder'),
            isWithinModal: false,
            modal: false
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
                .observe('isComponentInitialized visiblePageBuilder wysiwygConfigData loading transition ' +
                    'transitionOut');

            return this;
        },

        /**
         * Handle button click, init the Page Builder application
         */
        pageBuilderEditButtonClick: function (context, event) {
            this.determineIfWithinModal(event.currentTarget);
            this.transition(false);

            if (!this.isComponentInitialized()) {
                this.disableDomObserver($(event.currentTarget).parent()[0]);
            }

            this.initPageBuilder();
            this.toggleFullScreen();
        },

        /**
         * Init Page Builder
         */
        initPageBuilder: function () {
            if (!this.isComponentInitialized()) {
                this.loading(true);
                this.pageBuilder = new PageBuilder(this.wysiwygConfigData(), this.initialValue);
                events.trigger('pagebuilder:register', {
                    ns: this.ns,
                    instance: this.pageBuilder
                });
                this.initPageBuilderListeners();
                this.isComponentInitialized(true);

                // Disable the domObserver for the entire stage
                $.async({
                    component: this,
                    selector: this.stageSelector
                }, this.disableDomObserver.bind(this));
            }

            if (!this.wysiwygConfigData()['pagebuilder_button']) {
                this.visiblePageBuilder(true);
            }
        },

        /**
         * Disable the domObserver on the PageBuilder stage to improve performance
         *
         * @param {HTMLElement} node
         */
        disableDomObserver: function (node) {
            this.determineIfWithinModal(node);
            domObserver.disableNode(node);
        },

        /**
         * Determine if the current instance is within a modal
         *
         * @param {HTMLElement} element
         */
        determineIfWithinModal: function (element) {
            var modalInnerWrap = $(element).parents('.modal-inner-wrap');

            // Determine if the Page Builder instance is within a modal
            this.isWithinModal = modalInnerWrap.length === 1;

            if (this.isWithinModal) {
                this.modal = modalInnerWrap;
            }
        },

        /**
         * Toggle Page Builder full screen mode
         */
        toggleFullScreen: function () {
            events.trigger('stage:' + this.pageBuilder.id + ':toggleFullscreen', {
                animate: false
            });
        },

        /**
         * Init various listeners on the stage
         */
        initPageBuilderListeners: function () {
            var id = this.pageBuilder.id,
                renderDeferred = $.Deferred(),
                fullScreenDeferred = $.Deferred(),
                rendered = false;

            events.on('stage:' + id + ':readyAfter', function () {
                this.loading(false);
            }.bind(this));

            events.on('stage:' + id + ':renderAfter', function () {
                renderDeferred.resolve();
                rendered = true;
            });

            events.on('stage:' + id + ':masterFormatRenderAfter', function (args) {
                this.value(args.value);
            }.bind(this));

            events.on('stage:' + id + ':fullScreenModeChangeAfter', function (args) {
                if (!args.fullScreen) {
                    if (this.isWithinModal && this.modal) {
                        _.delay(function () {
                            this.modal.css({
                                transform: '',
                                transition: ''
                            });
                        }.bind(this), 350);
                    }

                    if (this.wysiwygConfigData()['pagebuilder_button']) {
                        // Force full screen mode whilst the animation occurs
                        this.transitionOut(true);
                        // Trigger animation out
                        this.transition(false);

                        // Reset the transition out class and hide the stage
                        _.delay(function () {
                            this.transitionOut(false);
                            this.visiblePageBuilder(false);
                        }.bind(this), 185);
                    }
                } else if (args.fullScreen) {
                    if (this.isWithinModal && this.modal) {
                        this.modal.css({
                            transform: 'none',
                            transition: 'none'
                        });
                    }

                    if (this.wysiwygConfigData()['pagebuilder_button']) {
                        this.visiblePageBuilder(true);

                        fullScreenDeferred.resolve();

                        /* eslint-disable max-depth */
                        // If the stage has already rendered once we don't need to wait until animating the stage in
                        if (rendered) {
                            _.defer(function () {
                                this.transition(true);
                            }.bind(this));
                        }
                        /* eslint-enable max-depth */
                    }
                }
            }.bind(this));

            // Wait until the stage is rendered and full screen mode is activated
            $.when(renderDeferred, fullScreenDeferred).done(function () {
                _.defer(function () {
                    this.transition(true);
                }.bind(this));
            }.bind(this));
        }
    });
});
