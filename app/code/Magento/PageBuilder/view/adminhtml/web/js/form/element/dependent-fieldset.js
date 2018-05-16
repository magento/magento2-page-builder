/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/components/fieldset'
], function (Fieldset) {
    'use strict';

    return Fieldset.extend({
        defaults: {
            originalLabelValue: ''
        },

        /**
         * Observe label
         * {@inheritDoc}
         */
        initObservable: function () {
            this._super().observe('label');

            return this;
        },

        /**
         * Store original label value
         * {@inheritDoc}
         */
        initConfig: function () {
            this._super();
            this.originalLabelValue = this.label;
        },

        /**
         * Hide fieldset if number of field options is <= 1 and it is the only element in the group
         *
         * @param {Array} options
         */
        hideFieldset: function (options) {
            this.visible(options.length > 1 || this.elems().length > 1);
        },

        /**
         * Hide label if number of field options is <= 1
         *
         * @param {Array} options
         */
        hideLabel: function (options) {
            this.label(options.length > 1 ? this.originalLabelValue : '');
        }
    });
});
