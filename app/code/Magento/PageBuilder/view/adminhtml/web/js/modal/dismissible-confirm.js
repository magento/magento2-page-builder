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
], function ($, _, promptContentTmpl, $t) {
    'use strict';

    /**
     * Create buttons array for modal options
     *
     * @param {Boolean} haveCancelButton
     * @return {Object}
     */
    function buttonsConfig(haveCancelButton) {
        var cancelButton = {
            text: $.mage.__('Cancel'),
            class: 'action-secondary action-dismiss',

            /**
             * Click handler.
             */
            click: function () {
                this.closeModal(false);
            }
        },
            confirmButton = {
            text: $.mage.__('OK'),
            class: 'action-primary action-accept',

            /**
             * Click handler.
             */
            click: function () {
                this.closeModal(true);
            }
        },
            buttons = [];

        if (haveCancelButton !== false) {
            buttons.push(cancelButton);
        }
        buttons.push(confirmButton);

        return buttons;
    }

    $.widget('mage.dismissibleConfirm', $.mage.prompt, {
        options: {
            promptContentTmpl: promptContentTmpl,
            dismissible: false, // Can the modal be dismissed?
            dismissKey: 'default', // The key we'll check to see if the modal has already been dismissed
            dismissMessage: $t('Do not show this again'), // Message to display next to the dismiss checkbox
            dismissCheckbox: '[name="modal-dnsa"]' // Selector to retrieve dismiss checkbox
        },

        /**
         * Open the modal window, if the modal has been dismissed, then run the confirm & always actions and don't
         * don't open the modal
         *
         * @returns {*}
         */
        openModal: function () {
            if ($.mage.cookies.get(this.options.dismissKey) === 'true') {
                this.options.actions.confirm();

                return this.options.actions.always(); // Always runs after confirm in confirm.js
            }

            return this._super();
        },

        /**
         * Close modal window.
         *
         * @param {Boolean} result
         */
        closeModal: function (result) {
            this._super(result);

            if (result && this._isDismissed()) {
                $.mage.cookies.set(this.options.dismissKey, 'true', {});
            }
        },

        /**
         * Is the dismissed checkbox checked?
         *
         * @private
         */
        _isDismissed: function () {
            return this.modal.find(this.options.dismissCheckbox).is(':checked');
        }
    });

    return function (config) {
        config.buttons = buttonsConfig(config.haveCancelButton);
        delete config.haveCancelButton;

        return $('<div></div>').html(config.content).dismissibleConfirm(config);
    };
});
