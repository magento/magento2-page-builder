/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/modal/modal-component',
    'uiEvents'
], function (ModalComponent, events) {
    'use strict';

    return ModalComponent.extend({
        defaults: {
            titlePrefix: '${ $.options.title }'
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();

            events.on('form:render', function (params) {
                this.openModal();
                this.setTitle(this.titlePrefix + ' ' + params.title);
                this.startListen(params.id);
            }.bind(this));

            return this;
        },

        /**
         * Listen for from save.
         *
         * @param {String} id
         */
        startListen: function (id) {
            events.on('form:' + id + ':save', function () {
                this.closeModal();
            }.bind(this));

        }
    });
});
