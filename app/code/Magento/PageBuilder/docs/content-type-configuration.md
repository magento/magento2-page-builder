# Content Type Configuration

## Configuration

You can use content type configuration to add new content types, extend existing content types, add groups in the left menu or rearrange content types in the groups.

Below is an example of configuration from `content_type.xml`.

```
<!-- Definition of main menu, used for grouping content types  -->
<groups>
    <group name="media" sortOrder="10">
        <label translate="true">Media</label>
    </group>
</groups>
<content_types>
    <!-- Content type declaration -->
    <type name="banner" translate="label" sortOrder="1">
        <label>Banner</label>
        <icon>icon-pagebuilder-image</icon>
        <component>Magento_PageBuilder/js/component/block/banner</component>
        <preview_component>Magento_PageBuilder/js/component/block/preview/banner</preview_component>
        <form>pagebuilder_banner_form</form>
        <group>media</group>
        <allowed_parents>
            <parent name="row"/>
            <parent name="column"/>
        </allowed_parents>
        <appearances>
            <appearance name="poster" default="true">
                <data_mapping>
                    <elements>
                        <element name="main" path=".">
                            <style_properties>
                                <property var="border" name="border_style"/>
                                <property var="border_color" name="border_color" converter="Magento_PageBuilder/js/converter/default/style/color"/>
                                <property var="border_width" name="border_width" converter="Magento_PageBuilder/js/converter/default/style/border-width"/>
                                <property var="border_radius" name="border_radius" converter="Magento_PageBuilder/js/converter/default/style/remove-px"/>
                                <complex_property var="margins_and_padding" reader="Magento_PageBuilder/js/property/default/margins" converter="Magento_PageBuilder/js/converter/default/style/margins"/>
                            </style_properties>
                            <attributes>
                                <attribute var="name" name="data-role"/>
                                <attribute var="appearance" name="data-appearance"/>
                                <attribute var="show_button" name="data-show-button"/>
                                <attribute var="show_overlay" name="data-show-overlay"/>
                            </attributes>
                            <css var="css_classes"/>
                        </element>
                        <element name="link" path=".//a">
                            <attributes>
                                <attribute var="link_url" name="href" />
                                <attribute var="open_in_new_tab" name="target" converter="Magento_PageBuilder/js/converter/default/attribute/target"/>
                            </attributes>
                        </element>
                        <element name="overlay" path=".//a/div[2]/div">
                            <style_properties>
                                <property var="min_height" name="min_height" converter="Magento_PageBuilder/js/converter/default/style/remove-px"/>
                                <property var="background_color" name="background_color" virtual="true" converter="Magento_PageBuilder/js/converter/banner/style/overlay-background-color"/>
                                <complex_property var="margins_and_padding" reader="Magento_PageBuilder/js/property/default/paddings" converter="Magento_PageBuilder/js/converter/default/style/paddings"/>
                            </style_properties>
                            <attributes>
                                <attribute var="overlay_color" name="data-overlay-color" persist="false" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color"/>
                                <attribute var="overlay_transparency" name="data-overlay-color" persist="false" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-transparency"/>
                                <attribute var="overlay_transparency" name="data-overlay-color" virtual="true" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color-transparency"/>
                            </attributes>
                        </element>
                        <element name="desktop_image" path=".//a/div[1]">
                            <style_properties>
                                <property var="text_align" name="text_align"/>
                                <property var="background_color" name="background_color" converter="Magento_PageBuilder/js/converter/default/style/color"/>
                                <property var="background_image" name="background_image" converter="Magento_PageBuilder/js/converter/default/style/background-image" preview_converter="Magento_PageBuilder/js/converter/default/style/preview/background-image"/>
                                <property var="background_position" name="background_position"/>
                                <property var="background_size" name="background_size"/>
                                <property var="background_repeat" name="background_repeat" converter="Magento_PageBuilder/js/converter/default/style/background-repeat"/>
                                <property var="background_attachment" name="background_attachment"/>
                            </style_properties>
                        </element>
                        <element name="mobile_image" path=".//a/div[2]">
                            <style_properties>
                                <property var="text_align" name="text_align"/>
                                <property var="background_color" name="background_color" converter="Magento_PageBuilder/js/converter/default/style/color"/>
                                <property var="mobile_image" name="background_image" converter="Magento_PageBuilder/js/converter/default/style/background-image" preview_converter="Magento_PageBuilder/js/converter/default/style/preview/background-image"/>
                                <property var="background_position" name="background_position"/>
                                <property var="background_size" name="background_size"/>
                                <property var="background_repeat" name="background_repeat" converter="Magento_PageBuilder/js/converter/default/style/background-repeat"/>
                                <property var="background_attachment" name="background_attachment"/>
                            </style_properties>
                        </element>
                        <element name="content" path=".//a/div[2]/div/div/div[1]">
                            <html var="message" placeholder="Edit banner text"/>
                        </element>
                        <element name="button" path=".//a/div[2]/div/div/button">
                            <style_properties>
                                <property var="opacity" name="opacity" virtual="true" converter="Magento_PageBuilder/js/converter/banner/style/button-opacity"/>
                                <property var="visibility" name="visibility" virtual="true" converter="Magento_PageBuilder/js/converter/banner/style/button-visibility"/>
                            </style_properties>
                            <html var="button_text" placeholder="Edit Button Text"/>
                            <css var="button_type">
                                <filter>
                                    <class name="pagebuilder-banner-button"/>
                                </filter>
                            </css>
                        </element>
                    </elements>
                    <converters>
                        <converter name="empty_mobile_image" component="Magento_PageBuilder/js/converter/default/empty-mobile-image">
                            <config>
                                <item name="desktop_image_variable" value="background_image"/>
                                <item name="mobile_image_variable" value="mobile_image"/>
                            </config>
                        </converter>
                    </converters>
                </data_mapping>
                <preview_template>Magento_PageBuilder/component/block/preview/banner.html</preview_template>
                <render_template>Magento_PageBuilder/component/block/render/banner.html</render_template>
                <reader>Magento_PageBuilder/js/component/format/read/configurable</reader>
            </appearance>
            <appearance name="collage-left">
                <!-- Collage left appearance configuration -->
            </appearance>
            <appearance name="collage-centered">
                <!-- Collage centered appearance configuration -->
            </appearance>
            <appearance name="collage-right">
                <!-- Collage right appearance configuration -->
            </appearance>
        </appearances>
    </type>
</content_types>
```

Fields Description

* `label` - label that will be displayed in the menu and on stage for content type
* `icon` - icon that will be displayed in the menu for the content type
* `component` - view model for content type, responsible for rendering of the content type in the preview and rendering of master format
* `preview_component` - helper component that contains preview specific logic
* `form` - ui component form that will be used for editing content type
* `group` - group in the menu, should be declared in the configuration
* `allowed_parents` - which elements can except this content type as child
* `appearances` - configuration of the appearances for component, see below
* `is_visible` - whether or not component visible in the menu, some components are system components and should not be visible in menu

Appearances

Appearance specifies how content type will look in admin preview and how it will be rendered to master format. Appearance can control templates, how data will be read from master format, add how style properties and attributes will be applied to the elements.

Appearance configuration consists of
* data_mapping - specifies how data is read from the master format, how it will be saved to master format and conversion from and to master format
* preview_template - template that is used to display element in the preview
* render_template - template used to render content type to master format
* reader - used to read data for content type from master format

```
<appearance name="poster" default="true">
    <data_mapping/>
    <preview_template>Magento_PageBuilder/component/block/preview/banner.html</preview_template>
    <render_template>Magento_PageBuilder/component/block/render/banner.html</render_template>
    <reader>Magento_PageBuilder/js/component/format/read/configurable</reader>
</appearance>
```

Every content type should have one default appearance, this is specified by adding default="true" attribute to a node.

Configuration of `data_mapping`
* `style_properties` - specifies styles properties for the element in the master format
* `attributes` - specifies attributes for the element in master format
* `css` - specifies whether element has classes and in which variable they should be read
* `html` - specifies whether element has html content and in which variable they should be read

```
<elements>
    <element name="main" path=".">
        <style_properties>
            <property var="border" name="border_style"/>
            <property var="border_color" name="border_color" converter="Magento_PageBuilder/js/converter/default/style/color"/>
            <complex_property var="margins_and_padding" reader="Magento_PageBuilder/js/property/default/margins" converter="Magento_PageBuilder/js/converter/default/style/margins"/>
        </style_properties>
        <attributes>
            <attribute var="name" name="data-role"/>
        </attributes>
        <css var="css_classes"/>
    </element>
    <element name="link" path=".//a">
        <attributes>
            <attribute var="link_url" name="href" />
            <attribute var="open_in_new_tab" name="target" converter="Magento_PageBuilder/js/converter/default/attribute/target"/>
        </attributes>
    </element>
    <element name="overlay" path=".//a/div[2]/div">
        <attributes>
            <attribute var="overlay_color" name="data-overlay-color" persist="false" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color"/>
            <attribute var="overlay_transparency" name="data-overlay-color" persist="false" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-transparency"/>
            <attribute var="overlay_transparency" name="data-overlay-color" virtual="true" converter="Magento_PageBuilder/js/converter/banner/attribute/overlay-color-transparency"/>
        </attributes>
    </element>
    <element name="desktop_image" path=".//a/div[1]">
        <style_properties>
            <property var="background_image" name="background_image" converter="Magento_PageBuilder/js/converter/default/style/background-image" preview_converter="Magento_PageBuilder/js/converter/default/style/preview/background-image"/>
        </style_properties>
    </element>
    <element name="mobile_image" path=".//a/div[2]">
        <style_properties>
            <property var="mobile_image" name="background_image" converter="Magento_PageBuilder/js/converter/default/style/background-image" preview_converter="Magento_PageBuilder/js/converter/default/style/preview/background-image"/>
        </style_properties>
    </element>
    <element name="content" path=".//a/div[2]/div/div/div[1]">
        <html var="message" placeholder="Edit banner text"/>
    </element>
    <element name="button" path=".//a/div[2]/div/div/button">
        <style_properties>
            <property var="opacity" name="opacity" virtual="true" converter="Magento_PageBuilder/js/converter/banner/style/button-opacity"/>
            <property var="visibility" name="visibility" virtual="true" converter="Magento_PageBuilder/js/converter/banner/style/button-visibility"/>
        </style_properties>
        <html var="button_text" placeholder="Edit Button Text"/>
        <css var="button_type">
            <filter>
                <class name="pagebuilder-banner-button"/>
            </filter>
        </css>
    </element>
</elements>
<converters>
    <converter name="empty_mobile_image" component="Magento_PageBuilder/js/converter/default/empty-mobile-image">
        <config>
            <item name="desktop_image_variable" value="background_image"/>
            <item name="mobile_image_variable" value="mobile_image"/>
        </config>
    </converter>
</converters>
```

Attributes of `property` and `attribute`
* `var` - name of the variable in data storage, should be unique per content type
* `name` - name of the property in dom in snake case
* `converter` - if value need to be convertet after it read from dom or before it saved to dom, converter can be used
* `preview_converter` - sometimes for the preview we have different conversion logic as master format rendering that we want to apply, for this case we can specify preview converter
* `virtual` - if we don't want to read property, but vant to save, for instance when property is computed based on multiple values
* `persist` - if we want property to be read, but don't want it to be stored

complex_property and complex_attribute allows to specify custom reader component that will be used to read data for element. complex_property and complex_attribute can have converter and preview_converter.

```
<style_properties>
    <complex_property var="margins_and_padding" reader="Magento_PageBuilder/js/property/default/margins" converter="Magento_PageBuilder/js/converter/default/style/margins"/>
</style_properties>
```

static_property and static_attribute allows to add specified style property or attribute to the element. static_property and static_attribute don't have converter and preview_converter.

```
<element name="desktop_image" path=".//img[1]">
    <style_properties>
        <static_property name="max-width" value="100%"/>
        <static_property name="height" value="auto"/>
    </style_properties>
</element>
```

These style properties and attributes will be applied in preview and persisted in master format.

```
<img src="my-image.png" style="max-width: 100%; height: auto;" />
```

Html
`html` allows to read value of the element in a property and map back to master format.

If need to specify a label to use in preview when there is no input provided, `placeholder` attribute can be used.

```
<html var="message" placeholder="Edit banner text"/>
```

Css
`css` allows to read class value of the element in the property and map back to master format.

`filter` allows to specify static css classes to ignore, when used specified classes will not be read and appear on the form.

```
<css var="button_type">
    <filter>
        <class name="pagebuilder-banner-button"/>
    </filter>
</css>
```


## Converter Interfaces

There are two types of converter data converter and element converter.

element data converter converts data for the property or attribute. fromDom method called after data read from master format and toDom method called before observables updated in the cycle of rendering preview or master format.

```
export interface ElementConverterInterface {
    /**
     * @param {Object} value
     * @returns {string | Object}
     */
    fromDom(value: string): string | Object;

    /**
     * @param {Object} name
     * @param {Object} data
     * @returns {string | Object}
     */
    toDom(name: string, data: object): string | object;
}
```

data converter, works on the data for all elements. fromDom method called after data read for all elements and converted by elements converters. toDom called before data converted by element converters to update observables.

```
export interface DataConverterInterface {
    /**
     * @param {Object} data
     * @param {Object} config
     * @returns {Object}
     */
    fromDom(data: object, config: object): object;

    /**
     * @param {Object} data
     * @param {Object} config
     * @returns {Object}
     */
    toDom(data: object, config: object): object;
}
```

Example of configuration for data converter.

```
<data_mapping>
    <converters>
        <converter name="empty_mobile_image" component="Magento_PageBuilder/js/converter/default/empty-mobile-image">
            <config>
                <item name="desktop_image_variable" value="background_image"/>
                <item name="mobile_image_variable" value="mobile_image"/>
            </config>
        </converter>
    </converters>
</data_mapping> 
```

Some element converters can produce value based on multiple properties in data.

```
export default class OverlayBackgroundColor implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        return value;
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data: object): string | object {
        let overlayColor: string = "transparent";
        if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
            overlayColor = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
        }
        return overlayColor;
    }
}
```
