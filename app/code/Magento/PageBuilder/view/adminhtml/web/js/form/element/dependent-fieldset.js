/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/components/fieldset'
], function (Fieldset) {
    'use strict';

    return Fieldset.extend({
        /**
         * Hide fieldset
         *
         * @param {Array} options
         */
        appearancesHidden: function (options) {
            this.visible(options.length > 1);
        }
    });
});
