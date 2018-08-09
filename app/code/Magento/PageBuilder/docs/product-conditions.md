# Reuse product conditions for content types

## Navigation

1. [Introduction]
2. [Installation guide]
3. [Contribution guide]
4. [Developer documentation]
    1. [Architecture overview]
    1. [BlueFoot to PageBuilder data migration]
    1. [Third-party content type migration]
    1. [Iconography]
    1. [Add image uploader to content type]
    1. [Module integration]
    1. [Additional data configuration]
    1. [Content type configuration]
    1. [How to add a new content type]
    1. [Events]
    1. [Bindings]
    1. [Master format]
    1. [Visual select] 
    1. **Reuse product conditions in content types**
    1. [Store component master format as widget directive]
    1. [Use the block chooser UI component]
    1. [Use the inline text editing component]
    1. [Render a backend content type preview]
    1. [Custom Toolbar]
    1. [Full width page layouts]
5. [Roadmap and known issues]
6. [How to create custom PageBuilder content type container]

[Introduction]: README.md
[Contribution guide]: CONTRIBUTING.md
[Installation guide]: install.md
[Developer documentation]: developer-documentation.md
[Architecture overview]: architecture-overview.md
[BlueFoot to PageBuilder data migration]: bluefoot-data-migration.md
[Third-party content type migration]: new-content-type-example.md
[Iconography]: iconography.md
[Add image uploader to content type]: image-uploader.md
[Module integration]: module-integration.md
[Additional data configuration]: custom-configuration.md
[Content type configuration]: content-type-configuration.md
[How to add a new content type]: how-to-add-new-content-type.md
[Events]: events.md
[Bindings]: bindings.md
[Master format]: master-format.md
[Visual select]: visual-select.md
[Reuse product conditions in content types]: product-conditions.md
[Store component master format as widget directive]: widget-directive.md
[Use the block chooser UI component]: block-chooser-component.md
[Use the inline text editing component]: inline-editing-component.md
[Render a backend content type preview]: content-type-preview.md
[Custom Toolbar]: toolbar.md
[Full width page layouts]: full-width-page-layouts.md
[Add image uploader to content type]: image-uploader.md
[Roadmap and Known Issues]: roadmap.md
[How to create custom PageBuilder content type container]: how-to-create-custom-content-type-container.md

## What's in this topic
This topic describes how use the product conditions rule tree for different content types. By reusing the conditions mechanism you can apply it to your own custom content types.

## Overview

To reuse conditions for custom content types:
1. [Add an attribute to the content type](#add-attribute)
2. [Add the conditions form element to the `form` UI component](#add-conditions)
3. [Create a custom `form` data provider](#data-provider)
4. [Include the `conditionsDataProcessor` and attribute in the data provider](#include)

## Add an attribute to the content type {#add-attribute}

To add an attribute within your custom content type:

``` xml
<attribute source="data-myconditions" name="myconditions"/>
 ```

## Add the conditions form element to the `form` UI component {#add-conditions}

To add the conditions `form` element to the `form` UI component:

``` xml
<htmlContent name="myconditions" template="Magento_PageBuilder/form/element/widget-conditions">
    <settings>
        <additionalClasses>
            <class name="admin__field">true</class>
        </additionalClasses>
    </settings>
    <block name="myconditions" class="Magento\PageBuilder\Block\Adminhtml\Form\Element\Conditions">
        <arguments>
            <argument name="formNamespace" xsi:type="string">my_form_namespace</argument>
            <argument name="attribute" xsi:type="string">myconditions</argument>
            <argument name="label" xsi:type="string" translate="true">My Conditions</argument>
        </arguments>
    </block>
</htmlContent>
```

## Create a custom `form` data provider {#data-provider}

To create a custom `form` data provider for the edit form:

``` xml
<dataSource name="mycomponent_form_data_source">
    <argument name="data" xsi:type="array">
        <item name="js_config" xsi:type="array">
            <item name="component" xsi:type="string">Magento_PageBuilder/js/content-type/mycomponent/form/provider</item>
        </item>
    </argument>
</dataSource>
```

The preceding code is an example of how to add a custom `form` data provider. Replace values with ones specific to your custom content type and component.

## Include the `conditionsDataProcessor` and attribute in the data provider {#include}

To include the `conditionsDataProcessor` and accompanying attribute in the data provider file, `view/adminhtml/web/js/content-type/mycomponent/form/provider.js`:

``` js
define([
    'Magento_PageBuilder/js/form/provider',
    'Magento_PageBuilder/js/form/provider/conditions-data-processor'
], function (Provider, conditionsDataProcessor) {
    'use strict';

    return Provider.extend({
        save: function () {
            var data = this.get('data');

            conditionsDataProcessor(data, 'myconditions');

            return this._super();
        }
    });
});
```
