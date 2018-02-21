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

    return function (config, enableSelectEl) {

        var $enableSelectEl = $(enableSelectEl),
            isEnabledInDatabase = !!parseInt($enableSelectEl.val(), 10);

        $enableSelectEl.on('change', function () {
            var userIsDisabling = !parseInt($enableSelectEl.val(), 10);

            if (!isEnabledInDatabase || !userIsDisabling) {
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
                    text: $t('Turn Off'),
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
                     * Revert back to original Enabled setting
                     */
                    cancel: function () {
                        $enableSelectEl.val(Number(true));
                    }
                }
            });
        });
    };
});
