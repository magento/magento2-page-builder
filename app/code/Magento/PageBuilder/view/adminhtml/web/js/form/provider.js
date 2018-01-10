/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict*/

define([
    'underscore',
    'Magento_Ui/js/form/provider',
    'uiRegistry'
], function (_, provider, registry) {
    'use strict';

    return provider.extend({
        /**
         * Initializes provider component.
         *
         * @returns {Provider} Chainable.
         */
        initialize: function () {
            // Set the data for the current provider from the global state
            this.set('data', registry.get('_pagebuilder_edit_data'));

            return this._super();
        }
    });
});
