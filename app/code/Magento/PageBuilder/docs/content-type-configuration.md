# Content Type Configuration

**Note:**
*We are revising configuration, format will change. We will publish draft of new improved configuration soon to get feedback.*

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
    1. **Content type configuration**
    1. [How to add a new content type]
    1. [Events]
    1. [Bindings]
    1. [Master format]
    1. [Visual select] 
    1. [Reuse product conditions in content types]
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


## Configuration

Use the content type and group configuration to add new content types, extend existing content types, add groups in the left menu, or rearrange content types in the groups.

The following is an example of a group configuration in `view/adminhtml/pagebuilder/group.xml`

``` xml
<!-- Definition of main menu, used for grouping content types  -->
    <group name="media" translate="label" sortOrder="10" label="Media"/>
```
### Configuration reference

| Element             | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `group`             | Describes the group name, translated field, and sort order in the menu.  |

| Attribute           | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `label`             | Label displayed on the menu.                                             |

The following is an example of a content type configuration in `view/adminhtml/pagebuilder/content_type/banner.xml`:

``` xml
<!-- Content type declaration -->
<type name="banner"
      label="Banner"
      component="Magento_PageBuilder/js/content-type"
      preview_component="Magento_PageBuilder/js/content-type/banner/preview"
      form="pagebuilder_banner_form"
      group="media"
      icon="icon-pagebuilder-image"
      sortOrder="1"
      translate="label">
    <children default_policy="deny"/>
    <appearances>
        <appearance default="true"
                    name="poster"
                    preview_template="Magento_PageBuilder/content-type/banner/poster/preview"
                    render_template="Magento_PageBuilder/content-type/banner/poster/master"
                    reader="Magento_PageBuilder/js/master-format/read/configurable">
            <elements>
                <element name="main">
                    <style name="border" source="border_style"/>
                    <style name="border_color" source="border_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                    <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/border-width"/>
                    <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                    <style name="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
                    <attribute name="name" source="data-role"/>
                    <attribute name="appearance" source="data-appearance"/>
                    <attribute name="show_button" source="data-show-button"/>
                    <attribute name="show_overlay" source="data-show-overlay"/>
                    <css name="css_classes"/>
                </element>
                <element name="link">
                    <attribute name="link_url" reader="Magento_PageBuilder/js/property/link" persistence_mode="read"/>
                    <attribute name="virtual_link_href" storage_key="link_url" source="href" converter="Magento_PageBuilder/js/converter/attribute/link-href" persistence_mode="write"/>
                    <attribute name="virtual_link_target" storage_key="link_url" source="target" converter="Magento_PageBuilder/js/converter/attribute/link-target" persistence_mode="write"/>
                    <attribute name="virtual_link_type" storage_key="link_url" source="data-link-type" converter="Magento_PageBuilder/js/converter/attribute/link-type" persistence_mode="write"/>
                </element>
                <element name="overlay">
                    <style name="min_height" source="min_height" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                    <style name="background_color" source="background_color" converter="Magento_PageBuilder/js/converter/banner/style/overlay-background-color" persistence_mode="write"/>
                    <style name="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings"/>
                    <attribute name="overlay_color" source="data-overlay-color" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color" persistence_mode="read"/>
                    <attribute name="overlay_transparency" source="data-overlay-color" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-transparency" persistence_mode="read"/>
                    <attribute name="virtual_overlay_transparency" storage_key="overlay_transparency" source="data-overlay-color" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color-transparency" persistence_mode="write"/>
                </element>
                <element name="desktop_image">
                    <style name="text_align" source="text_align"/>
                    <style name="background_color" source="background_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                    <style name="background_image" source="background_image" converter="Magento_PageBuilder/js/converter/style/background-image" preview_converter="Magento_PageBuilder/js/converter/style/preview/background-image"/>
                    <style name="background_position" source="background_position"/>
                    <style name="background_size" source="background_size"/>
                    <style name="background_repeat" source="background_repeat" converter="Magento_PageBuilder/js/converter/style/background-repeat"/>
                    <style name="background_attachment" source="background_attachment"/>
                </element>
                <element name="mobile_image">
                    <style name="text_align" source="text_align"/>
                    <style name="background_color" source="background_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                    <style name="mobile_image" source="background_image" converter="Magento_PageBuilder/js/converter/style/background-image" preview_converter="Magento_PageBuilder/js/converter/style/preview/background-image"/>
                    <style name="background_position" source="background_position"/>
                    <style name="background_size" source="background_size"/>
                    <style name="background_repeat" source="background_repeat" converter="Magento_PageBuilder/js/converter/style/background-repeat"/>
                    <style name="background_attachment" source="background_attachment"/>
                </element>
                <element name="content">
                    <html name="message"/>
                </element>
                <element name="button">
                    <style name="opacity" source="opacity" converter="Magento_PageBuilder/js/converter/banner/style/button-opacity" persistence_mode="write"/>
                    <style name="visibility" source="visibility" converter="Magento_PageBuilder/js/converter/banner/style/button-visibility" persistence_mode="write"/>
                    <html name="button_text"/>
                    <css name="button_type">
                        <filter>
                            <class source="pagebuilder-banner-button"/>
                        </filter>
                    </css>
                </element>
            </elements>
            <converters>
                <converter name="empty_mobile_image" component="Magento_PageBuilder/js/mass-converter/empty-mobile-image">
                    <config>
                        <item name="desktop_image_variable" value="background_image"/>
                        <item name="mobile_image_variable" value="mobile_image"/>
                    </config>
                </converter>
            </converters>
        </appearance>
        <appearance name="collage-left"
                    preview_template="Magento_PageBuilder/content-type/banner/collage-left/preview"
                    render_template="Magento_PageBuilder/content-type/banner/collage-left/master"
                    reader="Magento_PageBuilder/js/master-format/read/configurable">
            <!-- Collage left appearance configuration -->
        </appearance>
        <appearance name="collage-centered"
                    preview_template="Magento_PageBuilder/content-type/banner/collage-centered/preview"
                    render_template="Magento_PageBuilder/content-type/banner/collage-centered/master"
                    reader="Magento_PageBuilder/js/master-format/read/configurable">
            <!-- Collage centered appearance configuration -->
        </appearance>
        <appearance name="collage-right"
                    preview_template="Magento_PageBuilder/content-type/banner/collage-right/preview"
                    render_template="Magento_PageBuilder/content-type/banner/collage-right/master"
                    reader="Magento_PageBuilder/js/master-format/read/configurable">
            <!-- Collage right appearance configuration -->
        </appearance>
    </appearances>
</type>
```
### Configuration reference

| Element             | Description                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`              | Describes the content type name, translated field, and sort order in the menu group. Each type should have its own configuration file.      |
| `parents`           | List of parent content types that can accept this type as a child.                                                                          |
| `children`          | List of children content types that can accept this type as a parent.                                                                       |
| `appearances`       | Appearance configuration.                                                                                                                   |
| `is_visible`        | Determines menu visibility for the component. System components should not be visible in the menu. Default value is true.                   |
| `additional_data`   | Allows to specify additional data for component, see [custom configuration for content type](custom-configuration.md) for more information. |

| Attribute           | Description                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`             | Label displayed on the menu and stage.                                                                                                      |
| `icon`              | Icon displayed on the menu.                                                                                                                 |
| `component`         | View model responsible for rendering the preview and master format.                                                                         |
| `preview_component` | Helper component that contains preview specific logic. Helper component is optional.                                                        |
| `master_component`  | Contains master format rendering logic that is generic for all appearances. Content component is optional.                                  |
| `form`              | UI component form used for editing the content type                                                                                         |
| `group`             | Existing menu group that contains this content type.                                                                                        |


### `form` configuration reference

The `form` element specifies the name of the UiComponent form used to configure content types. All forms should extend the `pagebuilder_base_form`, which contains boilerplate form configuration and the global Advanced Configuration section.
```xml
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd" extends="pagebuilder_base_form">
    <!-- Form Configuration for Content Type -->
</form>
```

Any modifications you might want to make to content type configuration forms use standard UiComponent functionality. Please see [UiComponent Documentation](http://devdocs.magento.com/guides/v2.3/ui_comp_guide/bk-ui_comps.html) for additional information.

### `parents` configuration reference

The `parents` element specifies which content types can accept this type as a child.
Parent policies will overwrite any child policies that are set.
  
**Example:**
``` xml
<parents default_policy="deny">
    <parent name="row" policy="allow"/>
    <parent name="column" policy="allow"/>
</parents>
``` 
| Element             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `parent`            | The name of the parent content type that is allowed or denied.                         |

| Attribute           | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `default_policy`    | Allows or denies all content types to be parents unless specified as a parent element. |

### `children` configuration reference

The `children` element specifies which content types can accept this type as a parent.
  
**Example:**
``` xml
<children default_policy="allow">
    <child name="row" policy="deny"/>
    <child name="column" policy="deny"/>
</children>
``` 
| Element             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `child`             | The name of the child content type that is allowed or denied                           |

| Attribute           | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `default_policy`    | Allows or denies all content types to be children unless specified as a child element. |

### `appearances` configuration reference

The `appearances` element specifies how the content type renders in the admin preview and the master format.
It controls the templates, how data is read from the master format, and how to apply style properties and attributes to the elements.

| Element             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `appearance`        | The name of the appearance. Every content type requires one default appearance.        |
| `data_mapping`      | Specifies how data is read from, saved to, and converted to and from the master format |

| Attribute           | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `preview_template`  | Template used to display the element in the preview                                    |
| `render_template`   | Template used to render the content type to the master format                          |
| `reader`            | Reads data for the content type from the master format                                 |

The default reader is `Magento_PageBuilder/js/component/format/read/configurable`.
It reads data based on the configuration specified in `data_mapping`.

**Example:**
``` xml
<appearance default="true"
            name="poster"
            preview_template="Magento_PageBuilder/content-type/banner/poster/preview"
            render_template="Magento_PageBuilder/content-type/banner/poster/master"
            reader="Magento_PageBuilder/js/master-format/read/configurable">
</appearance>
```

Every content type requires a default appearance to ensure that other modules are able to easily add more appearances.

Set the `default` attribute to "true" in an `appearance` node to set the default appearance for a content type.

### `data_mapping` configuration reference

| Element            | Description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `elements`         | The container for all the elements of the content type.                                               |
| `element`          | The name of the element that contains data for the master format and the render and preview template. |
| `property`         | Specifies style property for the element in the master format                                         |
| `attribute`        | Specifies attribute for the element in master format                                                  |
| `css`              | Specifies whether element has classes and in which variable they should be read                       |
| `html`             | Specifies whether element has html content and in which variable they should be read                  |
| `tag`              | Allows you to read the tag name of the element and map it back to the master format.                  |

**Example:**
``` xml
<elements>
    <element name="main">
        <style name="border" source="border_style"/>
        <style name="border_color" source="border_color" converter="Magento_PageBuilder/js/converter/style/color"/>
        <style name="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
        <attribute name="name" source="data-role"/>
        <css name="css_classes"/>
    </element>
    <element name="link">
        <attribute name="link_url" reader="Magento_PageBuilder/js/property/link" persistence_mode="read"/>
        <attribute name="virtual_link_href" storage_key="link_url" source="href" converter="Magento_PageBuilder/js/converter/attribute/link-href" persistence_mode="write"/>
        <attribute name="virtual_link_target" storage_key="link_url" source="target" converter="Magento_PageBuilder/js/converter/attribute/link-target" persistence_mode="write"/>
        <attribute name="virtual_link_type" storage_key="link_url" source="data-link-type" converter="Magento_PageBuilder/js/converter/attribute/link-type" persistence_mode="write"/>
    </element>
    <element name="overlay">
        <attribute name="overlay_color" source="data-overlay-color" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color" persistence_mode="read"/>
        <attribute name="overlay_transparency" source="data-overlay-color" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-transparency" persistence_mode="read"/>
        <attribute name="virtual_overlay_transparency" storage_key="overlay_transparency" source="data-overlay-color" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color-transparency" persistence_mode="write"/>
    </element>
    <element name="desktop_image">
        <style name="background_image" source="background_image" converter="Magento_PageBuilder/js/converter/style/background-image" preview_converter="Magento_PageBuilder/js/converter/style/preview/background-image"/>
    </element>
    <element name="mobile_image">
        <style name="mobile_image" source="background_image" converter="Magento_PageBuilder/js/converter/style/background-image" preview_converter="Magento_PageBuilder/js/converter/style/preview/background-image"/>
    </element>
    <element name="content">
        <html name="message"/>
    </element>
    <element name="button">
        <style name="opacity" source="opacity" converter="Magento_PageBuilder/js/converter/banner/style/button-opacity" persistence_mode="write"/>
        <style name="visibility" source="visibility" converter="Magento_PageBuilder/js/converter/banner/style/button-visibility" persistence_mode="write"/>
        <html name="button_text"/>
        <css name="button_type">
            <filter>
                <class source="pagebuilder-banner-button"/>
            </filter>
        </css>
    </element>
</elements>
<converters>
    <converter name="empty_mobile_image" component="Magento_PageBuilder/js/mass-converter/empty-mobile-image">
        <config>
            <item name="desktop_image_variable" value="background_image"/>
            <item name="mobile_image_variable" value="mobile_image"/>
        </config>
    </converter>
</converters>
```

Name attribute in the element tags gets converted to ```data-element``` attribute in the master format in order for readers to access the desired element.

### Attributes for `property` and `attribute`

| Attribute             | Description                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------|
| `name`                | Unique name used for configuration merging, and the default value for storage_key if none is provided.                |
| `storage_key`         | Optional variable name for value in the data storage. If no value is provided, name will be used.                     |
| `source`              | The name of the property or attribute in the DOM. Must be in snake case.                                              |
| `converter`           | Converts the value after reading or before saving to the DOM.                                                         |
| `preview_converter`   | Converts the value for the preview. Used for cases where the conversion logic is different between the two views.     |
| `persistence_mode`    | Used for read/write properties.                                                                                       |
| `reader`              | Reader used for parsing attributes and properties out of the DOM. Should not be used with read-only persistence_mode. |

You may optionally set a `reader` value in configuration, otherwise `Magento_PageBuilder/js/property/style-property-reader` will be used for properties, and `Magento_PageBuilder/js/property/attribute-reader` will be used for attributes. Both default readers accept `source` as a parameter, and will return that value.

`property` and `attribute` can contain `converter` and `preview_converter`.

``` xml
<style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
```

`static_style` and `static_attribute` allows you to add specific style properites or attributes to an element.

`static_style` and `static_attribute` do not contain `converter` and `preview_converter` elements.

``` xml
<element name="desktop_image">
    <static_style source="max-width" value="100%"/>
    <static_style source="height" value="auto"/>
</element>
```

These style properties and attributes are applied in the preview and persisted in the master format.

``` html
<img src="my-image.png" style="max-width: 100%; height: auto;" />
```

### Html element

The `html` element allows you to read the innerHTML of the element in a property and map it back to the master format.

``` xml
<html name="message"/>
```

### Css element

The `css` element allows you to read the class value of the element in the property and map back to the master format.

`filter` allows you to specify which static CSS classes to ignore.
These classes are not read and do not appear on the form.

``` xml
<css name="button_type">
    <filter>
        <class source="pagebuilder-banner-button"/>
    </filter>
</css>
```

### Tag element

The `tag` element allows you to read the tag name of the element and map back to the master format.

``` xml
<tag name="heading_type"/>
```

## Add custom logic to content types

You can customize Page Builder content types by adding your own logic on the frontend.

To add custom logic to content types:
1. [Create a JavaScript widget](#create-a-javascript-widget)
2. [Add XML configuration to load it on the frontend](#add-xml-configuration-to-load-it-on-the-frontend)

### Create a JavaScript widget

Create a JavaScript widget in your module's `/view/frontend/web/js/content-type/{content-type-name}/appearance/{appearance-name}/widget.js` file:

``` javascript
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'slick'
], function ($) {
    'use strict';

    return function (config, sliderElement) {

        var $element = $(sliderElement);

        /**
         * Prevent each slick slider from being initialized more than once which could throw an error.
         */
        if ($element.hasClass('slick-initialized')) {
            $element.slick('unslick');
        }

        $element.slick({
            autoplay: $element.data('autoplay') === 1,
            autoplaySpeed: $element.data('autoplay-speed') || 0,
            fade: $element.data('fade') === 1,
            infinite: $element.data('is-infinite') === 1,
            arrows: $element.data('show-arrows') === 1,
            dots: $element.data('show-dots') === 1
        });
    };
});

``` 

### Add XML configuration to load it on the frontend

To load this file on the frontend, add the following configuration to the `default.xml` file in your custom module's `frontend/layout/` directory:

``` xml
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceBlock name="pagebuilder.widget.initializer">
            <arguments>
                <argument name="config" xsi:type="array">
                    <item name="%content-type-name%" xsi:type="array">
                        <item name="default" xsi:type="array">
                            <!--required argument-->
                            <item name="component" xsi:type="string">%{vendor-path}/js/content-type/{content-type-name}/appearance/{appearance-name}/widget%</item>
                            <!--optional if you need provide some config for your widget-->                          
                            <item name="config" xsi:type="array">
                                <item name="buttonSelector" xsi:type="string">.pagebuilder-slide-button</item>
                                <item name="showOverlay" xsi:type="string">hover</item>
                            </item>
                            <!--optional if you want load widget per appearance-->
                            <item name="appearance" xsi:type="string">default</item>
                        </item>
                    </item>
                </argument>
            </arguments>
        </referenceBlock>
    </body>
</page>
```

## Converter Interfaces

Converter and mass converter are the two types of converters. Both converters expect `fromDom` and `toDom` methods, with usage examples described below.

### Converter

The converter converts data for the property or attribute.

The `fromDom` method is called after data is read from the master format.

The `toDom` method is called before observables are updated in the cycle rendering preview or master format.

**Example:** Converter that determines the output for an overlay background color

``` js
define(["Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/number-converter"], function (colorConverter, numberConverter) {
    var OverlayBackgroundColor = function () {};
    
    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    OverlayBackgroundColor.prototype.fromDom = function fromDom(value) {
        return value;
    };
    
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {object} data
     * @returns {string | object}
     */
    OverlayBackgroundColor.prototype.toDom = function toDom(name, data) {
          var overlayColor = "transparent";
        
          if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
                overlayColor = colorConverter.fromHex(data.overlay_color, numberConverter.percentToDecimal(data.overlay_transparency));
          }
        
          return overlayColor;
    };
    return OverlayBackgroundColor;
});
```

### Mass Converter

The mass converter works on the data for all elements.

The `fromDom` method is called after data is read for all elements and converted by element converters.

The `toDom` method is called before data is converted by element converters to update observables.

**Example:** Mass converter that defaults mobile image value to desktop image value if not configured 
``` xml
<converters>
    <converter name="empty_mobile_image" component="Magento_PageBuilder/js/mass-converter/empty-mobile-image">
        <config>
            <item name="desktop_image_variable" value="background_image"/>
            <item name="mobile_image_variable" value="mobile_image"/>
        </config>
    </converter>
</converters>
```

``` js
define([], function () {
    var EmptyMobileImage = function () {};
    
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    EmptyMobileImage.prototype.fromDom = function fromDom(data, config) {
      var desktopImage = data[config.desktop_image_variable];
      var mobileImage = data[config.mobile_image_variable];

      if (mobileImage && desktopImage && mobileImage[0] !== undefined && desktopImage[0] !== undefined && mobileImage[0].url === desktopImage[0].url) {
        delete data[config.mobile_image_variable];
      }

      return data;
    };
    
    /**
     * Process data before it's converted by element converters
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    EmptyMobileImage.prototype.toDom = function toDom(data, config) {
      if (data[config.mobile_image_variable] === undefined || data[config.mobile_image_variable][0] === undefined) {
        data[config.mobile_image_variable] = data[config.desktop_image_variable];
      }

      return data;
    };
    
    return EmptyMobileImage;
});
```

## Preview component settings

| Property                 | Description                                                                                                                         | Example        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------- |
|`fieldsToIgnoreOnRemove`| array containing field names to ignore when evaluating whether an element has been configured. The default value is an empty array. | `["tab_name"]` |
