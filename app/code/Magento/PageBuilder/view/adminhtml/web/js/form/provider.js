/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/provider',
    'Magento_PageBuilder/js/events',
    'jquery'
], function (Provider, events, $) {
    'use strict';

    return Provider.extend({
        /** @inheritdoc **/
        initClient: function () {
            return this;
        },

        /** @inheritdoc **/
        save: function () {
            events.trigger('form:' + this.id + ':saveAfter', this.get('data'));
            this._refreshSlickOnSave();

            return this;
        },

        /**
         * Refresh slick slide of parent window
         *
         * @private
         */
        _refreshSlickOnSave: function () {
            let slickObj = $('.slick-list.draggable'),
                parentSlick,
                currentSettings;

            if (slickObj.length === 0) {
                return;
            }

            parentSlick = slickObj.parent();

            if (typeof parentSlick.slick !== 'function') {
                return;
            }

            currentSettings = parentSlick.slick('getSlick').options;

            if (!currentSettings.infinite) {
                return;
            }

            if (currentSettings.rows > 0) {
                parentSlick.slick('slickSetOption', 'rows', 0);
            }

            parentSlick.slick('refresh');
        }
    });
});
