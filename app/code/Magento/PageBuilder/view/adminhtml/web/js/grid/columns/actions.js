/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/grid/columns/actions'
], function (Actions) {
    'use strict';

    return Actions.extend({
        defaults: {
        },

        /**
         * Callback after click on element.
         *
         * @public
         */
        applyAction: function () {
            switch (this.type) {
                case 'edit-user':
                    $(this).userEdit(this.options)
                        .trigger('editUser');
                    break;

                case 'delete-user':
                    $(this).userDelete(this.options)
                        .trigger('deleteUser');
                    break;

                case 'delete-role':
                    $(this).roleDelete(this.options)
                        .trigger('deleteRole');
                    break;

                default:
                    return true;
            }
        }
    });
});
