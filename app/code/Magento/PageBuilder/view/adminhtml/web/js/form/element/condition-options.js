/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_PageBuilder/js/form/element/visual-select'
], function (Select) {
    'use strict';

    return Select.extend({

        /** @inheritdoc */
        initialize: function () {
            this._super();

            this.showRelatedElement(this.value());

            return this;
        },

        /** @inheritdoc */
        initObservable: function () {
            this._super();

            this.options().forEach(function (option) {
                this.observe(option.value + 'Visible');
            }.bind(this));

            return this;
        },

        /** @inheritdoc */
        onUpdate: function (value) {
            this.showRelatedElement(value);

            return this._super();
        },

        /**
         * Sets exported property, linked with visibility of the element, defined as option
         *
         * @param {String} value
         * @returns {Object} Chainable
         */
        showRelatedElement: function (value) {
            this[value + 'Visible'](true);
            this.options().forEach(function (option) {
                if (value !== option.value) {
                    this[option.value + 'Visible'](false);
                }
            }.bind(this));

            return this;
        }
    });
});
