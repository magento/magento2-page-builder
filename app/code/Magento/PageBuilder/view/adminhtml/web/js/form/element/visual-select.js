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
            noticeMessage: '',
            listens: {
                value: 'setNoticeMessage'
            }
        },

        /**
         * Initializes observable properties of instance
         *
         * @returns {Abstract} Chainable.
         */
        initObservable: function () {
            this._super();
            this.observe('noticeMessage');

            return this;
        },

        /**
         * Parses incoming options, considers options with undefined value property
         *     as caption
         *
         * @param  {Array} nodes
         * @param {Object} captionValue
         * @return {Object} captionValue
         */
        parseOptions: function (nodes, captionValue) {
            var caption,
                value;

            nodes = _.map(nodes, function (node) {
                value = node.value;

                if ((value === null || value === captionValue) && _.isUndefined(caption)) {
                    caption = node.label;
                }

                return node;
            });

            return {
                options: _.compact(nodes),
                caption: _.isString(caption) ? caption : false
            };
        },

        /**
         * Recursively set to object item like value and item.value like key.
         *
         * @param {Array} data
         * @param {Object} result
         * @returns {Object}
         */
        indexOptions: function (data, result) {
            var value;

            result = result || {};

            data.forEach(function (item) {
                value = item.value;

                if (Array.isArray(value)) {
                    this.indexOptions(value, result);
                } else {
                    result[value] = item;
                }
            });

            return result;
        },

        /**
         * Sets 'data' to 'options' observable array, if instance has
         * 'customEntry' property set to true, calls 'setHidden' method
         *  passing !options.length as a parameter
         *
         * @param {Array} data
         * @returns {Object} Chainable
         */
        setOptions: function (data) {
            var captionValue = this.captionValue || '',
                result = this.parseOptions(data, captionValue),
                isVisible;

            this.indexedOptions = this.indexOptions(result.options);

            this.options(result.options);

            if (!this.caption()) {
                this.caption(result.caption);
            }

            if (this.customEntry) {
                isVisible = !!result.options.length;

                this.setVisible(isVisible);
                this.toggleInput(!isVisible);
            }

            return this;
        },

        /**
         * Set the notice message on value change
         *
         * @param {any} value
         * @returns {exports}
         */
        setNoticeMessage: function (value) {
            var noticeMessage = '',
                selectedOption = _.find(this.options(), function (option) {
                    return option.value === value;
                });

            if (selectedOption && typeof selectedOption.noticeMessage !== 'undefined') {
                noticeMessage = selectedOption.noticeMessage;
            }

            this.noticeMessage(noticeMessage);

            return this;
        }
    });
});
