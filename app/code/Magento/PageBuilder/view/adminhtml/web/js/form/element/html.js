/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/components/html',
    'jquery',
    'underscore'
], function (Html, $, _) {
    'use strict';

    return Html.extend({
        defaults: {
            inputSelector: '[data-form-part=${ $.ns }]',
            elements: [],
            value: {}
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();
            this.initInputListener();

            return this;
        },

        /** @inheritdoc */
        initObservable: function () {
            return this._super()
                .observe('value');
        },

        /**
         * Listen for value change on each field that has been added.
         */
        initInputListener: function () {
            $.async({
                component: this,
                selector: this.inputSelector
            }, function (el) {
                this.elements.push(el);
                $(el).on('change', this.updateValue.bind(this));
                $(el).nextAll('.rule-param-apply').on('click', function () {
                    $(el).change();
                });
                $(el).closest('li').find('.rule-param-remove').on('click', function () {
                    $(el).val('').change();
                });
                this.updateValue(this);
            }.bind(this));
        },

        /**
         * Collect data and update value.
         */
        updateValue: function () {
            var result = {},
                name;

            this.elements.forEach(function (item) {
                switch (item.type) {
                    case 'checkbox':
                        result[item.name] = +!!item.checked;
                        break;

                    case 'radio':
                        if (item.checked) {
                            result[item.name] = item.value;
                        }
                        break;

                    case 'select-multiple':
                        name = item.name.substring(0, item.name.length - 2); //remove [] from the name ending
                        result[name] = _.pluck(item.selectedOptions, 'value');
                        break;

                    default:
                        result[item.name] = item.value;
                }
            });

            this.value(result);
        }
    });
});
