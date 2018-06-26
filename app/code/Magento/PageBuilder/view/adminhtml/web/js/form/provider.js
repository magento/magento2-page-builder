/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/provider',
    'uiEvents'
], function (Provider, events) {
    'use strict';

    return Provider.extend({
        /** @inheritdoc **/
        initClient: function () {
            return this;
        },

        /** @inheritdoc **/
        save: function () {
            events.trigger('form:' + this.id + ':save', this.get('data'));

            return this;
        }
    });
});
