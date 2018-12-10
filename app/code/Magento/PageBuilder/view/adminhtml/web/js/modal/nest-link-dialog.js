/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Extend the confirmation prompt to allow for an additional checkbox to be displayed. The checkbox enables the user to
 * dismiss subsequent prompts of the same type based on their dismissKey.
 *
 * Once a type is dismissed a cookie is set and all future instances of that prompt are bypassed. This cookie is
 * cleared once the user logs out and back in via an observer.
 */
define([
    'jquery',
    'underscore',
    'text!Magento_PageBuilder/template/modal/dismissible-modal-content.html',
    'mage/translate',
    'Magento_Ui/js/modal/prompt',
    'mage/cookies'
], function ($, _, promptContentTmpl) {
    'use strict';

    $.widget('mage.dismissibleConfirm', $.mage.prompt, {
        options: {
            promptContentTmpl: promptContentTmpl,
            buttons: [{
                text: $.mage.__('Revert Link'),
                class: 'action-primary action-accept',

                /**
                 * Click handler.
                 */
                click: function () {
                    this.closeModal(true);
                }
            }]
        },
    });

    return function (config) {
        return $('<div></div>').html(config.content).dismissibleConfirm(config);
    };
});
