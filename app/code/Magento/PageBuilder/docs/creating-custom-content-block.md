# Creating Custom Content Block

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
    1. **Additional data configuration**
    1. [Content type configuration]
    1. [How to add a new content type]
    1. [Bindings]
    1. [Events]
    1. [Bindings]
    1. [Master format]
    1. [Visual select] 
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Use the block chooser UI component]
    1. [Render a backend content type preview]
    1. [Custom Toolbar]
    1. [Add image uploader to content type]
    1. [Full width page layouts]
5. [Roadmap and known issues]
6. [Creating custom content block]
7. [How to create custom PageBuilder content type container]

[Introduction]: README.md
[Installation Guide]: install.md
[Contribution guide]: CONTRIBUTING.md
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
[Bindings]: bindings.md
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

## Configuration for Page Builder blocks

Use the content type configuration to add new content types. Refer to content-type-configuration.md, in the configuration section for further details.

The following is an example of a custom container content type configuration in DaveMacaulay_PageBuilderGrid/view/base/pagebuilder/content_type/homepage_grid.xml:

``` xml
<type name="homepage-grid"
      label="Grid"
      component="Magento_PageBuilder/js/content-type-collection"
      preview_component="DaveMacaulay_PageBuilderGrid/js/content-type/homepage-grid/preview"
      master_component="Magento_PageBuilder/js/content-type/master-collection"
      form="pagebuilder_homepage_grid_form"
      group="general"
      icon="icon-pagebuilder-row"
      sortOrder="1"
      translate="label">
    <parents default_policy="deny">
        <parent name="stage" policy="allow"/>
    </parents>
    <children default_policy="deny">
        <child name="homepage-grid-item" policy="allow"/>
    </children>
    <appearances>
        <appearance default="true"
                    name="default"
                    preview_template="DaveMacaulay_PageBuilderGrid/content-type/homepage-grid/default/preview"
                    render_template="DaveMacaulay_PageBuilderGrid/content-type/homepage-grid/default/master"
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
                             <class source="pagebuilder-homepage-grid"/>
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
```

The following is an example of a custom container children content type configuration in DaveMacaulay_PageBuilderGrid/view/base/pagebuilder/content_type/homepage_grid_item.xml:

``` xml
<type name="homepage-grid-item"
              label="Grid Item"
              component="Magento_PageBuilder/js/content-type-collection"
              preview_component="DaveMacaulay_PageBuilderGrid/js/content-type/homepage-grid-item/preview"
              master_component="Magento_PageBuilder/js/content-type/master-collection"
              form="pagebuilder_homepage_grid_item_form"
              group="general"
              icon="icon-pagebuilder-row"
              sortOrder="1"
              translate="label">
    <parents default_policy="deny">
        <parent name="homepage-grid" policy="allow"/>
    </parents>
    <children default_policy="deny"> 
        <child name="heading" policy="allow"/> 
        <child name="buttons" policy="allow"/> 
        <child name="text" policy="allow"/> 
    </children>
    <is_visible>false</is_visible>
    <appearances>
        <appearance default="true"
                    name="default"
                    preview_template="DaveMacaulay_PageBuilderGrid/content-type/homepage-grid-item/default/preview"
                    render_template="DaveMacaulay_PageBuilderGrid/content-type/homepage-grid-item/default/master"
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
                            <class source="pagebuilder-homepage-grid-item"/>
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
```

### Preview template & block system

In the configuration file, a preview template path is set for it and PageBuilder will reader the selected file to treat it as the preview template for the content type.

The template will just be a ko binded html template.

The following are the preview templates for the container and children content types.

``` html
<div class="pagebuilder-content-type type-container pagebuilder-homepage-grid"
     attr="data.main.attributes"
     ko-style="data.main.style"
     css="data.main.css"
     event="{ mouseover: onMouseOver, mouseout: onMouseOut }">
    <render args="getOptions().template" />
    <render args="previewChildTemplate" />
</div>
```
``` html
<div class="pagebuilder-content-type type-container pagebuilder-homepage-item"
     attr="data.main.attributes"
     ko-style="data.main.style"
     css="Object.assign(data.main.css(), {'empty-container': parent.children().length == 0})"
     event="{ mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
    <render args="getOptions().template" />
    <render args="previewChildTemplate" />

    <div class="pagebuilder-display-label" html="function () { return displayLabel().toUpperCase(); }()"></div>
    <div class="pagebuilder-empty-container" css="{visible: parent.children().length == 0}" translate="'Empty Grid Item'">
        <div class="pagebuilder-drop-indicator"></div>
    </div>
</div>
```

Explanations of the custom ko bindings:

| KO Binding          | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `attr`              | Add attributes                                                                         |
| `ko-style`          | Add styles                                                                             |
| `css`               | Add css classes                                                                        |
| `event`             | Add event handlers                                                                     |
| `html`              | Set html content                                                                       |

The following renders out the options menu for the content type.

``` html
<render args="getOptions().template" />
```

The following renders out the children content types.

``` html
<render args="previewChildTemplate" />
```

### Component & render template system

Master template is going to be more straight forward.

Example of master format template:

``` html
<div attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" class="pagebuilder-homepage-grid">
    <render args="renderChildTemplate"/>
</div>
```

Same as the preview template, the ko bindings will fill the template with the attributes, styles, and classes and the inner element will be replaced with the expected children templates.

As for the styling, add a less style file to:

``` xml
<Custom_Module>/view/<adminhtml or base or frontend>/web/css/source
```

If the storefront and stage share the same styling then place the less file in base and it will be shared across both places, if not add your custom styling to frontend and adminhtml separately.

### Read system for render system

The default reader is:

``` xml
Magento_PageBuilder/js/master-format/read/configurable
```

The way the configurable reader works is it goes through the element list in the configuration file and does a query selector against the master format stored in the database to grab the desired element using the data-element attribute on each element.

Once the element is found, it goes through and grabs the styles, attributes, css, html, and tag then stores the data as an object then uses the content types converter to convert the data to the desired format before returning the result.

The reader can be replaced or extended depends on the needs.

### Building UI component form for Page Builder

UI component form are stored in

``` xml
<Custom_Module>/view/adminhtml/ui_component
```

Before creating the ui component form, a layout needs to be added to the folder:

``` xml
<Custom_Module>/view/adminhtml/layout
```

Example of a layout:

``` xml
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="admin-1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="pagebuilder_homepage_grid_form"/>
        </referenceContainer>
    </body>
</page>
```

For more information on UI component form, refer to `form configuration reference` section in content-type-configuration.md

### How to bind custom JS to stage elements

In order to bind custom js to elements, a preview component needs to be specified in the configuration.

By default, the components used for content types are:

``` xml
preview_component="Magento_PageBuilder/js/content-type/preview"
```

And for containers are:

``` xml
preview_component="Magento_PageBuilder/js/content-type/preview-collection"
```

If a custom component were to be created, it would best to extend from these to start.

An example of custom JS component:

``` js
define([
    'jquery',
    'knockout',
    'Magento_PageBuilder/js/events',
    'underscore',
    'Magento_PageBuilder/js/content-type/preview-collection',
    'Magento_PageBuilder/js/content-type-factory',
    'Magento_PageBuilder/js/config',
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

        events.on("homepage-grid:dropAfter", function (args) {
            if (args.id === self.parent.id && self.parent.children().length === 0) {
                // Once the grid is ready, let's add in our children
                self.populateGrid();
            }
        });
    }
    Preview.prototype = Object.create(PreviewCollection.prototype);

    /**
     * Populate the grid with 5 children
     */
    Preview.prototype.populateGrid = function () {
        var self = this;
        var i;

        // Create 5 homepage grid items
        for (i = 0; i < 5; i++) {
            createContentType(
                pageBuilderConfig.getContentTypeConfig("homepage-grid-item"),
                this.parent,
                this.parent.stageId
            ).then(function (gridItem) {
                self.parent.addChild(gridItem);
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

Using the above, available options can be altered via the retrieveOptions function.

In this example, it will be removing the default move, duplicate, and remove options from the options list.

``` js
Preview.prototype.retrieveOptions = function retrieveOptions() {
    var options = $super.retrieveOptions.call(this, arguments);

    return _.filter(options, function (option) {
        return option.code !== "move" &&  option.code !== "duplicate" && option.code !== "remove";
    });
};
```

### How to bind custom JS to front-end elements

In order to bind custom JS to front-end elements, the content type needs to have a widget attached to it.

To create a widget, the default frontend layout configuration needs to be added.

It should be saved in:

``` xml
<Custom_Module>/view/frontend/layout/default.xml
```

Following an example of a custom layout:

``` xml
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceBlock name="head.components">
            <block class="Magento\PageBuilder\Block\WidgetInitializer" name="pagebuilder.widget.initializer" template="Magento_PageBuilder::widget_initializer.phtml">
                <arguments>
                    <argument name="config" xsi:type="array">
                        <item name="homepage-grid" xsi:type="array">
                            <item name="default" xsi:type="array">
                                <item name="component" xsi:type="string">DaveMacaulay_PageBuilderGrid/js/content-type/homepage-grid/appearance/default/widget</item>
                            </item>
                        </item>
                    </argument>
                </arguments>
            </block>
        </referenceBlock>
    </body>
</page>
```

This will get merged with the PageBuilders layout, adding the widget configuration for the custom `grid` content type.

Afterwards, it is time to create the actual widget. The widget should be stored in the component location in the layout configuration which in this example is:

``` xml
DaveMacaulay_PageBuilderGrid/js/content-type/homepage-grid/appearance/default/widget
```

Inside the widget, it should look similar to preview component because it is similar. It is just a component dedicated to storefront content types.

A simple example that will just output `Hello World` into the console on page load if a `grid` content type is on there.

``` js
define([], function () {
    'use strict';

    return function (config, element) {
        console.log('Hello World');
    };
})
```

### Registering Component/Module

More information can be found here:

https://devdocs.magento.com/guides/v2.2/extension-dev-guide/build/component-registration.html
