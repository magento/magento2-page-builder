# How to create custom PageBuilder content type container

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
    1. **How to add a new content type**
    1. [Events]
    1. [Bindings]
    1. [Master format]
    1. [Visual select] 
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Use the block chooser UI component]
    1. [Render a backend content type preview]
    1. [Custom Toolbar]
    1. [Full width page layouts]
5. [Roadmap and known issues]
6. [Creating custom content block]
7. [How to create custom PageBuilder content type container]

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
[Render a backend content type preview]: content-type-preview.md
[Use the block chooser UI component]: block-chooser-component.md
[Custom Toolbar]: toolbar.md
[Full width page layouts]: full-width-page-layouts.md
[Add image uploader to content type]: image-uploader.md
[Roadmap and Known Issues]: roadmap.md
[Creating Custom Content Block]: creating-custom-content-block.md
[How to create custom PageBuilder content type container]: how-to-create-custom-pagebuilder-content-type-container.md

## Before you begin

Refer to how-to-add-new-content-type.md for creating generic content type and content type collection.

Also, make sure you know how to register your custom module, if not refer to:  https://devdocs.magento.com/guides/v2.2/extension-dev-guide/build/component-registration.html

In this tutorial, we will be creating a custom container group module named `CustomPageBuilder_CustomContentTypes` that will have 2 appearances, `left` and `right`. And each container group will contain 3 containers in a grid and will be styled differently based on the container groups appearance.

## Configuration

We will be creating the configurations for the custom container group and custom containers.

For the container group we will be creating the file:

``` xml
view/base/pagebuilder/content_type/custom_container_group.xml
```

The configuration for container group will be the following snippet:

``` xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <type name="custom-container-group"
          label="Custom Container Group"
          component="Magento_PageBuilder/js/content-type-collection"
          preview_component="CustomPageBuilder_CustomContentTypes/js/content-type/custom-container-group/preview"
          master_component="Magento_PageBuilder/js/content-type/master-collection"
          form="pagebuilder_custom_container_group_form"
          group="general"
          icon="icon-pagebuilder-row"
          sortOrder="1"
          translate="label">
        <parents default_policy="deny">
            <parent name="stage" policy="allow"/>
        </parents>
        <children default_policy="deny">
            <child name="custom-container" policy="allow"/>
        </children>
        <appearances>
            <appearance default="true"
                        name="left"
                        preview_template="CustomPageBuilder_CustomContentTypes/content-type/custom-container-group/left/preview"
                        render_template="CustomPageBuilder_CustomContentTypes/content-type/custom-container-group/left/master"
                        reader="Magento_PageBuilder/js/master-format/read/configurable">
                <elements>
                    <element name="main">
                        <style name="text_align" source="text_align"/>
                        <style name="border" source="border_style" converter="Magento_PageBuilder/js/converter/style/border-style"/>
                        <style name="border_color" source="border_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins" preview_converter="Magento_PageBuilder/js/content-type/row/converter/style/margins"/>
                        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings" preview_converter="Magento_PageBuilder/js/content-type/row/converter/style/paddings"/>
                        <attribute name="name" source="data-role"/>
                        <attribute name="appearance" source="data-appearance"/>
                        <css name="css_classes">
                            <filter>
                                <class source="pagebuilder-custom-container-group"/>
                                <class source="left-appearance"/>
                            </filter>
                        </css>
                    </element>
                </elements>
            </appearance>
            <appearance name="right"
                        preview_template="CustomPageBuilder_CustomContentTypes/content-type/custom-container-group/right/preview"
                        render_template="CustomPageBuilder_CustomContentTypes/content-type/custom-container-group/right/master"
                        reader="Magento_PageBuilder/js/master-format/read/configurable">
                <elements>
                    <element name="main">
                        <style name="text_align" source="text_align"/>
                        <style name="border" source="border_style" converter="Magento_PageBuilder/js/converter/style/border-style"/>
                        <style name="border_color" source="border_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins" preview_converter="Magento_PageBuilder/js/content-type/row/converter/style/margins"/>
                        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings" preview_converter="Magento_PageBuilder/js/content-type/row/converter/style/paddings"/>                                
                        <attribute name="name" source="data-role"/>
                        <attribute name="appearance" source="data-appearance"/>
                        <css name="css_classes">
                            <filter>
                                <class source="pagebuilder-custom-container-group"/>
                                <class source="right-appearance"/>
                            </filter>
                        </css>
                    </element>
                </elements>
            </appearance>
        </appearances>
    </type>
</config>
```

As noted in the configuration above, we will be creating a custom preview component for this content type. 

As for Icon, we will just be using rows icons as placeholder, feel free to add your own. 

Also this content type will only be allowed on the stage and only accepts containers content type as children. 

Finally take notice of the css filter, we are adding a custom hard coded class to dictate appearance style, there are other ways to implement this so don't feel obligated to always add custom classes to change your appearances.

Next we will do the same for containers.

For the container we will be creating the file:

``` xml
view/base/pagebuilder/content_type/custom_container.xml
```

The configuration for container group will be the following snippet:

``` xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <type name="custom-container"
          label="Container"
          component="Magento_PageBuilder/js/content-type-collection"
          preview_component="CustomPageBuilder_CustomContentTypes/js/content-type/custom-container/preview"
          master_component="Magento_PageBuilder/js/content-type/master-collection"
          form="pagebuilder_custom_container_form"
          group="general"
          icon="icon-pagebuilder-row"
          sortOrder="1"
          translate="label">
        <parents default_policy="deny">
            <parent name="custom-container-group" policy="allow"/>
        </parents>
        <children default_policy="allow">
            <child name="custom-container-group" policy="deny"/>
            <child name="row" policy="deny"/>
            <child name="column" policy="deny"/>
            <child name="column-group" policy="deny"/>
            <child name="tabs" policy="deny"/>
            <child name="tab-item" policy="deny"/>
        </children>
        <is_visible>false</is_visible>
        <appearances>
            <appearance default="true"
                        name="default"
                        preview_template="CustomPageBuilder_CustomContentTypes/content-type/custom-container/default/preview"
                        render_template="CustomPageBuilder_CustomContentTypes/content-type/custom-container/default/master"
                        reader="Magento_PageBuilder/js/master-format/read/configurable">
                <elements>
                    <element name="main">
                        <style name="background_color" source="background_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                        <style name="background_image" source="background_image" converter="Magento_PageBuilder/js/converter/style/background-image" preview_converter="Magento_PageBuilder/js/converter/style/preview/background-image"/>
                        <style name="background_position" source="background_position"/>
                        <style name="background_size" source="background_size"/>
                        <style name="background_repeat" source="background_repeat"/>
                        <style name="background_attachment" source="background_attachment"/>
                        <style name="text_align" source="text_align"/>
                        <style name="border" source="border_style" converter="Magento_PageBuilder/js/converter/style/border-style"/>
                        <style name="border_color" source="border_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins" preview_converter="Magento_PageBuilder/js/content-type/row/converter/style/margins"/>
                        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings" preview_converter="Magento_PageBuilder/js/content-type/row/converter/style/paddings"/>
                        <attribute name="name" source="data-role"/>
                        <attribute name="appearance" source="data-appearance"/>
                        <attribute name="background_color_format" source="data-background-color-format" persistence_mode="write"/>
                        <css name="css_classes">
                            <filter>
                                <class source="pagebuilder-custom-container"/>
                            </filter>
                        </css>
                    </element>
                </elements>
                <converters>
                    <converter name="preferred_color_format" component="Magento_PageBuilder/js/mass-converter/preferred-color-format">
                        <config>
                            <item name="background_color_format" value="background_color_format"/>
                        </config>
                    </converter>
                </converters>
            </appearance>
        </appearances>
    </type>
</config>
```

Same as above, we only allow container to be inside container groups, but it can be filled with all content types except container group, column, row, and tabs.

## Form

Now that we have the configurations, lets create the forms that will allow the users to make edits to attributes when they are in the admin panel.

First lets create the layouts.

Container group will be in:

``` xml
view/adminhtml/layout/pagebuilder_custom_container_group_form.xml
```

`pagebuilder_custom_container_group_form.xml` contents will be:

``` xml
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="admin-1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="pagebuilder_custom_container_group_form"/>
        </referenceContainer>
    </body>
</page>
```

Container will be in:

``` xml
view/adminhtml/layout/pagebuilder_custom_container_form.xml
```

`pagebuilder_custom_container_form.xml` contents will be:

``` xml
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="admin-1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="pagebuilder_custom_container_form"/>
        </referenceContainer>
    </body>
</page>
```

Next lets create the actual forms.

Container group will be in:

``` xml
view/adminhtml/ui_component/pagebuilder_custom_container_group_form.xml
```

`pagebuilder_custom_container_group_form.xml` contents will be:

``` xml
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd"  extends="pagebuilder_base_form">
    <argument name="data" xsi:type="array">
        <item name="js_config" xsi:type="array">
            <item name="provider" xsi:type="string">pagebuilder_custom_container_group_form.pagebuilder_custom_container_group_form_data_source</item>
        </item>
        <item name="label" xsi:type="string" translate="true">Custom Container Group</item>
    </argument>
    <settings>
        <deps>
            <dep>pagebuilder_custom_container_group_form.pagebuilder_custom_container_group_form_data_source</dep>
        </deps>
        <namespace>pagebuilder_custom_container_group_form</namespace>
    </settings>
    <dataSource name="pagebuilder_custom_container_group_form_data_source">
        <argument name="data" xsi:type="array">
            <item name="js_config" xsi:type="array">
                <item name="component" xsi:type="string">Magento_PageBuilder/js/form/provider</item>
            </item>
        </argument>
        <dataProvider name="pagebuilder_custom_container_group_form_data_source" class="Magento\PageBuilder\Model\ContentType\DataProvider">
            <settings>
                <requestFieldName/>
                <primaryFieldName/>
            </settings>
        </dataProvider>
    </dataSource>
    <fieldset name="appearance_fieldset" sortOrder="10" component="Magento_PageBuilder/js/form/element/dependent-fieldset">
        <settings>
            <label translate="true">Appearance</label>
            <additionalClasses>
                <class name="admin__fieldset-visual-select-large">true</class>
            </additionalClasses>
            <collapsible>false</collapsible>
            <opened>true</opened>
            <imports>
                <link name="hideFieldset">${$.name}.appearance:options</link>
                <link name="hideLabel">${$.name}.appearance:options</link>
            </imports>
        </settings>
        <field name="appearance" formElement="select" sortOrder="10" component="Magento_PageBuilder/js/form/element/dependent-select">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="default" xsi:type="string">left</item>
                </item>
            </argument>
            <settings>
                <additionalClasses>
                    <class name="admin__field-wide">true</class>
                    <class name="admin__field-visual-select-container">true</class>
                </additionalClasses>
                <dataType>text</dataType>
                <validation>
                    <rule name="required-entry" xsi:type="boolean">true</rule>
                </validation>
                <elementTmpl>Magento_PageBuilder/form/element/visual-select</elementTmpl>
            </settings>
            <formElements>
                <select>
                    <settings>
                        <options class="AppearanceSourceCustomContainerGroup" />
                    </settings>
                </select>
            </formElements>
        </field>
    </fieldset>
</form>
```

Container will be in:

``` xml
view/adminhtml/ui_component/pagebuilder_custom_container_form.xml
```

`pagebuilder_custom_container_form.xml` contents will be:

``` xml
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd"  extends="pagebuilder_base_form_with_background_attributes">
    <argument name="data" xsi:type="array">
        <item name="js_config" xsi:type="array">
            <item name="provider" xsi:type="string">pagebuilder_custom_container_form.pagebuilder_custom_container_form_data_source</item>
        </item>
        <item name="label" xsi:type="string" translate="true">Custom Container</item>
    </argument>
    <settings>
        <deps>
            <dep>pagebuilder_custom_container_form.pagebuilder_custom_container_form_data_source</dep>
        </deps>
        <namespace>pagebuilder_custom_container_form</namespace>
    </settings>
    <dataSource name="pagebuilder_custom_container_form_data_source">
        <argument name="data" xsi:type="array">
            <item name="js_config" xsi:type="array">
                <item name="component" xsi:type="string">Magento_PageBuilder/js/form/provider</item>
            </item>
        </argument>
        <dataProvider name="pagebuilder_custom_container_form_data_source" class="Magento\PageBuilder\Model\ContentType\DataProvider">
            <settings>
                <requestFieldName/>
                <primaryFieldName/>
            </settings>
        </dataProvider>
    </dataSource>
    <fieldset name="appearance_fieldset" sortOrder="10" component="Magento_PageBuilder/js/form/element/dependent-fieldset">
        <settings>
            <label translate="true">Appearance</label>
            <additionalClasses>
                <class name="admin__fieldset-visual-select-large">true</class>
            </additionalClasses>
            <collapsible>false</collapsible>
            <opened>true</opened>
            <imports>
                <link name="hideFieldset">${$.name}.appearance:options</link>
                <link name="hideLabel">${$.name}.appearance:options</link>
            </imports>
        </settings>
        <field name="appearance" formElement="select" sortOrder="10" component="Magento_PageBuilder/js/form/element/dependent-select">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="default" xsi:type="string">default</item>
                </item>
            </argument>
            <settings>
                <additionalClasses>
                    <class name="admin__field-wide">true</class>
                    <class name="admin__field-visual-select-container">true</class>
                </additionalClasses>
                <dataType>text</dataType>
                <validation>
                    <rule name="required-entry" xsi:type="boolean">true</rule>
                </validation>
                <elementTmpl>Magento_PageBuilder/form/element/visual-select</elementTmpl>
            </settings>
            <formElements>
                <select>
                    <settings>
                        <options class="AppearanceSourceCustomContainer" />
                    </settings>
                </select>
            </formElements>
        </field>
    </fieldset>
</form>
```

Take notice that container group extends from base form while container extends from base form with background attributes.

## Appearance Source

Notice in the form section above, there is

``` xml 
<formElements>
    <select>
        <settings>
            <options class="AppearanceSourceCustomContainer" />
        </settings>
    </select>
</formElements>
```

You have to specify those appearance source in the di.xml so lets do that.

Create file:

``` xml
etc/adminhtml/di.xml
```

And inside it should have:

``` xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
    <virtualType name="AppearanceSourceCustomContainerGroup" type="Magento\PageBuilder\Model\Source\VisualSelect">
        <arguments>
            <argument name="optionsSize" xsi:type="string">large</argument>
            <argument name="optionsData" xsi:type="array">
                <item name="10" xsi:type="array">
                    <item name="value" xsi:type="string">left</item>
                    <item name="title" xsi:type="string" translate="true">Left</item>
                    <item name="icon" xsi:type="string">CustomPageBuilder_CustomContentTypes/css/images/content-type/custom-container-group/appearance/left.svg</item>
                </item>
                <item name="20" xsi:type="array">
                    <item name="value" xsi:type="string">right</item>
                    <item name="title" xsi:type="string" translate="true">Right</item>
                    <item name="icon" xsi:type="string">CustomPageBuilder_CustomContentTypes/css/images/content-type/custom-container-group/appearance/right.svg</item>
                </item>
            </argument>
        </arguments>
    </virtualType>
    <virtualType name="AppearanceSourceCustomContainer" type="Magento\PageBuilder\Model\Source\VisualSelect">
        <arguments>
            <argument name="optionsSize" xsi:type="string">large</argument>
            <argument name="optionsData" xsi:type="array">
                <item name="0" xsi:type="array">
                    <item name="value" xsi:type="string">default</item>
                    <item name="title" xsi:type="string" translate="true">Default</item>
                </item>
            </argument>
        </arguments>
    </virtualType>
</config>
```

In order for the icons to work, you have to create the following files:
``` xml
view/web/css/images/content-type/custom-container-group/appearance/left.svg
view/web/css/images/content-type/custom-container-group/appearance/right.svg
```

## Templates

Here we will create the preview and master templates.

Container group will have 2 sets of templates, 1 for each appearance.

For left appearance preview template create:

``` xml
view/adminhtml/web/template/content-type/custom-container-group/left/preview.html
```

It will contain:

``` xml
<div class="pagebuilder-content-type type-container pagebuilder-custom-container-group left-appearance"
     attr="data.main.attributes"
     ko-style="data.main.style"
     css="data.main.css"
     event="{ mouseover: onMouseOver, mouseout: onMouseOut }">
    <render args="getOptions().template" />
    <render args="previewChildTemplate" />
</div>
```

For left appearance master template create:

``` xml
view/adminhtml/web/template/content-type/custom-container-group/left/master.html
```

It will contain:

``` xml
<div attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" class="pagebuilder-custom-container-group left-appearance">
    <render args="renderChildTemplate"/>
</div>
```

For right appearance preview template create:

``` xml
view/adminhtml/web/template/content-type/custom-container-group/right/preview.html
```

It will contain:

``` xml
<div class="pagebuilder-content-type type-container pagebuilder-custom-container-group right-appearance"
     attr="data.main.attributes"
     ko-style="data.main.style"
     css="data.main.css"
     event="{ mouseover: onMouseOver, mouseout: onMouseOut }">
    <render args="getOptions().template" />
    <render args="previewChildTemplate" />
</div>
```

For right appearance master template create:

``` xml
view/adminhtml/web/template/content-type/custom-container-group/right/master.html
```

It will contain:

``` xml
<div attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" class="pagebuilder-custom-container-group right-appearance">
    <render args="renderChildTemplate"/>
</div>
```

Next we will create the templates for container:

For preview template create:

``` xml
view/adminhtml/web/template/content-type/custom-container/default/preview.html
```

It will contain:

``` xml
<div class="pagebuilder-content-type type-container pagebuilder-custom-container"
     attr="data.main.attributes"
     ko-style="data.main.style"
     css="Object.assign(data.main.css(), {'empty-container': parent.children().length == 0})"
     event="{ mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
    <render args="getOptions().template" />
    <render args="previewChildTemplate" />

    <div class="pagebuilder-display-label" html="function () { return displayLabel().toUpperCase(); }()"></div>
    <div class="pagebuilder-empty-container" css="{visible: parent.children().length == 0}" translate="'Empty Container'">
        <div class="pagebuilder-drop-indicator"></div>
    </div>
</div>
```

For master template create:

``` xml
view/adminhtml/web/template/content-type/custom-container/default/master.html
```

It will contain:

``` xml
<div attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" class="pagebuilder-custom-container">
    <render args="renderChildTemplate"/>
</div>
```

## JS Components

Now we are going to add logic to the container group and container.

In the file:

``` xml
view/adminhtml/web/js/content-type/custom-container-group.js
```

We are going to add the following:

``` js
define([
    'jquery',
    'knockout',
    'Magento_PageBuilder/js/events',
    'underscore',
    'Magento_PageBuilder/js/content-type/preview-collection',
    'Magento_PageBuilder/js/content-type-factory',
    'Magento_PageBuilder/js/config'
], function ($, ko, events, underscore, PreviewCollection, createContentType, pageBuilderConfig) {
    'use strict';

    /**
     * Preview Constructor
     *
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        var self = this;

        PreviewCollection.call(this, parent, config, stageId);

        events.on("custom-container-group:dropAfter", function (args) {
            if (args.id === self.parent.id && self.parent.children().length === 0) {
                // Once the grid is ready, let's add in our children
                self.populateContainerGroup();
            }
        });
    }
    Preview.prototype = Object.create(PreviewCollection.prototype);

    /**
     * Populate the custom container group with 3 children
     */
    Preview.prototype.populateContainerGroup = function () {
        var self = this;
        var i;

        // Create 3 containers inside container group
        for (i = 0; i < 3; i++) {
            createContentType(
                pageBuilderConfig.getContentTypeConfig("custom-container"),
                this.parent,
                this.parent.stageId
            ).then(function (container) {
                self.parent.addChild(container);
            });
        }
    };

    /**
     * Mark as not a standard container
     *
     * @returns {boolean}
     */
    Preview.prototype.isContainer = function () {
        return false;
    };

    return Preview;
});
```

In this preview component we are doing 4 things.

1. Inside the constructor we are extending preview collection since it is a collection content type.
2. Also inside the constructor, we are adding an event listener to listen for when container group is dropped onto stage, execute populateContainerGroup method.
3. In the populateContainerGroup method, we are adding 3 containers into container group on drop.
4. In the isContainer method, we are marking this content type as not a standard container.

Next lets add logic to the container in the file:

``` xml
view/adminhtml/web/js/content-type/custom-container.js
```

With the content:

``` js
define([
    'jquery',
    'underscore',
    'Magento_PageBuilder/js/content-type/preview-collection'
], function ($, _, PreviewCollection) {
    'use strict';
    var $super;

    /**
     * Preview Constructor
     *
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewCollection.call(this, parent, config, stageId);
    }
    Preview.prototype = Object.create(PreviewCollection.prototype);
    $super = PreviewCollection.prototype;

    /**
     * Remove move, duplicate and remove options
     *
     * @returns {*}
     */
    Preview.prototype.retrieveOptions = function retrieveOptions() {
        var options = $super.retrieveOptions.call(this, arguments);

        return _.filter(options, function (option) {
            return option.code !== "move" &&  option.code !== "duplicate" && option.code !== "remove";
        });
    };

    return Preview;
});
```

In this preview component we are doing 2 things.

1. Inside the constructor we are extending preview collection since it is a collection content type.
2. In the retrieveOptions method, we are overwriting this content types options list to remove options `move`, `duplicate`, and `remove`.

## Widget

In order for additional logic to be added in the store front, we would have to create a custom widget for the custom content types.

In this case we will add a simple widget to the container group.

First we have to add a layout for this widget, so create file:

``` xml
view/frontend/layout/default.xml
```

Inside, fill it with:

``` xml
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceBlock name="head.components">
            <block class="Magento\PageBuilder\Block\WidgetInitializer" name="pagebuilder.widget.initializer" template="Magento_PageBuilder::widget_initializer.phtml">
                <arguments>
                    <argument name="config" xsi:type="array">
                        <item name="custom-container-group" xsi:type="array">
                            <item name="default" xsi:type="array">
                                <item name="component" xsi:type="string">CustomPageBuilder_CustomContentTypes/js/content-type/custom-container-group/appearance/default/widget</item>
                            </item>
                        </item>
                    </argument>
                </arguments>
            </block>
        </referenceBlock>
    </body>
</page>
```

Now we will create the actual widget component in

``` xml
view/frontend/web/js/content-type/custom-container-group/appearance/default/widget.js
```
   
And inside it will be:

``` js
define([], function () {
    'use strict';

    return function (config, element) {
        console.log('Hello World');
    };
});
```

All this widget will do on the storefront, for every container group, it will output `Hello World` to the console.

## Styling

We will be adding styles to this module on both admin panel as well as store front.

For admin panel, create 

``` xml
view/adminhtml/web/css/source/_module.less
```

And it will contain:
``` css
.pagebuilder-custom-container-group.pagebuilder-content-type.type-container {
    border: none;
    outline: none;

    > .element-children {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 200px 200px;

        .pagebuilder-content-type-wrapper {
            height: 100%;

            .pagebuilder-custom-container {
                height: 100%;

                > .element-children {
                    height: 100%;
                }
            }
        }
    }

    &.left-appearance {
        > .element-children {
            .pagebuilder-content-type-wrapper {
                &:nth-child(1) {
                    grid-column: 1;
                    grid-row: 1;
                }
                &:nth-child(2) {
                    grid-column: 1;
                    grid-row: 2;
                }
                &:nth-child(3) {
                    grid-column: 2;
                    grid-row: ~"1 / 3";
                }
            }
        }
    }

    &.right-appearance {
        > .element-children {
            .pagebuilder-content-type-wrapper {
                &:nth-child(1) {
                    grid-column: 1;
                    grid-row: ~"1 / 3";
                }
                &:nth-child(2) {
                    grid-column: 2;
                    grid-row: 1;
                }
                &:nth-child(3) {
                    grid-column: 2;
                    grid-row: 2;
                }
            }
        }
    }
}
```

For storefront, create 

``` xml
view/frontend/web/css/source/_module.less
```

And it will contain:

``` css
.pagebuilder-custom-container-group {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 270px 370px 270px;

    .left-appearance& {
        .pagebuilder-custom-container {
            &:nth-child(1) {
                grid-column: 1;
                grid-row: 1;
            }
            &:nth-child(2) {
                grid-column: 1;
                grid-row: 2;
            }
            &:nth-child(3) {
                grid-column: 2;
                grid-row: ~"1 / 3";
            }
        }
    }

    .right-appearance& {
        .pagebuilder-custom-container {
            &:nth-child(1) {
                grid-column: 1;
                grid-row: ~"1 / 3";
            }
            &:nth-child(2) {
                grid-column: 2;
                grid-row: 1;
            }
            &:nth-child(3) {
                grid-column: 2;
                grid-row: 2;
            }
        }
    }
}
```

## Final note

Now register your new module and clear your cache and you should have a new custom content type called `Custom Container Group` and it default to left appearance.

When it is loaded to the stage, it should be filled with 3 container content types that have only one option to edit. 

The left appearance will have 2 rows of contains on the left while on right appearance there will be 2 rows on the right side.

Finally, you can switch between the 2 appearances via the container group edit panel.
