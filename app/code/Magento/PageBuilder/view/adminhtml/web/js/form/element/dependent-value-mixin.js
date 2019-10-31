/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([], function () {
    'use strict';

    var setDependentValuesSetting = {
        defaults: {
            dependentValues: {}
        },

        /**
         * Change value of component if it present in dependentValues
         */
        setDependentValues: function (value) {
            if (this.dependentValues.hasOwnProperty(value)) {
                this.previousValue = this.value();
                this.value(this.dependentValues[value]);
            } else if (this.hasOwnProperty('previousValue')) {
                this.value(this.previousValue);
            }
        }
    };

    return function (target) {
        return target.extend(setDependentValuesSetting);
    };
});
