/**
 * - Edit.js
 * Allows users to edit elements within the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 * @todo create custom modal component to handle the majority of the functionality currently overriden in here
 */
define([
    'ko',
    'jquery',
    'uiRegistry',
    'bluefoot/config',
    'bluefoot/common',
    'mage/apply/main'
], function (ko, $, registry, Config, Common, applyMain) {

    /**
     * Edit class constructor
     *
     * @constructor
     */
    function Edit(entity) {
        this.parent = entity;
        this.entity = entity.config;
        this.modal = false;
        this.form = false;

        this.initModal();
    }

    /**
     * Return the form
     *
     * @returns {*}
     */
    Edit.prototype.getForm = function () {
        return registry.get('contentblock_entity_form.contentblock_entity_form');
    };

    /**
     * Init a new modal
     */
    Edit.prototype.initModal = function () {
        var originalForm = registry.get('bluefoot_edit.bluefoot_edit.bluefoot_edit_form'),
            componentName = 'bluefoot_edit_' + Common.guid(),
            fullPath = componentName + '.' + componentName,
            formPath = fullPath + '.bluefoot_edit_form';

        // Add the new panel to the panel thing
        registry.get('bluefoot-edit').addPanel(fullPath);

        var config = {
            "types": {
                "container": {
                    "extends": componentName
                },
                "dataSource": {
                    "component": "Magento_Ui\/js\/form\/provider"
                },
                "html_content": {
                    "component": "Magento_Ui\/js\/form\/components\/html",
                    "extends": componentName
                }
            },
            "components": {}
        };

        // Add in our components
        config.components[componentName] = {
            children: {}
        };
        config.components[componentName].children[componentName] = {};
        config.components[componentName].children[componentName] = {
            "type": componentName,
            "name": componentName,
            "children": {
                "bluefoot_edit_form": {
                    "type": "container",
                    "name": "bluefoot_edit_form",
                    "config": {
                        "component": "Magento_Ui\/js\/form\/components\/insert-form",
                        "update_url": originalForm.update_url,
                        "render_url": originalForm.render_url,
                        "autoRender": false,
                        "dataLinks": {
                            "imports": false,
                            "exports": false
                        },
                        "realTimeLink": false,
                        "ns": componentName,
                        "toolbarContainer": "${ $.parentName }",
                        "externalProvider": "${ $.ns }." + componentName,
                        "formSubmitType": "ajax"
                    }
                }
            },
            "config": {
                "component": "Magento_Ui\/js\/modal\/modal-component",
                "options": {
                    "type": "slide"
                }
            }
        };

        // Add in our data source
        config.components[componentName].children[componentName + '_data_source'] = {
            "type": "dataSource",
            "name": componentName + '_data_source',
            "dataScope": componentName,
            "config": {
                "params": {
                    "namespace": componentName
                }
            }
        };

        // Add our new sidebar UI component
        applyMain.applyFor.call(null, false, config, 'Magento_Ui/js/core/app');

        // Open the modal once it's been added to the page
        var edit,
            form,
            interval = setInterval(function () {
                edit = registry.get(fullPath);
                form = registry.get(formPath);
                if (edit !== undefined && form !== undefined) {
                    clearInterval(interval);
                    form.generatedName = componentName;
                    this.modal = edit;
                    this.form = form;
                    this.open(edit, form, formPath);
                }
            }.bind(this), 5);
    };

    /**
     * Open an edit panel
     *
     * @param edit
     * @param form
     * @param formPath
     *
     * @returns {*}
     */
    Edit.prototype.open = function (edit, form, formPath) {

        // Pass the currently being edited entity to the form
        form.editingEntity = this.parent;

        // Override the onRender functionality
        this.handleOnRender(form);

        form.edit = edit;

        // Pass the save method over
        form.save = this.save.bind(this);
        form.close = this.close.bind(this);

        // Record the original URL
        if (!form.renderSettings.originalUrl) {
            form.renderSettings.originalUrl = form.renderSettings.url;
        }

        // Only re-render the form completely if the code is different
        if (form.lastCode != this.entity.code) {
            form.renderSettings.url = form.renderSettings.originalUrl
                .replace('CONTENT_BLOCK_IDENTIFIER', this.entity.code)
                .replace('EDIT_FORM_PATH_PLACERHOLDER', formPath);
        }
        form.lastCode = this.entity.code;
        form.formPath = formPath;

        form.destroyInserted();
        form.resetForm();
        form.render();

        edit.openModal();
    };

    /**
     * Intercept the onRender of the form to implement further logic
     *
     * @param form
     */
    Edit.prototype.handleOnRender = function (form) {
        // We only need to override this function once
        if (form.onRenderOverridden !== true) {
            var _originalRender = form.onRender,
                that = this;

            /**
             * Override the form render function to implement caching in the Config
             *
             * @param params
             * @returns {form}
             */
            form.render = function (params) {
                var self = this,
                    request,
                    loadedForm;

                if (this.isRendered) {
                    return this;
                }

                self.previousParams = params || {};

                $.async({
                    component: this.name,
                    ctx: '.' + this.contentSelector
                }, function (el) {
                    self.contentEl = $(el);
                    self.startRender = true;
                    params = _.extend({}, self.params, params || {});

                    // Attempt to load the form
                    var loadForm = that.loadForm(form.editingEntity.config.code, self, form);

                    // Otherwise complete an Ajax request to check
                    if (!loadForm) {
                        request = self.requestData(params, self.renderSettings);
                        request
                            .done(self.onRender)
                            .fail(self.onError);
                    }
                });

                return this;
            };

            /**
             * Handle render function
             *
             * @param data
             */
            form.onRender = function (data) {
                // Store into the config if the form isn't already present
                if (!Config.loadForm(form.editingEntity.config.code)) {
                    that.saveForm(form, data);
                }

                _originalRender.call(form, data);

                // The form.externalSource doesn't appear to be available on initial render, so start a loop
                // waiting for its presence
                var dataProvider,
                    interval = setInterval(function () {
                        if (dataProvider = registry.get(form.edit.ns + '_form.contentblock_form_data_source')) {
                            clearInterval(interval);
                            dataProvider.set('data.entity', form.editingEntity.data());
                            form.edit.setTitle($.mage.__('Edit') + ' ' + form.editingEntity.config.name);
                        }
                    }, 5);

                // Destroy the adapter on the newly created sub form to not mess with other forms
                var internalForm,
                    insideInterval = setInterval(function () {
                    if (internalForm = registry.get(form.edit.ns + '_form.' + form.edit.ns + '_form')) {
                        clearInterval(insideInterval);
                        internalForm.destroyAdapter();
                    }
                }, 5);
            };

            form.onRenderOverridden = true;
        }
    };

    /**
     * Save the form into the config cache
     *
     * @param form
     * @param data
     */
    Edit.prototype.saveForm = function (form, data) {
        // Store the main form data
        var storeData = data.split(form.formPath).join('EDIT_FORM_PATH_PLACERHOLDER');
        storeData = storeData.split(form.generatedName).join('GENERATED_NAME_PLACEHOLDER');
        Config.addForm(form.editingEntity.config.code, storeData);
    };

    /**
     * Load a form in
     *
     * @param code
     * @param caller
     * @param form
     * @returns {boolean}
     */
    Edit.prototype.loadForm = function (code, caller, form) {
        var loadedForm;
        if (loadedForm = Config.loadForm(code)) {
            var actions = Config.loadForm(code + '.actions');

            // Replace the form path place holder with the new form path
            loadedForm = loadedForm.split('EDIT_FORM_PATH_PLACERHOLDER').join(form.formPath);
            loadedForm = loadedForm.split('GENERATED_NAME_PLACEHOLDER').join(form.generatedName);

            // Defer the loading, to ensure the element is present
            setTimeout(function () {
                // Call the onRender function
                caller.onRender.call(caller, loadedForm);
            }, 0);
            return true;
        }

        return false;
    };

    /**
     * Close a modal
     */
    Edit.prototype.close = function () {
        this.modal.closeModal();
    };

    /**
     * Save the edit contents
     *
     * @param redirect
     * @param closeModal
     */
    Edit.prototype.save = function (redirect, closeModal) {
        var form = registry.get(this.form.edit.ns + '_form.' + this.form.edit.ns + '_form');
        form.validate();

        if (!form.additionalInvalid && !form.source.get('params.invalid')) {
            var entityData = form.source.get('data.entity');
            this.parent.data(entityData);

            // Destroy the original instance of the source
            form.destroyAdapter();
            form.source.destroy();

            if (closeModal) {
                this.form.close();
            }
        }

        return false;
    };

    return Edit;
});