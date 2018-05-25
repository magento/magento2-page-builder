/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore'
], function (_) {
    'use strict';

    var setDisabledSetting = {

        /**
         * Set the button as disabled when the value passed in is true
         *
         * @param {boolean} value
         */
        setDisabled: function (value) {
            this.disabled(value);
        }
    };

    return function (target) {
        return target.extend(setDisabledSetting);
    };
});
