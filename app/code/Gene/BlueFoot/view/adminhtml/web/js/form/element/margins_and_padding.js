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
            marginTop: ko.observable(defaultValue),
            marginRight: ko.observable(defaultValue),
            marginBottom: ko.observable(defaultValue),
            marginLeft: ko.observable(defaultValue),
            paddingTop: ko.observable(defaultValue),
            paddingRight: ko.observable(defaultValue),
            paddingBottom: ko.observable(defaultValue),
            paddingLeft: ko.observable(defaultValue),
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

        updateValue: function() {
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

        setInitialValue: function () {
            var currentValue = this.value();

            if (_.isObject(currentValue)) {
                _.each(currentValue, function(attributeData, attributeType) {
                    _.each(attributeData, function(attributeValue, attributeDirection) {
                        if (attributeValue !== defaultValue) {
                            this[attributeType + attributeDirection.capitalize()](attributeValue);
                        }
                    }, this);
                }, this);
            }

            return this._super();
        }
    });
});
