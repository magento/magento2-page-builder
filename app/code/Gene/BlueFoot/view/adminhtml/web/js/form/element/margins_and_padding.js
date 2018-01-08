/*eslint-disable vars-on-top, strict */

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'ko',
    'Magento_Ui/js/form/element/abstract'
], function (_, ko, Abstract) {
    'use strict';

    var defaultValue = 0;

    return Abstract.extend({
        defaults: {
            elementTmpl: 'Gene_BlueFoot/form/element/margins_and_padding',
            marginTop: defaultValue,
            marginRight: defaultValue,
            marginBottom: defaultValue,
            marginLeft: defaultValue,
            paddingTop: defaultValue,
            paddingRight: defaultValue,
            paddingBottom: defaultValue,
            paddingLeft: defaultValue,
            listens: {
                marginTop: 'updateValue',
                marginRight: 'updateValue',
                marginBottom: 'updateValue',
                marginLeft: 'updateValue',
                paddingTop: 'updateValue',
                paddingRight: 'updateValue',
                paddingBottom: 'updateValue',
                paddingLeft: 'updateValue'
            }
        },

        /**
         * Init observable on our margin & padding properties
         *
         * @returns {exports}
         */
        initObservable: function () {
            this._super();
            this.observe('marginTop marginRight marginBottom marginLeft '
                + 'paddingTop paddingRight paddingBottom paddingLeft');

            return this;
        },

        /**
         * Update the value on individual property changes
         */
        updateValue: function () {
            this.value({
                margin: {
                    top: this.marginTop(),
                    right: this.marginRight(),
                    bottom: this.marginBottom(),
                    left: this.marginLeft()
                },
                padding: {
                    top: this.paddingTop(),
                    right: this.paddingRight(),
                    bottom: this.paddingBottom(),
                    left: this.paddingLeft()
                }
            });
        },

        /**
         * On set of the initial value update our individual observables
         *
         * @returns {exports}
         */
        setInitialValue: function () {
            this._super();
            this._updateObservables(this.initialValue);
            return this;
        },

        /**
         * On update of the value property update our individual observables, the data provider can have data
         * set on it after the initial construction, this ensures we translate our values
         *
         * @returns {exports}
         */
        onUpdate: function () {
            this._super();
            this._updateObservables(this.value());
            return this;
        },

        /**
         * Update the observable properties
         *
         * @param value
         * @private
         */
        _updateObservables: function(value) {
            if (value && _.isObject(value)) {
                _.each(value, function(attributeData, attributeType) {
                    _.each(attributeData, function(attributeValue, attributeDirection) {
                        if (attributeValue !== defaultValue) {
                            this[attributeType + attributeDirection.capitalize()](attributeValue);
                        }
                    }, this);
                }, this);
            }
        }
    });
});
