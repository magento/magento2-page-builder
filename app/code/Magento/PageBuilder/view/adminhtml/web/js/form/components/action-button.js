/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/components/button'
], function (Button) {
    'use strict';

    return Button.extend({
        defaults: {
            modules: {
                parent: '${ $.parentName }',
                insertForm: '${ $.insertFormProvider }',
                modal: '${ $.modalProvider }'
            }
        },

        /**
         * Edit form with data assigning.
         */
        edit: function () {
            this.modal().openModal();
            this.insertForm().edit(this.parent().data());
        },

        /**
         * Delete record from dynamic row.
         */
        deleteRecord: function () {
            var record = this.parent(),
                dynamicRow = record.parentComponent(),
                prop = dynamicRow.identificationProperty,
                id = record.data()[prop];

            dynamicRow.deleteRecord(record.index, id);
        }
    });
});
