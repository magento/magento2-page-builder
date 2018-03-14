/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'underscore',
    'text!Magento_PageBuilder/template/modal/dismissible-modal-popup.html',
    'mage/translate',
    'jquery/ui',
    'Magento_Ui/js/modal/confirm',
    'mage/cookies'
], function ($, _, popupTpl, $t) {
    'use strict';

    $.widget('mage.dismissibleConfirm', $.mage.confirm, {
        dismissed: false, // Has the modal been dismissed?
        options: {
            popupTpl: popupTpl,
            dismissible: false, // Can the modal be dismissed?
            dismissKey: 'default', // The key we'll check to see if the modal has already been dismissed
            dismissMessage: $t('Do not show this again'), // Message to display next to the dismiss checkbox
            dismissCheckbox: '[name="modal-dnsa"]' // Selector to retrieve dismiss checkbox
        },

        /**
         * Create widget.
         */
        _create: function () {
            this._super();
            this._observeCheckbox();
        },

        /**
         * Update the internal dismissed property based on the checkbox value
         *
         * @private
         */
        _observeCheckbox: function () {
            var that = this,
                checkbox = this.modal.find(this.options.dismissCheckbox);

            checkbox.change(function () {
                that.dismissed = $(this).is(':checked');
            });
        },

        /**
         * Open modal window.
         */
        openModal: function () {
            // If the modal has been dismissed, then run the confirm & always actions
            if ($.mage.cookies.get(this.options.dismissKey) === 'true') {
                this.options.actions.confirm();

                return this.options.actions.always(); // Always runs after confirm in confirm.js
            }

            return this._super();
        },

        /**
         * Close modal window.
         *
         * @param event
         * @param result
         */
        closeModal: function (event, result) {
            this._super(event, result);
            result = result || false;

            if (result && this.dismissed) {
                $.mage.cookies.set(this.options.dismissKey, 'true', {});
            }
        }
    });

    return function (config) {
        return $('<div></div>').html(config.content).dismissibleConfirm(config);
    };
});
