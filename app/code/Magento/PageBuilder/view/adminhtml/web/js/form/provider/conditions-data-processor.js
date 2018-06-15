/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'mage/utils/objects',
    'Magento_Rule/conditions-data-normalizer'
], function (_, objectUtils, ConditionsDataNormalizer) {
    'use strict';

    var serializer = new ConditionsDataNormalizer();

    return function (data, attribute) {
        var pairs = {};

        /*
         * The Condition Rule Tree is not a UI component and doesn't provide good data.
         * The best solution is to implement the tree as a UI component that can provide good data but
         * that is outside of the scope of the feature for now.
         */
        _.each(data, function (element, key) {
            // parameters is hardcoded in the Magento\Rule model that creates the HTML forms.
            if (key.indexOf('parameters[' + attribute + ']') === 0) {
                // Remove the bad, un-normalized data.
                delete data[key];
                pairs[key] = element;
            }
        });

        if (!_.isEmpty(pairs)) {
            objectUtils.nested(data, attribute, JSON.stringify(serializer.normalize(pairs).parameters[attribute]));
        }
    };
});
