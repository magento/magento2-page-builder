/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'jquery',
    'underscore',
    'jquery-ui-modules/widget',
    'Magento_Ui/js/modal/alert',
    'mage/translate'
], function ($, _) {
    'use strict';

    $.widget('mage.confirmAlert', $.mage.alert, {
        /**
         * Fix issue with zIndex when removing the alert from the screen
         * @private
         */
        _unsetActive: function () {
            this._super();

            if (this.overlay) {
                this.overlay.zIndex('');
            }
        }
    });

    return function (config) {
        return $('<div></div>').html(config.content).confirmAlert(config);
    };
});
