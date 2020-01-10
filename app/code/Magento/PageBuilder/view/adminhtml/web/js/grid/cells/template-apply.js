/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_Ui/js/grid/columns/multiselect',
    'Magento_Ui/js/modal/confirm',
    'mage/translate'
], function (Select, confirm, $t) {
    'use strict';

    return Select.extend({
        defaults: {
            headerTmpl: 'ui/grid/columns/text',
            bodyTmpl: 'Magento_PageBuilder/grid/cells/template-apply',
            label: '',
            lastSelected: null
        },

        /** @inheritdoc */
        initObservable: function () {
            this._super()
                .observe('lastSelected');

            return this;
        },

        /** @inheritdoc */
        isSelected: function () {
            return false;
        },

        /** @inheritdoc **/
        select: function (id) {
            var self = this,
                superCall = this._super.bind(this);

            confirm({
                title: $t('Apply Template'),
                content: $t('Are you sure you want to apply this template? This will overwrite any existing content.'),
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
                    text: $t('Apply'),
                    class: 'action-primary action-accept',

                    /**
                     * Close modal and trigger 'confirm' action on click
                     */
                    click: function (event) {
                        superCall();
                        self.lastSelected(id);
                        this.closeModal(event);
                    }
                }]
            });

            return this;
        },

        /** @inheritdoc */
        _setSelection: function () {
            return this;
        }
    });
});
