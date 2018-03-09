/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore'
], function (_) {
    'use strict';

    var setDisabledSetting = {
        defaults: {
            disabledValues: []
        },

        /**
         * Set the field as disabled when it's empty or is equal to a value within disabledValues
         *
         * @param {Array} value
         */
        setDisabled: function (value) {
            if (_.indexOf(_.values(this.disabledValues), value) !== -1) {
                this.disable();
            } else {
                this.enable();
            }
        }
    };

    return function (target) {
        return target.extend(setDisabledSetting);
    };
});
