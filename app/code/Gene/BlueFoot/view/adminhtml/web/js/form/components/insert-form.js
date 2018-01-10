/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict */

/**
 * Override core functionality of insert form to enable BlueFoot caching and dynamically generated UI components
 */
define([
    'Magento_Ui/js/form/components/insert-form',
    'mageUtils',
    'jquery',
    'bluefoot/config',
    'uiRegistry',
    'underscore'
], function (InsertForm, utils, $, Config, registry, _) {
    'use strict';

    return InsertForm.extend({
        defaults: {
            editComponent: false,
            editingEntity: false,
            formPath: false
        },

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
                    try {
                        internalForm = registry.get(this.ns + '_form.' + this.ns + '_form');
                        clearInterval(insideInterval);
                        internalForm.destroyAdapter();
                    }catch(e) {
                        //Catch a failure to get form from registry
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
         * Initialize the forms configuration
         *
         * @param config
         * @returns {*}
         */
        initConfig: function (config) {
            var defaults = this.constructor.defaults;

            utils.extend(defaults, defaults.settings[config.formSubmitType] || {});

            // Update the render URL to contain the editing entity code
            config.render_url = config.render_url.replace('CONTENT_BLOCK_IDENTIFIER', config.editingEntity.config.code)
                .replace('EDIT_FORM_PATH_PLACERHOLDER', config.formPath);

            return this._super();
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

                // Attempt to load the form
                var loadForm = this.loadForm();

                // Otherwise complete an Ajax request to check
                if (!loadForm) {
                    request = this.requestData(params, this.renderSettings);
                    request
                        .done(this.onRender.bind(this))
                        .fail(this.onError.bind(this));
                }
            }.bind(this));

            return this;
        },

        /**
         * Save the form after render
         *
         * @param data
         */
        onRender: function (data) {
            // Store into the config if the form isn't already present
            if (!Config.loadForm(this.editingEntity.config.code)) {
                this.saveForm(data);
            }

            this._super(data);

            this.setData();
        },

        /**
         * Save a form into the config cache
         *
         * @param data
         */
        saveForm: function (data) {
            // Store the main form data
            var storeData = data.split(this.formPath).join('EDIT_FORM_PATH_PLACERHOLDER');

            storeData = storeData.split(this.ns).join('GENERATED_NAME_PLACEHOLDER');
            Config.addForm(this.editingEntity.config.code, storeData);
        },

        /**
         * Load a form from the config cache
         *
         * @param code
         * @param caller
         */
        loadForm: function (code) {
            var loadedForm;

            code = code || this.editingEntity.config.code;
            try {
                loadedForm = Config.loadForm(code);
                // Replace the form path place holder with the new form path
                loadedForm = loadedForm.split('EDIT_FORM_PATH_PLACERHOLDER').join(this.formPath);
                loadedForm = loadedForm.split('GENERATED_NAME_PLACEHOLDER').join(this.ns);

                // Defer the loading, to ensure the element is present
                setTimeout(function () {
                    // Call the onRender function
                    this.onRender(loadedForm);
                }.bind(this), 0);
                return true;
            }catch(e) {
                //Catch a failure to load form
            }

            return false;
        },

        /**
         * Update the data provider with the entities data
         *
         * Use a setInterval to wait for the forms data provider to be available
         */
        setData: function () {
            var dataProvider,
                interval = setInterval(function () {
                    try {
                        dataProvider = registry.get(this.provider);
                        clearInterval(interval);
                        dataProvider.set('data.entity', this.editingEntity.data());

                        // Update the containers title
                        this.containers[0].setTitle($.mage.__('Edit') + ' ' + this.editingEntity.config.name);
                    }catch(e) {
                        //Catch a failure to get provider from registry
                    }
                }.bind(this), 5);
        },

        /**
         * Validate the internal form, update the entity and close the modal
         *
         * @param redirect
         * @param closeModal
         * @returns {boolean}
         */
        save: function (redirect, closeModal) {
            var form = registry.get(this.ns + '_form.' + this.ns + '_form');

            form.validate();

            if (!form.additionalInvalid && !form.source.get('params.invalid')) {
                var entityData = form.source.get('data.entity');

                this.editingEntity.data(entityData);

                // Destroy the original instance of the source
                form.destroyAdapter();
                form.source.destroy();

                if (closeModal) {
                    this.close();
                }
            }

            return false;
        },

        /**
         * Override the close function
         *
         * @returns {*}
         */
        close: function () {
            return this.closeModal();
        }

    });
});
