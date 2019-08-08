# Page Builder configurations

<!-- {% raw %} -->

You can use the content type and menu section configuration to add new content types, extend existing content types, add and modify menu sections present in the left menu and rearrange content types.

## Content Type Configuration
When creating a new content type you will need to create a corresponding XML file outlining the configuration required for your content type.

Your configuration should conform to our XSD: `urn:magento:module:Magento_PageBuilder:etc/content_type.xsd`. This article will go into more details regarding the configuration you can include within a content type.

### `type` element
There are a number of simple attributes that can be configured within the `<type />` node of your content type.

| Attribute           | Description                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | Name of the content type that Magento uses for XML merging. The convention for using multi-word names is to separate the words with hyphens.      |
| `label`             | Label displayed in the Page Builder panel, option menu, and on the Admin stage.                                                                                                      |
| `menu_section`      | Menu section or category in the panel menu where your content type is displayed. The default menu sections are Layout, Elements, Media, and Add Content. See [Panel configurations](../how-to/how-to-customize-panel.md) for more details.  |
| `icon`              | CSS class for icon to be displayed within the menu alongside the content types name. See [How to add icons and images](../how-to/how-to-add-icons-images.md) for more guidance.  |
| `component`         | View model responsible for rendering the preview and master format. The component does not need to specify the `.js` extension. There are two component types to choose from: `content-type` and `content-type-collection`. Use `Magento_PageBuilder/js/content-type` for static content types that do not have children. Use `Magento_PageBuilder/js/content-type-collection` for content types that can contain children, otherwise known as container content types.                                                                        |
| `preview_component` | JavaScript file (`preview.js` or `preview-collection.js`) that provides rendering logic within the Admin UI. The preview component does not need to specify the `.js` extension. <br/><br/>For _collection_ content types, you need to either reference your own `preview-collection` component or reference Page Builder's `preview-collection` (`preview_component="Magento_PageBuilder/js/content-type/preview-collection"`). If you don't specify the `preview_component`, Page Builder uses the base `Preview` component shown in the code: `Magento_PageBuilder/js/content-type/preview`. |
| `master_component`  | JavaScript file (`master.js` or `master-collection.js`) that provides rendering logic generic for all appearances of your content type when rendered on the storefront. The master component does not need to specify the `.js` extension. <br/><br/>For _collection_ content types, you need to either reference your own `master-collection` component or reference Page Builder's `master-collection` (`master_component="Magento_PageBuilder/js/content-type/master-collection"`). If you don't specify the `master_component`, Page Builder uses the base `Master` component shown in the code: `Magento_PageBuilder/js/content-type/master`. |
| `form`              | UI component form that provides the form controls for editing your content type.|
| `icon`              | Optional. Class name for your PNG or SVG image (or font icon) displayed in the Page Builder panel alongside the label. If you don't provide an icon value, the Page Builder panel displays the content type name without an icon. |
| `sortOrder`         | Optional. The listed order within the menu section. For example, `sortOrder=21` puts the content type third in the `Elements` menu section, after the content types with `sortOrder` values of 10 and 20. |
| `translate`         | Identifies the attribute you want Magento to translate. |

#### Basic Configuration Example
As an example of the configurable attributes we can look into the Text content types basic configuration.

```xml
<type name="text"
      label="Text"
      component="Magento_PageBuilder/js/content-type"
      preview_component="Magento_PageBuilder/js/content-type/text/preview"
      form="pagebuilder_text_form"
      menu_section="elements"
      icon="icon-pagebuilder-text"
      sortOrder="1"
      translate="label" />
```

There are a number of child elements which can be configured, these are typically for more advanced options of the content type. All of these options are described in further detail below.

| Element             | Description                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `parents`           | Defines the default policy and matrix of which content types this content type can have as a parent. For instance the Slide content type defines a default policy of `deny` with an exception allowing this content type to only be housed within the Slider content type. |
| `children`          | Similar to the `parents` option, however this defines the allowed `children` of the current content type. As with the Slide example this time the Slider defines the Slide as it's only allowed child. |
| `appearances`       | Configures various appearances along with associated data mapping elements. This is a crucial part of all content types and defines how the master and preview systems should retrieve and display their data. |
| `is_system`         | Determines menu visibility for the content type. System content types are visible in the menu. The default value for this is true. By setting this to false, you can hide child or "special" content types that are added by other content types. For example, you cannot directly drag a Slide content type onto the stage, which means it is not a system content type. |
| `additional_data`   | Allows you to specify additional data for the component. See [additional configurations](../how-to/how-to-add-additional-configurations.md) for more information. |
{:style="table-layout:auto"}

The following is an example of a content type configuration taken from `view/adminhtml/pagebuilder/content_type/text.xml` for our Text content type. This displays some of the different available configuration options for configuring content types.

```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <type name="text"
          label="Text"
          component="Magento_PageBuilder/js/content-type"
          preview_component="Magento_PageBuilder/js/content-type/text/preview"
          form="pagebuilder_text_form"
          menu_section="elements"
          icon="icon-pagebuilder-text"
          sortOrder="1"
          translate="label">
        <children default_policy="deny"/>
        <appearances>
            <appearance default="true"
                        name="default"
                        preview_template="Magento_PageBuilder/content-type/text/default/preview"
                        master_template="Magento_PageBuilder/content-type/text/default/master"
                        reader="Magento_PageBuilder/js/master-format/read/configurable">
                <elements>
                    <element name="main">
                        <style name="text_align" source="text_align"/>
                        <style name="border" source="border_style" converter="Magento_PageBuilder/js/converter/style/border-style"/>
                        <style name="border_color" source="border_color"/>
                        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/border-width"/>
                        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="display" source="display" converter="Magento_PageBuilder/js/converter/style/display" preview_converter="Magento_PageBuilder/js/converter/style/preview/display"/>
                        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
                        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings"/>
                        <attribute name="name" source="data-content-type"/>
                        <attribute name="appearance" source="data-appearance"/>
                        <html name="content" preview_converter="Magento_PageBuilder/js/converter/html/directive"/>
                        <css name="css_classes"/>
                    </element>
                </elements>
            </appearance>
        </appearances>
        <additional_data>
            <item name="wysiwygConfig" xsi:type="array">
                <item name="wysiwygConfigData" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Wysiwyg\Config</item>
            </item>
        </additional_data>
    </type>
</config>
```

#### `form` attribute

The `form` attribute specifies the name of the UiComponent form used to configure content types. All forms can extend the `pagebuilder_base_form`, which contains boilerplate form configuration and the global Advanced Configuration section. If you decide to omit extending the base form you'll need to ensure you manually declare the various requirements from the base form.
```xml
<form xmlns:xsi="..." xsi:noNamespaceSchemaLocation="..." extends="pagebuilder_base_form" />
```

Any modifications you might want to make to content type configuration forms use standard UiComponent functionality. Please see [UiComponent Documentation](http://devdocs.magento.com/guides/v2.3/ui_comp_guide/bk-ui_comps.html) for additional information.

#### `parents` element

The `parents` element specifies which content types can accept this type as a child.
Parent policies will override any child policies that are set.

You can configure the default policy to easily `allow` or `deny` all parents. 

| Attribute           | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `default_policy`    | Values: `allow` `deny`. Allows or denies all content types to be parents unless specified as a parent element. |
{:style="table-layout:auto"}

The `parents` node accepts a list of content types for the policy via child `parent` elements.

| Attribute             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `name`              | The name of the content type that this parents policy is assigned to. Such as `slider`.       |
| `policy`            | Values: `allow` `deny`. Determine whether the current content type is allowed or denied to be a child of the specified content type.  |
{:style="table-layout:auto"}

**Example:**
``` xml
<parents default_policy="deny">
    <parent name="row" policy="allow"/>
    <parent name="column" policy="allow"/>
</parents>
``` 

#### `children` element

The `children` element specifies which content types can accept this type as a parent, this configuration is formed the same as the above `parents` configuration, the difference being this controls which content types can be a child of the current content type.
Parent policies will override any child policies that are set. 

You can configure the default policy to easily `allow` or `deny` all children. 

| Attribute           | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `default_policy`    | Values: `allow` `deny`. Allows or denies all content types to be children unless specified as a child element. |
{:style="table-layout:auto"}

The `children` node accepts a list of content types for the policy via child `child` elements.

| Attribute             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `name`              | The name of the content type that this parents policy is assigned to. Such as `slider`.       |
| `policy`            | Values: `allow` `deny`. Determine whether the current content type is allowed or denied to be a child of the specified content type.  |
{:style="table-layout:auto"}


**Example:**
``` xml
<children default_policy="allow">
    <child name="row" policy="deny"/>
    <child name="column" policy="deny"/>
</children>
``` 

#### `appearances` element

The `appearances` element can contain multiple appearances which control how the content type renders in the admin preview and master format. The appearance configuration specifies how the master and preview functionality interacts with data from the master format. It also defines where and how data should be placed on the elements declared in your `master.html` and `preview.html` templates.

Each content type can have a number of different appearances, these appearances can alter where data is placed on the element, the data that is applied along with the templates that are used for each appearance. This enables you to create different views of the same content type without adding additional bloat to the UI.

For instance a great use of this functionality within Banner is to display the content is different positions within the banner. We strongly recommend when customising any content types you utilise the appearance framework and look to add a new appearance.

| Attribute           | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `name`              | The name for this appearance.                                                          |
| `default`           | Determines whether this is the default appearance for the content type. The default will be auto selected when adding a new instance of the content type.                                                          |
| `preview_template`  | Template used to display the content type within the admin preview.                    |
| `master_template`   | Template which is hydrated with data and rendered to be stored as the master format.                         |
| `reader`            | Reads data for the content type from the master format. Unless you need to conduct complex retrieval of data from the master format we recommend you use the default `Magento_PageBuilder/js/master-format/read/configurable` reader as this contains the necessary logic for the child `element` nodes to work. |
{:style="table-layout:auto"}

**Example:**
```xml
<appearance default="true"
            name="default"
            preview_template="Magento_PageBuilder/content-type/text/default/preview"
            master_template="Magento_PageBuilder/content-type/text/default/master"
            reader="Magento_PageBuilder/js/master-format/read/configurable" />
```

Every content type must declare a default appearance to allow other modules to easily extend the content type with additional appearances.

##### Appearance Elements Configuration
To enable your appearance to effectively read and write data from the master format into your preview and master templates you'll need to declare the various attributes to be applied to your elements. 

These are declared under the `<elements />` node within the appearance. 

###### `element`

| Attribute           | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `name`              | The name for the element that will be used to reference the data mapping configuration from your templates. This must be unique within the current appearance.    |
{:style="table-layout:auto"}

The name specified here is used within your templates bindings to retrieve the data from your configuration.

For instance if you specified the element name to be `main` by `<element name="main" />` you'd then be able to reference all styles and attributes via the following format within your master and preview templates:

```html
<div html="data.main.html" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css"></div>
```

Within an element you're able to specify different standard HTML attributes to customise the output displayed. 

| Element            | Description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `attribute`        | Assign a HTML attribute to the current element.                                                  |
| `css`              | Assign field name for CSS classes to be included on the element, also allows to specifically ignore system classes so they're not displayed within the content types edit form.                      |
| `html`             | Allows for a fields value to be output as HTML within the current element. This is used within the Text content type to ensure all content is rendered as expected. **Warning:** If you're using this attribute you should ensure you're safely escaping any harmful values to avoid adding potential XSS vulnerabilities within the admin.                |
| `tag`              | Allows you to read the tag name of the element and map it back to the master format. This is used in instances where the content type is modifying the type of element output, such as in Heading.               |
{:style="table-layout:auto"}

**Example:**

Here we have an example from our Button Item content type, which shows multiple elements with various attributes.
```xml
<elements>
    <element name="main">
        <style name="display" source="display" converter="Magento_PageBuilder/js/content-type/button-item/converter/style/display" preview_converter="Magento_PageBuilder/js/converter/style/preview/display"/>
        <attribute name="name" source="data-content-type"/>
        <attribute name="appearance" source="data-appearance"/>
        <css name="css_classes"/>
    </element>
    <element name="link">
        <style name="text_align" source="text_align"/>
        <style name="border" source="border_style" converter="Magento_PageBuilder/js/converter/style/border-style"/>
        <style name="border_color" source="border_color"/>
        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/border-width"/>
        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings"/>
        <attribute name="button_link" reader="Magento_PageBuilder/js/property/link" persistence_mode="read"/>
        <attribute name="virtual_link_href" storage_key="button_link" source="href" converter="Magento_PageBuilder/js/converter/attribute/link-href" persistence_mode="write"/>
        <attribute name="virtual_link_target" storage_key="button_link" source="target" converter="Magento_PageBuilder/js/converter/attribute/link-target" persistence_mode="write"/>
        <attribute name="virtual_link_type" storage_key="button_link" source="data-link-type" converter="Magento_PageBuilder/js/converter/attribute/link-type" persistence_mode="write"/>
        <css name="button_type"/>
    </element>
    <element name="empty_link">
        <style name="text_align" source="text_align"/>
        <style name="border" source="border_style" converter="Magento_PageBuilder/js/converter/style/border-style"/>
        <style name="border_color" source="border_color"/>
        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/border-width"/>
        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings"/>
        <css name="button_type"/>
    </element>
    <element name="link_text">
        <html name="button_text" converter="Magento_PageBuilder/js/converter/html/tag-escaper"/>
    </element>
</elements>
```

We automatically apply a `data-element` attribute upon any element which has a linked `<element />` based on it's name. This enables us to easily read the data for a specific element. To ensure this functionality works you're required to include the appropriate Knockout attribute binding on all elements, otherwise you may see data not being read correctly from the DOM.

###### `style`, `property` and `attribute` elements

All these elements share a common near identical interface and can be configured using the following attributes.

| Attribute             | Description                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------|
| `name`                | Unique name used for configuration merging, and the default value for storage_key if none is provided.                |
| `storage_key`         | Optional variable name for value in the data storage. If no value is provided, name will be used. This is the form fields data scope which is typically the name unless a `dataScope` is provided on the field. Supports the dot notation for `dataScope` (such as `layout.min_height`). |
| `source`              | The name of the property or attribute in the DOM. Must be in snake case. For instance `text_align` aligns to `text-align`.                                            |
| `converter`           | Converts the value after reading or before saving to the DOM.                                                         |
| `preview_converter`   | Converts the value for the preview. Used for cases where the conversion logic is different between the two views.     |
| `persistence_mode`    | Used for read/write properties.                                                                                       |
| `reader`              | Reader used for parsing attributes and properties out of the DOM. Should not be used with read-only persistence_mode. |
{:style="table-layout:auto"}

You may optionally set a `reader` value in configuration, otherwise `Magento_PageBuilder/js/property/style-property-reader` will be used for properties, and `Magento_PageBuilder/js/property/attribute-reader` will be used for attributes. Both default readers accept `source` as a parameter, and will return that value.

```xml
<style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins" />
```

##### `converter`

The converter enable you to convert data between different formats or make mutations on the data as it's read or written for your specific element. For instance removing or adding `px` to styles which require it, or converting color formats to and from a desired format.

The `fromDom` method is called after data is read from the master format.

The `toDom` method is called before observables are updated in the cycle rendering preview or master format.

When accessing data provided into the above functions **you should** utilise the `get` and `set` utility functions from `Magento_PageBuilder/js/utils/object` to ensure any data mapping entries which traverse deeper into the data set with the dot notation can correctly retrieve and set their data.

**Example:**

The following is a converter that determines the output for an overlay background color:

```js
define(["Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/number-converter", "Magento_PageBuilder/js/utils/object"], function (colorConverter, numberConverter, objectUtil) {
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

###### `static_style` and `static_attribute` elements

These elements allow you to add specific static style properties or attributes to an element, this can be used to include styles which don't require any logic or input by the end user. These do not contain the `converter` and `preview_converter` functionality.

For instance we commonly use these to include height, width or alignment styles to elements to ensure they render correctly on the store front. The idea behind the master format is to contain all the required data to effectively render the content without prior understanding of the Page Builder format, thus if a style is integral for the rendering of the content it should be included within the DOM rather than in a loaded style sheet.

```xml
<element name="desktop_image">
    <static_style source="max-width" value="100%" />
    <static_style source="height" value="auto" />
</element>
```

These style properties and attributes are applied in the preview and persisted in the master format.

The above will produce the following output if `desktop_image` is attached to a `<img />` element.
```html
<img src="my-image.png" style="max-width: 100%; height: auto;" />
```

###### `html` 

The `html` element allows you to read the innerHTML of the element in a property and map it back to the master format. This enables you to add rich text editing to a content type and have the HTML written and read from the master format.

**Warning:** The HTML you're including should be properly escaped and verified to ensure you're not introducing an XSS vulnerability within your content type. We provide `Magento_PageBuilder/js/converter/html/tag-escaper` to help with this functionality.

```xml
<html name="message" converter="Magento_PageBuilder/js/converter/html/tag-escaper" />
```

###### `css`

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

###### `tag`

The `tag` element allows you to read the tag name of the element and map back to the master format.

``` xml
<tag name="heading_type"/>
```

#### Mass converter

The mass converter provides a similar function to the element converters, however they're able to access and modify all data. For instance we use these to convert the background desktop and mobile images into a JSON format which is read and rendered into CSS on the storefront. These sit within your specific appearance.

The `fromDom` method is called after data is read for all elements and converted by element converters.

The `toDom` method is called before data is converted by element converters to update observables.

When accessing data provided into the above functions **you should** utilise the `get` and `set` utility functions from `Magento_PageBuilder/js/utils/object` to ensure any data mapping entries which traverse deeper into the data set with the dot notation can correctly retrieve and set their data.

**Example:** Mass converter that defaults mobile image value to desktop image value if not configured 
```xml
<converters>
    <converter name="empty_mobile_image" component="Magento_PageBuilder/js/mass-converter/empty-mobile-image">
        <config>
            <item name="desktop_image_variable" value="background_image"/>
            <item name="mobile_image_variable" value="mobile_image"/>
        </config>
    </converter>
</converters>
```

```js
define(["Magento_PageBuilder/js/utils/object"], function (objectUtil) {
    var EmptyMobileImage = function () {};
    
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    EmptyMobileImage.prototype.fromDom = function fromDom(data, config) {
        var desktopImage = objectUtil.get(data, config.desktop_image_variable);
        var mobileImage = objectUtil.get(data, config.mobile_image_variable);
        
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
        var mobileImage = objectUtil.get(data, config.mobile_image_variable);
        
        if (mobileImage === undefined || mobileImage[0] === undefined) {
            objectUtil.set(data, config.mobile_image_variable, objectUtil.get(data, config.desktop_image_variable));
        }
        
        return data;
    };
    
    return EmptyMobileImage;
});
```

### Preview component settings

When creating your preview component there are some additional settings you can configure to inform the internal framework how to handle aspects of your data.

| Property                 | Description                                                                                                                         | Example        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------- |
|`fieldsToIgnoreOnRemove`| An array containing field names to ignore when evaluating whether an element has been configured. This is utilised when deciding whether to display the confirmation on removal of a content type. The default value is an empty array. | `["tab_name"]` |
{:style="table-layout:auto"}

<!-- {% endraw %} -->

### Menu Sections

The different sections displayed in the left menu are configured with the `menu_section.xml` configuration. This configuration allows you to configure new menu sections along with modifying existing ones.

Your configuration should conform to our XSD: `urn:magento:module:Magento_PageBuilder:etc/menu_section.xsd`. This article will go into more details regarding the configuration you can include within a content type.

We discourage modifying existing menu sections if they do not belong to your module.

#### `menu_section` element

| Attribute           | Description                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | The internal name for this menu section, will be used by content types to reference your section.      |
| `translate`         | Determine which aspects of the menu section should be translated.                                                                                    |
| `sortOrder`         | The sort order in relation to other menu sections, within our configuration we step these 10 integers apart to allow for new sections to be added in between. |
| `label`             | The label to be displayed within the left menu    |
{:style="table-layout:auto"}

The following is an example of a menu section configuration in `view/adminhtml/pagebuilder/menu_section.xml`:

Here we have an example of our layout menu section configuration.
```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/menu_section.xsd">
    <menu_section name="layout" translate="label" sortOrder="1" label="Layout"/>
</config>
```

For more information on how to customise the menu sections and the left panel please see: [How to customize the panel](../how-to/how-to-customize-panel.md).