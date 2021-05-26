/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'mage/translate',
    'Magento_Ui/js/modal/confirm',
    'domReady!'
], function ($, $t, confirm) {
    'use strict';

    return function (config, attributeDropDownEl) {

        var $attributeDropDownEl = $(attributeDropDownEl),
            previousOption = '';

        $attributeDropDownEl.on('focus', function () {
            // Store the current value on focus and on change
            previousOption = this.value;
        });

        $attributeDropDownEl.on('change', function () {

            if (attributeDropDownEl.options.length > 3 ||
                this.value === 'pagebuilder' ||
                previousOption !== 'pagebuilder'
            ) {
                return;
            }

            confirm({
                title: $t(config.modalTitleText),
                content: $t(config.modalContentBody),
                buttons: [{
                    text: $t('Cancel'),
                    class: 'action-secondary action-dismiss action-pagebuilder-cancel',

                    /**
                     * Close modal and trigger 'cancel' action on click
                     */
                    click: function (event) {
                        this.closeModal(event);
                    }
                }, {
                    text: $t('Change Input Type'),
                    class: 'action-primary action-accept',

                    /**
                     * Close modal and trigger 'confirm' action on click
                     */
                    click: function (event) {
                        this.closeModal(event, true);
                    }
                }],
                actions: {

                    /**
                     * Revert back to 'pagebuilder' setting
                     */
                    cancel: function () {
                        $attributeDropDownEl.val('pagebuilder');
                        $attributeDropDownEl.trigger('change');
                    }
                }
            });
        });
    };
});
