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
            totalNotVisibleProducts: 0,
            previousConditions: false,
            listens: {
                conditionOption: 'updateProductTotals',
                conditionValue: 'updateProductTotals',
                '${ $.provider }:data.modalClosed': 'abortRunningRequest'
            },
            imports: {
                formData: '${ $.provider }:data'
            },
            links: {
                value: false
            },
            url: null,
            valuePlaceholder: $t('of %1 total'),
            disabledPlaceholder: $t('%1 disabled'),
            notVisiblePlaceholder: $t('%1 not visible'),
            showSpinner: true,
            loading: false,
            jqXHR: null
        },

        /**
         * Abort running Ajax request
         */
        abortRunningRequest: function () {
            if (this.jqXHR && this.jqXHR.readyState !== 4) {
                this.jqXHR.abort();
            }
        },

        /** @inheritdoc */
        initObservable: function () {
            return this._super()
                .observe('value totalProductCount totalDisabledProducts totalNotVisibleProducts loading');
        },

        /**
         * If we haven't aborted the request, continue and display the error
         *
         * @param {Object} jqXHR
         */
        callSuperError: function (jqXHR) {
            // eslint-disable-next-line jquery-no-bind-unbind
            var superError = $.ajaxSettings.error.bind(window, jqXHR);

            superError();
        },

        /**
         * Update product count.
         */
        updateProductTotals: _.debounce(function () {
            var totalText,
                negativeTotals = [];

            if (!this.conditionOption || _.isEmpty(this.formData)) {
                return;
            }

            if (this.conditionOption === 'category_ids' && typeof this.formData['category_ids'] !== 'string') {
                this.formData['category_ids'] = '';
            }

            _.extend(this.formData, this.conditionValue);
            conditionsDataProcessor(this.formData, this.conditionOption + '_source');

            // Store the previous conditions so we don't update the totals when nothing has changed
            if (this.previousConditions === this.formData['conditions_encoded']) {
                return;
            }
            this.previousConditions = this.formData['conditions_encoded'];

            this.loading(true);
            this.abortRunningRequest();
            this.jqXHR = $.ajax({
                url: this.url,
                method: 'POST',
                data: {
                    conditionValue: this.formData['conditions_encoded']
                },
                error: function (jqXHR) {
                    if (jqXHR.statusText !== 'abort') {
                        this.callSuperError(jqXHR);
                    }
                }.bind(this)
            }).done(function (response) {
                this.totalProductCount(parseInt(response.total, 10));
                this.totalDisabledProducts(parseInt(response.disabled, 10));
                this.totalNotVisibleProducts(parseInt(response.notVisible, 10));
                totalText = this.valuePlaceholder
                    .replace('%1', parseInt(response.total, 10));

                if (parseInt(response.disabled, 10) > 0) {
                    negativeTotals.push(this.disabledPlaceholder.replace('%1', parseInt(response.disabled, 10)));
                }

                if (parseInt(response.notVisible, 10) > 0) {
                    negativeTotals.push(this.notVisiblePlaceholder.replace('%1', parseInt(response.notVisible, 10)));
                }

                if (negativeTotals.length > 0) {
                    totalText += ' (' + negativeTotals.join(', ') + ')';
                }

                this.value(totalText);
                this.loading(false);
            }.bind(this)).fail(function () {
                if (this.jqXHR.statusText !== 'abort') {
                    this.value($t('An unknown error occurred. Please try again.'));
                }
                this.loading(false);
            }.bind(this));
        }, 10)
    });
});
