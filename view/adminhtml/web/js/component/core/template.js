define([
    'uiComponent',
    'underscore',
    'mage/apply/main',
    'uiRegistry'
], function (Component, _, applyMain, registry) {

    function buildComponent(componentName) {
        var fullPath = componentName + '.' + componentName,
            formPath = fullPath + '.modal_form',
            config = {
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
                        "component": "Gene_BlueFoot\/js\/form\/components\/insert-form-basic",
                        "generatedName": componentName,
                        "formPath": formPath,
                        "provider": componentName + '_form.contentblock_form_data_source',
                        "update_url": 'updateaidan',
                        "render_url": 'renderaidan',
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

        console.log(componentName);

        // Add our new sidebar UI component
        applyMain.applyFor.call(null, false, config, 'Magento_Ui/js/core/app');
    }

    return Component.extend({
        openManagerModal: function () {

        },

        openFormModal: function() {
            buildComponent("bluefoot_template_create");
        }
    });
});
