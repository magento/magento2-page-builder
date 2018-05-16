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
         * Hide fieldset if appearance field options is <= 1
         *
         * @param {Array} options
         */
        appearancesHidden: function (options) {
            this.visible(options.length > 1);
        },

        /**
         * Delegate element to show/hide based on number of elements in fieldset
         *
         * @param {Array} options
         */
        appearancesHiddenLabelOnlyIfOtherElementsExist: function (options) {
            var otherElemsExist = this.elems().length > 1;

            if (!otherElemsExist) { // show/hide fieldset
                this.appearancesHidden(options);

                return;
            }

            // show/hide label
            this.label(options.length > 1 ? this.originalLabelValue : '');
        }
    });
});
