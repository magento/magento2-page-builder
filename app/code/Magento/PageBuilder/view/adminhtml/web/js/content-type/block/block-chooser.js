/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'uiLayout',
    'uiElement',
    'Magento_PageBuilder/js/config',
    'mage/translate',
    'mage/utils/objects'
], function ($, layout, Element, Config, $t, objectUtils) {
    'use strict';

    return Element.extend({
        id: null,
        meta: {},
        errorMessage: null,
        defaults: {
            template: 'Nathan_Mymod/block-picker',
            requestParameter: null,
            dataUrlConfigPath: null,
            modalName: null,
            buttonComponentConfig: {
                title: '${ $.buttonTitle }',
                component: 'Magento_Ui/js/form/components/button',
                actions: [{
                    targetName: '${ $.modalName }',
                    actionName: 'openModal'
                }]
            },
            requestData: {
                method: 'POST',
                data: {
                    'form_key': window.FORM_KEY
                }
            },
            listens: {
                id: 'updateFromServer'
            }
        },

        /** @inheritdoc */
        initObservable: function () {
            return this._super()
                .observe('id meta errorMessage');
        },

        /**
         * Updates the block data from the server
         */
        updateFromServer: function () {
            var requestData = $.extend(true, {}, this.requestData);

            if (!this.id() || !this.requestParameter || !this.dataUrlConfigPath) {
                return;
            }

            requestData.data[this.requestParameter] = this.id();
            $('body').trigger('processStart');

            $.ajax(objectUtils.nested(Config.getConfig(), this.dataUrlConfigPath), requestData)
                .always(function () {
                    $('body').trigger('processStop');
                    this.errorMessage(null);
                }.bind(this))
                .done(function (response) {
                    if (typeof response !== 'object' || response.error) {
                        this.meta({});
                        this.errorMessage($t('Sorry, there was an error getting requested content. ' +
                            'Please contact the store owner.'));

                        return;
                    } else if ($.isArray(response)) {
                        this.meta({});
                        this.errorMessage($t('The currently selected block does not exist.'));

                        return;
                    }

                    this.meta(response);
                }.bind(this))
                .fail(function () {
                    this.meta({});
                    this.errorMessage($t('Sorry, there was an error getting requested content. ' +
                        'Please contact the store owner.'));
                }.bind(this));
        },

        /**
         * Creates the button component for rendering
         * @returns {Object} The button component
         */
        getButton: function () {
            var elementConfig = this.buttonComponentConfig;

            elementConfig.name = this.name + '_button';
            layout([elementConfig]);

            return this.requestModule(elementConfig.name);
        },

        /**
         * Determines the status label for the currently loaded block
         * @returns {String}
         */
        getStatusLabel: function () {
            return this.meta()['is_active'] === '1' ? $t('Active') : $t('Inactive');
        }
    });
});
