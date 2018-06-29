/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/provider',
    'Magento_PageBuilder/js/events'
], function (Provider, events) {
    'use strict';

    return Provider.extend({
        /** @inheritdoc **/
        initClient: function () {
            return this;
        },

        /** @inheritdoc **/
        save: function () {
            events.trigger('mapLocation:saveAfter', this.get('data'));

            return this;
        }
    });
});
