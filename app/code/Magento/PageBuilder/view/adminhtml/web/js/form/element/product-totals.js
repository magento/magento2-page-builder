/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'jquery',
    'ko',
    'Magento_PageBuilder/js/form/provider/conditions-data-processor',
    'Magento_Ui/js/form/element/abstract'
], function (_, $, ko, conditionsDataProcessor, Abstract) {
    'use strict';

    return Abstract.extend({
        defaults: {
            conditionOption: '',
            conditionValue: '',
            formData: {},
            totalProductCount: 0,
            listens: {
                conditionOption: 'updateProductTotals',
                conditionValue: 'updateProductTotals',
                formData: 'updateProductTotals'
            },
            imports: {
                formData: '${ $.provider }:data'
            },
            links: {
                value: false
            },
            url: null
        },

        /** @inheritdoc */
        initObservable: function () {
            return this._super()
                .observe('value totalProductCount');
        },

        /**
         * Update product count.
         *
         */
        updateProductTotals: _.debounce(function () {

            if (!this.conditionOption || _.isEmpty(this.formData) ||
                (this.conditionOption === 'sku' && (!this.formData['sku'] || this.formData['sku'] === ''))) {
                return;
            }

            _.extend(this.formData, this.conditionValue);
            conditionsDataProcessor(this.formData, this.conditionOption + '_source');

            $.ajax({
                url: this.url,
                method: 'POST',
                data: {
                    conditionValue: this.formData['conditions_encoded']
                }
            }).done(function (response) {
                if (response['total']) {
                    this.totalProductCount = response['total'];
                    this.value('of ' + this.totalProductCount);
                }
            }.bind(this));
        }, 10),
    });
});
