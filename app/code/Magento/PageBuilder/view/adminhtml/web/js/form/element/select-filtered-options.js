/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'Magento_Ui/js/form/element/select'
], function (_, Select) {
    'use strict';

    return Select.extend({

        defaults: {
            excludeOptions: []
        },

        /** @inheritdoc */
        onUpdate: function () {
            if (!this.updatedByFilter) {
                this.transferredValue = null;
            } else {
                this.updatedByFilter = false;
            }

            return this._super();
        },

        /**
         * Excluding options according excludeOptions configuration based on the passed value
         *
         * @param {String} value
         */
        filter: function (value) {
            var source = this.initialOptions,
                initialValue = this.value(),
                result,
                excludeOptions =  this.excludeOptions[value],
                excludedOptionsArray = excludeOptions ? excludeOptions.split(',') : [];

            result = _.filter(source, function (item) {
                return !excludeOptions || excludedOptionsArray.indexOf(item.value) === -1;
            });

            this.updatedByFilter = true;
            this.setOptions(result);

            this.value(this.transferredValue ? this.transferredValue : initialValue);

            if (excludedOptionsArray.indexOf(initialValue) !== -1) {
                this.transferredValue = initialValue;
            } else {
                this.transferredValue = null;
            }
        }
    });
});
