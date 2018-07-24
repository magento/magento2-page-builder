/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'Magento_PageBuilder/js/form/element/visual-select'
], function (_, Select) {
    'use strict';

    return Select.extend({
        defaults: {
            noticeMessage: ''
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
    });
});
