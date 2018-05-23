/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'uiEvents',
    'Magento_PageBuilder/js/form/provider',
    'Magento_Rule/conditions-data-normalizer'
], function (_, events, Provider, ConditionsDataNormalizer) {
    'use strict';

    var serializer = new ConditionsDataNormalizer();

    return Provider.extend({
        /** @inheritdoc **/
        save: function () {
            var pairs = {},
                data = this.get('data');

            /*
             * The Condition Rule Tree is not a UI component and doesn't provide good data.
             * The best solution is to implement the tree as a UI component that can provide good data but
             * that is outside of the scope of the feature for now.
             */
            _.each(data, function (element, key) {
                if (key.substr(0, 22) === 'parameters[conditions]') {
                    // Remove the bad, un-normalized data.
                    delete data[key];
                    pairs[key] = element;
                }
            });

            if (!_.isEmpty(pairs)) {
                data['conditions_encoded'] = JSON.stringify(serializer.normalize(pairs).parameters.conditions);
            }

            return this._super();
        }
    });
});
