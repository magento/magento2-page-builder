/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'uiLayout',
    'uiElement',
    'Magento_PageBuilder/js/config'
], function ($, layout, Element, Config) {
    'use strict';

    return Element.extend({
        template: 'Nathan_Mymod/block-picker',
        requestParameter: null,
        dataUrlConfigKey: null,
        meta: {},
        modalName: null,
        defaults: {
            listens: {
                id: 'updateFromServer'
            }
        },

        initObservable: function () {
            this._super();
            this.observe(['id', 'meta']);

            return this;
        },

        /**
         * Updates the block data from the server
         */
        updateFromServer: function () {
            var id = this.id(),
                requestData = {};

            if (!id || !this.requestParameter || !this.dataUrlConfigKey) {
                return;
            }

            requestData.method = 'POST';
            requestData.data = {
                'form_key': window.FORM_KEY
            };
            requestData.data[this.requestParameter] = id;
            $('body').trigger('processStart');

            $.ajax(Config.getConfig(this.dataUrlConfigKey), requestData)
                .done(function (response) {
                    if ($.isEmptyObject(response)) {
                        return;
                    }

                    this.meta(response);
                    $('body').trigger('processStop');
                }.bind(this));
        },

        getButton: function() {
            var elementConfig = {
                    name: this.name + '_button',
                    title: this.buttonTitle,
                    component: 'Magento_Ui/js/form/components/button',
                    actions: [{
                        targetName: this.modalName,
                        actionName: 'openModal'
                    }]
                };

            layout([elementConfig]);

            return this.requestModule(elementConfig.name);
        }
    });
});
