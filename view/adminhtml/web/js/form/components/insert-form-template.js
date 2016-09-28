/**
 * Dynamically load in the form to create a template
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
         * Registry reference to the template manager modal
         */
        managerModalNameSpace: null,

        /**
         * Registry reference to the actual new template form
         */
        formNameSpace: null,

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

            // @todo reset form

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
            this.params.form_key = window.FORM_KEY;

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
        },

        /**
         * Close the modal and don't save the template
         */
        close: function() {
            this.closeModal();
        },

        /**
         * Save the template
         * @returns {boolean}
         */
        save: function() {
            // Validate the form
            var form = registry.get(this.formNameSpace),
                modal = registry.get(this.managerModalNameSpace);
            form.validate();

            if (!form.additionalInvalid && !form.source.get('params.invalid')) {
                // Get form data and stage structure
                var entityData = form.source.data;
                entityData.form_key = window.FORM_KEY;
                entityData.structure = modal.getStageStructure();

                // Loading state on modal
                registry.get(this.modalFormNameSpace).loading(true);

                // Ajax post to save the template
                var request = $.ajax({
                    method: "POST",
                    url: form.source.submit_url,
                    data: entityData
                });
                request.done(function() {
                    // Destroy the original instance of the source
                    form.destroyAdapter();
                    form.source.destroy();

                    this.closeModal();
                    modal.closeModal();
                }.bind(this));
            }

            return false;
        }
    });
});
