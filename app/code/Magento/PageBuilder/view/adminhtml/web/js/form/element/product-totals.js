/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'jquery',
    'mage/translate',
    'Magento_PageBuilder/js/form/provider/conditions-data-processor',
    'Magento_Ui/js/form/element/abstract'
], function (_, $, $t, conditionsDataProcessor, Abstract) {
    'use strict';

    return Abstract.extend({
        defaults: {
            conditionOption: '',
            conditionValue: '',
            formData: {},
            totalProductCount: 0,
            totalDisabledProducts: 0,
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
            url: null,
            valuePlaceholder: $t('of %1 (%2 disabled)')
        },

        /** @inheritdoc */
        initObservable: function () {
            return this._super()
                .observe('value totalProductCount totalDisabledProducts');
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

            if (this.conditionOption === 'category_ids' && typeof this.formData[this.conditionOption] != "string") {
                this.formData[this.conditionOption] = '';
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
                    this.totalProductCount(response['total']);
                    this.totalDisabledProducts(response['disabled']);
                    this.value(
                        this.valuePlaceholder
                            .replace('%1', this.totalProductCount())
                            .replace('%2', this.totalDisabledProducts())
                    );
                }.bind(this)
            ).fail(function () {
                this.value($t("An unknown error occurred. Please try again."));
            }.bind(this));
        }, 10),
    });
});
