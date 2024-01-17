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
            fieldsetSelector: 'fieldset.admin__fieldset',
            overlaySelector: '.pagebuilder-wysiwyg-overlay',
            overlayMouseover: false,
            pageBuilder: false,
            visiblePageBuilder: false,
            isComponentInitialized: false,
            wysiwygConfigData: {
                isFullScreen: false
            },
            pageBuilderEditButtonText: $t('Edit with Page Builder'),
            isWithinModal: false,
            modal: false
        },

        /**
         * @inheritdoc
         */
        initialize: function () {
            this._super();

            if (!this.wysiwygConfigData()['pagebuilder_button'] ||
                this.wysiwygConfigData()['pagebuilder_content_snapshot']) {
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
                    'transitionOut overlayMouseover');

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
                this.pageBuilder = new PageBuilder(
                  this.wysiwygConfigData(),
                  this.initialValue
                );
                if (!this.source.get('pageBuilderInstances')) {
                    this.source.set('pageBuilderInstances', []);
                }
                // Register PageBuilder instance in the data provider in case the event "pagebuilder:register"
                // is triggered before the subscribers are registered
                this.source.get('pageBuilderInstances').push(this.pageBuilder);
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

                if (!this.wysiwygConfigData()['pagebuilder_button'] ||
                    this.wysiwygConfigData()['pagebuilder_content_snapshot']) {
                    this.visiblePageBuilder(true);
                }
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
            domObserver.disableNode($(node).parents(this.fieldsetSelector)[0]);
        },

        /**
         * Changes tabindex and content editable on stage elements
         */
        toggleFocusableElements: function () {
            var pageBuilderSelector = '#' + this.pageBuilder.id,
                editable = $(pageBuilderSelector).find('[contenteditable]:not(.mceNonEditable)'),
                focusableSelector = ' :focusable:not(' + this.overlaySelector + ')',
                mediaSelector = pageBuilderSelector + ' iframe,' + pageBuilderSelector + ' video',
                tabIndexValue = this.pageBuilder.isFullScreen() ? '0' : '-1',
                editableValue = this.pageBuilder.isFullScreen();

            editable.attr('contenteditable', editableValue);
            if (this.pageBuilder.isFullScreen()) {
                $(pageBuilderSelector + focusableSelector)
                    .each(function () {
                        if ($(this).data('original-tabindex')) {
                            $(this).attr('tabindex', $(this).data('original-tabindex'));
                        } else if ($(this).data('original-tabindex') === '') {
                            $(this).removeAttr('tabindex');
                        }
                        $(this).removeData('original-tabindex');
                    });
            } else {
                $(pageBuilderSelector + focusableSelector).each(function () {
                    if ($(this).attr('tabindex')) {
                        $(this).data('original-tabindex', $(this).attr('tabindex'));
                    } else {
                        $(this).data('original-tabindex', '');
                    }
                    $(this).attr('tabindex', '-1');
                });
            }
            $(mediaSelector).attr('tabindex', tabIndexValue);
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
         * Press Enter key on Overlay
         */
        onOverlayKeyDown: function (context, event) {
            if (event.which === 13 || event.keyCode === 13) {
                this.pageBuilderEditButtonClick(context, event);
            }

            return true;
        },

        /**
         * Toggle Page Builder full screen mode
         */
        toggleFullScreen: function () {
            events.trigger('stage:' + this.pageBuilder.id + ':toggleFullscreen', {
                animate: !!this.wysiwygConfigData()['pagebuilder_content_snapshot']
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

                if (this.wysiwygConfigData()['pagebuilder_content_snapshot']) {
                    this.toggleFocusableElements();
                }
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

                    if (this.wysiwygConfigData()['pagebuilder_button'] &&
                        !this.wysiwygConfigData()['pagebuilder_content_snapshot']) {
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

                    if (this.wysiwygConfigData()['pagebuilder_button'] &&
                        !this.wysiwygConfigData()['pagebuilder_content_snapshot']) {
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

                if (this.wysiwygConfigData()['pagebuilder_content_snapshot']) {
                    this.toggleFocusableElements();
                }
            }.bind(this));

            // Wait until the stage is rendered and full screen mode is activated
            $.when(renderDeferred, fullScreenDeferred).done(function () {
                _.defer(function () {
                    this.transition(true);
                }.bind(this));
            }.bind(this));
        },

        /** @inheritdoc */
        destroy: function () {
            this.pageBuilder && this.pageBuilder.destroy();
            this._super();
        }
    });
});
