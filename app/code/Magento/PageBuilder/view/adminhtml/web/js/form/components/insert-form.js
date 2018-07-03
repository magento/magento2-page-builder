/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/components/insert-form',
    'Magento_PageBuilder/js/events',
    'jquery'
], function (Insert, events, $) {
    'use strict';

    return Insert.extend({
        defaults: {
            appearanceIndex: '',
            configs: {},
            tracks: {
                id: true
            },
            listens: {
                appearance: 'onAppearanceChange'
            }
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();

            events.on('form:renderAfter', function (params) {
                this.render(params);
            }.bind(this));

            return this;
        },

        /** @inheritdoc */
        render: function (params) {
            this.availableAppearances = params.appearances;
            this.title = params.title;
            this.defaultNamespace = params.defaultNamespace;
            this.destroyInserted();
            this.setData(params);

            return this._super({
                namespace: params.namespace,
                handle: params.namespace
            });
        },

        /**
         * Set data for new form.
         *
         * @param {Object} params
         */
        setData: function (params) {
            var formQuery = 'index=' + params.namespace,
                dataProviderQuery = 'index=' + params.namespace + '_data_source';

            this.providerData = params.data;
            this.id = params.id;
            this.externalForm = this.requestModule(formQuery);
            this.externalSource = this.requestModule(dataProviderQuery);
            this.setLinks({
                appearance: 'ns = ' + params.namespace + ', index = ' + this.appearanceIndex + ':value'
            }, 'imports');
            this.setLinks({
                providerData: dataProviderQuery + ':data',
                prefix: formQuery + ':selectorPrefix',
                id: dataProviderQuery + ':id'
            }, 'exports');
        },

        /** @inheritdoc **/
        requestData: function (params) {
            var deffer = $.Deferred(),
                formConfig = this.configs[params.namespace];

            if (formConfig) {
                return deffer.resolve(formConfig);
            }

            return this._super().done(function (data) {
                this.configs[params.namespace] = data;
            }.bind(this));
        },

        /**
         * Re-render after appearance change
         *
         * @param {String} value
         */
        onAppearanceChange: function (value) {
            var namespace = this.availableAppearances[value] && this.availableAppearances[value].form ||
                this.defaultNamespace;

            if (namespace !== this.previousParams.namespace) {
                this.render({
                    namespace: namespace,
                    id: this.id,
                    data: this.externalSource().get('data'),
                    appearances: this.availableAppearances,
                    title: this.title,
                    defaultNamespace: this.defaultNamespace
                });
            }
        }
    });
});
