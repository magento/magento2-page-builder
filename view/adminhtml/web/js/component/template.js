/**
 * Template Manager modal ui component
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
define([
    'Magento_Ui/js/modal/modal-component',
    'jquery',
    'uiRegistry',
    'mage/translate',
    'bluefoot/stage/build'
], function (Modal, $, registry, $t, build) {

    /**
     * Dynamically create a form ui component.
     * @param componentName
     * @param params
     */
    function buildFormComponent(modal, componentName, params) {
        var fullPath = componentName + '.' + componentName,
            formPath = fullPath + '.modal_form';

        if (registry.get(fullPath)) {
            registry.get(fullPath).openModal();
            return;
        }

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

        // Inject into bluefoot edit panel to force rendering
        registry.get('bluefoot-edit').addPanel(fullPath);

        // Add in our components
        config.components[componentName] = {
            children: {}
        };
        config.components[componentName].children[componentName] = {};
        config.components[componentName].children[componentName] = {
            "type": componentName,
            "name": componentName,
            "children": {
                "modal_form": {
                    "type": "container",
                    "name": "modal_form",
                    "config": {
                        "component": "Gene_BlueFoot\/js\/form\/components\/insert-form-template",
                        "generatedName": componentName,
                        "formPath": formPath,
                        "provider": componentName + '_form.contentblock_form_data_source',
                        "update_url": params.update_url,
                        "render_url": params.render_url,
                        "autoRender": true,
                        "dataLinks": {
                            "imports": false,
                            "exports": false
                        },
                        "realTimeLink": false,
                        "ns": componentName,
                        "toolbarContainer": "${ $.parentName }",
                        "externalProvider": "${ $.ns }." + componentName,
                        "formSubmitType": "ajax",
                        "formNameSpace": "bluefoot_template_create.bluefoot_template_create",
                        "modalFormNameSpace": "bluefoot_template_create_modal.bluefoot_template_create_modal.modal_form",
                        "managerModalNameSpace": "bluefoot_template_manager.bluefoot_template_manager"
                    }
                }
            },
            "config": {
                "component": "Magento_Ui\/js\/modal\/modal-component",
                "options": {
                    "type": "slide",
                    "title": $t("New Template")
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
        if (modal.stage) {
            modal.stage.addComponent(false, config, 'Magento_Ui/js/core/app');
        }
    }

    return Modal.extend({
        stage: null,
        isRendered: false,
        selectedTemplate: null,

        /**
         * Open the template manager modal
         * @param context
         * @returns {*}
         */
        openManager: function (context) {
            this.stage = context;

            // Open the modal if it's already been rendered
            if (this.isRendered) {
               return this.openModal();
            }

            // Render the modal - triggers the async callback in initializeContent()
            registry.get('bluefoot-edit').addPanel(this.name);
        },

        /**
         * @inheritDoc
         */
        initModal: function() {
            this._super();
            this.isRendered = true;
            this.openModal();

            return this;
        },

        /**
         * Open the save template modal.
         * Dynamically generated so as to not clutter each page load
         */
        actionSaveTemplate: function() {
            buildFormComponent(this, "bluefoot_template_create_modal", {
                render_url: this.create_modal.render_url,
                update_url: this.create_modal.update_url
            });
        },

        /**
         * Convert the stage's content in JSON string
         */
        getStageStructure: function() {
            return JSON.stringify(this.stage.toJSON());
        },

        /**
         * update the stage's content to that of the template
         * @returns {*}
         */
        actionDone: function() {
            if (this.selectedTemplate) {
                var builder = new build();
                this.stage.stageContent([]);
                builder.structure = JSON.parse(this.selectedTemplate.structure);
                this.stage.loading(true);
                builder.buildStage(this.stage);
            }

            return this._super();
        },

        /**
         * Select a template
         * @param data template's data
         */
        setTemplate: function(data) {
            this.selectedTemplate = data;
        }
    });
});
