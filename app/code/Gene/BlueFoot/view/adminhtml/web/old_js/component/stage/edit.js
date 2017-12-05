/**
 * - Edit.js
 * Allows users to edit elements within the stage
 *
 * This file creates a new UI Component which is used for the actual edit panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'jquery',
    'uiRegistry',
    'bluefoot/config',
    'mageUtils'
], function (ko, $, registry, Config, utils) {

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
     * Init a new modal
     */
    Edit.prototype.initModal = function () {
        var originalForm = registry.get('bluefoot_edit.bluefoot_edit.bluefoot_edit_form'),
            componentName = 'bluefoot_edit_' + utils.uniqueid(),
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
                        "component": "Gene_BlueFoot\/js\/form\/components\/insert-form",
                        "editComponent": this,
                        "generatedName": componentName,
                        "formPath": formPath,
                        "editingEntity": this.parent,
                        "provider": componentName + '_form.contentblock_form_data_source',
                        "update_url": originalForm.update_url,
                        "render_url": originalForm.render_url,
                        "autoRender": true,
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
        this.parent.requestAddComponent(false, config, 'Magento_Ui/js/core/app');
    };

    return Edit;
});