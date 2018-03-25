/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/element/wysiwyg',
    'mage/translate',
    'Magento_PageBuilder/js/component/event-bus',
    'Magento_PageBuilder/js/component/page-builder',
    'advanced-cms-init-config'
], function (Wysiwyg, $t, EventBus, PageBuilder, config) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added PageBuilder functionality
     */
    return Wysiwyg.extend({
        defaults: {
            pageBuilder: {},
            visiblePageBuilder: false,
            isComponentInitialized: false,
            wysiwygConfigData: {},
            pageBuilderEditButtonText: $t('Edit with Page Builder')
        },

        /** @inheritdoc */
        initialize: function () {
            this._super()
                .initPageBuilder();

            return this;
        },

        /** @inheritdoc */
        initObservable: function () {
            this._super()
                .observe('visiblePageBuilder wysiwygConfigData loading');

            return this;
        },

        /** Handle a click event requesting that we build PageBuilder. */
        initPageBuilder: function () {
            if (!this.isComponentInitialized) {
                this.loading(true);
                this.pageBuilder = new PageBuilder(config, this.initialValue);
                this.initPageBuilderListeners();
            }

            if (!this.wysiwygConfigData()['pagebuilder_button']) {
                this.visiblePageBuilder(true);
            }
        },

        /** Toggle PageBuilder full screen. */
        toggleFullScreen: function () {
            EventBus.trigger('pagebuilder:toggleFullScreen:' + this.pageBuilder.id, {});
        },

        /** Init listeners of stage. */
        initPageBuilderListeners: function () {
            var stageId = this.pageBuilder.stageId,
                pageBuilderId = this.pageBuilder.id;

            EventBus.on('stage:ready:' + stageId, function () {
                this.isComponentInitialized = true;
                this.loading(false);
            }.bind(this));
            EventBus.on('stage:renderTree:' + stageId, function (e, data) {
                this.value(data.value);
            }.bind(this));
            EventBus.on('pagebuilder:fullScreen:' + pageBuilderId, function (e, data) {
                if (!data.fullScreen && this.wysiwygConfigData()['pagebuilder_button']) {
                    this.visiblePageBuilder(false);
                } else if (data.fullScreen && this.wysiwygConfigData()['pagebuilder_button']) {
                    this.visiblePageBuilder(true);
                }
            }.bind(this));

        }
    });
});
