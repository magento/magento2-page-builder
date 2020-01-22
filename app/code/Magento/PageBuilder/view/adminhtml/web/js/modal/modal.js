/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/modal/modal-component',
    'Magento_PageBuilder/js/events',
    'jquery'
], function (ModalComponent, events, $) {
    'use strict';

    return ModalComponent.extend({
        defaults: {
            titlePrefix: '${ $.options.title }',
            modules: {
                insertForm: '${ $.insertFormProvider }'
            }
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();

            events.on('form:renderAfter', function (params) {
                this.openModal();
                this.setTitle(this.titlePrefix + ' ' + params.title);
                this.startListen(params.id);
            }.bind(this));

            return this;
        },

        /**
         * Set the title only for the current modal
         *
         * @param {String} title
         */
        setTitle: function (title) {
            if (this.title !== title) {
                this.title = title;
            }

            if (this.modal) {
                this.modal.parents('[role="dialog"]').find($(this.modal).modal('option').modalTitle).text(title);
            }
        },

        /**
         * Listen for from save.
         *
         * @param {String} id
         */
        startListen: function (id) {
            events.on('form:' + id + ':saveAfter', function () {
                this.closeModal();
            }.bind(this));

        },

        /**
         * Trigger modalClosed event on external provider
         *
         * @returns {any}
         */
        closeModal: function () {
            this.insertForm() &&
            this.insertForm().externalSource() &&
            this.insertForm().externalSource().trigger('data.modalClosed');

            return this._super();
        }
    });
});
