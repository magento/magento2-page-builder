/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'Magento_Ui/js/dynamic-rows/dynamic-rows',
    'uiEvents',
    'underscore'
], function (dynamicRows, Events, _) {
    'use strict';

    return dynamicRows.extend({
        defaults: {
            modules: {
                insertForm: '${ $.insertFormProvider }',
                modal: '${$.modalProvider}'
            }
        },

        /** @inheritdoc */
        initLinks: function () {
            this._super();
            Events.on('location:save', function (data) {
                this.modal().closeModal();
                this.reInitData(data);
            }.bind(this), this.name);

            return this;
        },

        /**
         * Open the location modal and insert form with the data from selected record
         *
         * @param {Object} record
         */
        edit: function (record) {
            this.modal().openModal();
            this.insertForm().edit(record.data());
        },

        /**
         * Reinitializing of dynamic row records.
         *
         * @param {Object} data
         */
        reInitData: function (data) {
            var recordData = this.recordData().slice(),
                prop = this.identificationProperty,
                isExists = false;

            _.each(recordData, function (elem, index) {
                if (elem[prop] === data[prop]) {
                    recordData[index] = data;
                    isExists = true;
                }
            }, this);

            if (!isExists) {
                recordData.push(data);
            }

            this.recordData(recordData);
            this.reload();
        },

        /** @inheritdoc */
        destroy: function () {
            this._super();
            Events.off(this.name);
        }
    });
});
