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
        displayMetadata: true,
        messages: {
            UNKOWN_ERROR: $t('Sorry, there was an error getting requested content. ' +
                'Please contact the store owner.'),
            UNKNOWN_SELECTION: $t('The currently selected block does not exist.')
        },
        defaults: {
            template: 'Magento_PageBuilder/form/element/block-chooser',
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

        /**
         * @inheritdoc
         */
        initObservable: function () {
            return this._super()
                .observe('id meta errorMessage displayMetadata');
        },

        /**
         * Updates the block data from the server
         *
         * @returns void
         */
        updateFromServer: function () {
            var requestData = $.extend(true, {}, this.requestData);

            // The component hasn't be configured yet. Nothing to do.
            if (!this.id().length || !this.requestParameter || !this.dataUrlConfigPath) {
                this.meta({});

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
                        this.errorMessage(this.messages.UNKOWN_ERROR);

                        return;
                    } else if (Array.isArray(response)) {
                        this.meta({});
                        this.errorMessage(this.messages.UNKNOWN_SELECTION);

                        return;
                    }

                    this.meta(response);
                }.bind(this))
                .fail(function () {
                    this.meta({});
                    this.errorMessage(this.messages.UNKOWN_ERROR);
                }.bind(this));
        },

        /**
         * Creates the button component for rendering
         *
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
         *
         * @returns {String}
         */
        getStatusLabel: function () {
            return this.meta()['is_active'] === '1' ? $t('Active') : $t('Inactive');
        }
    });
});
