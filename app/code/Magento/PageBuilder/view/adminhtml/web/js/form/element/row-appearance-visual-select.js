/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'Magento_PageBuilder/js/form/element/visual-select'
], function (_, Select) {
    'use strict';

    return Select.extend({
        /**
         * Sets the row appearance warning message text and updates visibility.
         *
         * @param {String} warningMessage
         */
        updateAppearanceMessage: function (warningMessage) {
            if (warningMessage) {
                document.getElementById('warningMessage').innerHTML = warningMessage;
                document.getElementById('warningMessage').style.visibility = 'visible';
            } else {
                document.getElementById('warningMessage').style.visibility = 'hidden';
            }
        }
    });
});
