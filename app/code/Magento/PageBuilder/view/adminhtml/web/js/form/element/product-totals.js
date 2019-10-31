/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['Magento_Ui/js/form/element/abstract'], function (Abstract) {
    'use strict';

    return Abstract.extend({
        defaults: {
            conditionOption: '',
            conditionValues: {},
            totalProductCount: 0,
            disabledProductCount: 0,
            listens: {
                conditionOption: 'updateProductsCount',
                conditionValues: 'updateProductsCount'
            },
            links: {
                value: false
            }
        },

        /** @inheritdoc */
        initObservable: function () {
            return this._super()
                .observe('totalProductCount disabledProductCount');
        },

        /**
         * Update product count.
         *
         */
        updateProductsCount: function () {
            if (!this.conditionOption || !this.conditionValues.hasOwnProperty(this.conditionOption)) {
                return;
            }

            //perform request here;
        }
    });
});
