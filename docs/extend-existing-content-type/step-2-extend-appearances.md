# Step 2: Extend appearances

In this step, you will extend two of the four Banner appearances (`collage-left` and `collage-right`) by adding a new `max_height` property to each. This property stops the Banner from growing beyond a certain height as end-users enter text.

## Create a content configuration file

Appearances are defined in a content type's configuration file. As previously mentioned, the Banner's appearances are defined within the `banner.xml` file, as shown collapsed here:

```xml
<appearances>
    <appearance name="collage-left"...>
    <appearance name="collage-centered"...>
    <appearance name="collage-right"...>
    <appearance name="poster" default="true" ...>
</appearances>
```

Because we are extending the Banner, we start by creating a new configuration file called `banner.xml`.  Giving our extension configuration file the same name as the Banner's config file ensures that Magento will merge our appearance extensions with the Banner's existing configuration. Your file structure for the `banner.xml` extension should look like this:

![Extension config file structure](../images/appearance-extension-config-file.png){:width="511px" height="auto"}

## Add the appearances you want to extend

We are only extending two Banner appearances, which means we only need to define two `appearance` elements in the config file, as shown here:

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_types.xsd">
    <type name="banner">
        <appearances>
            <appearance name="collage-left">
                <elements>
                    <element name="wrapper">
                        <style name="max_height" source="max_height" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                    </element>
                </elements>
                <form>pagebuilder_banner_collage_left_form</form>
            </appearance>
            <appearance name="collage-right">
                <elements>
                    <element name="wrapper">
                        <style name="max_height" source="max_height" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                    </element>
                </elements>
                <form>pagebuilder_banner_collage_right_form</form>
            </appearance>
        </appearances>
    </type>
</config>
```

The following table describes the elements in our extension configuration.

| Element       | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `type`        | The type `name` defines the name of the content type. Make sure you name this configuration `banner` so that Magento will merge this configuration with the Banner's configuration. |
| `appearances` | The grouping element that specifies one or more `appearance` elements. |
| `appearance`  | The appearance `name` that Magento uses for XML merging. Again, make sure you  use the same appearance names as the Banner so that Magento can merge your appearance extensions with the Banner appearances you want to modify. |
| `elements`    | The grouping element that specifies one or more `element` nodes. |
| `element`     | The element maps styles and other appearance extensions from the form editor to the HTML templates that render content on the Admin stage and storefront. We want our appearance styles to map to the `wrapper` element of the Banner's templates, so the element for each appearance extension is named `wrapper`. |
| `style`       | The `style` element configures the bindings from the form field to the template elements. In this case, our style is applied to the `wrapper` element of the template. The style `name` represents the CSS `max-height` style. The `source` is the name of the form field you want the style bound to. Hint: The field name added in step 3 is `max-height`. |
| `form`        | Each appearance can use a different form to merge with or overwrite the Banner's form. You will create the form in step 3. |

{:style="table-layout:auto"}

## Next

[Step 3: Extend forms](step-3-extend-forms.md) 

