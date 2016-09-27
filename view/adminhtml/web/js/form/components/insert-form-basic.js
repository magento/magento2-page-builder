/**
 * Dynamically load in a basic form
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
define([
    'Magento_Ui/js/form/components/insert-form',
    'mageUtils',
    'jquery',
    'bluefoot/config',
    'uiRegistry'
], function (InsertForm, utils, $, Config, registry) {
    'use strict';

    return InsertForm.extend({
        /**
         * If auto render, also open the modal
         *
         * @returns {exports}
         */
        initialize: function () {
            this._super();
            if (this.autoRender) {
                this.openModal();
            }

            return this;
        },

        /**
         * Open the parent modal
         *
         * @returns {*}
         */
        openModal: function () {
            // Destroy the adapter on the newly created sub form to not mess with other forms
            var internalForm,
                insideInterval = setInterval(function () {
                    if (internalForm = registry.get(this.ns + '_form.' + this.ns + '_form')) {
                        clearInterval(insideInterval);
                        internalForm.destroyAdapter();
                    }
                }.bind(this), 5);

            return registry.get(this.parentName).openModal();
        },

        /**
         * Close the modal
         *
         * @returns {*}
         */
        closeModal: function () {
            return registry.get(this.parentName).closeModal();
        },

        /**
         * Handle rendering of the form
         *
         * @param params
         * @returns {exports}
         */
        render: function (params) {
            var request;

            if (this.isRendered) {
                return this;
            }

            this.previousParams = params || {};

            $.async({
                component: this.name,
                ctx: '.' + this.contentSelector
            }, function (el) {
                this.contentEl = $(el);
                this.startRender = true;
                params = _.extend({}, this.params, params || {});
                request = this.requestData(params, this.renderSettings);
                request
                    .done(this.onRender.bind(this))
                    .fail(this.onError.bind(this));
            }.bind(this));

            return this;
        }

    });
});
