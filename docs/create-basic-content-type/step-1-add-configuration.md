<!-- {% raw %} -->

# Step 1: Add configuration

The configuration file gives your content type its existence. It's where you set the name, display label, and references to the other files that define the appearance and behavior of your content type. Add it to your module here (`view/adminhtml/pagebuilder/content_type/`):

![Create config file](../images/step1-add-config-file.png)

The file name should reflect the name of your content type. Use underscores to separate multi-word names as needed. 

## Example

{: .bs-callout .bs-callout-info }
Only a subset of configuration elements are described in this example (enough to understand the configuration file's role within a content type). For more details, refer to [Main configurations](../configurations/content-type-configuration.md) and [Additional configurations](../configurations/additional-configurations.md).


The following configuration shows the minimal requirements for defining a content type called `example`. The `example` content type is nearly identical to the built-in `heading` content type in order to help you learn the fundamental parts of a content type as seen in the configuration file here. An overview of these elements and attributes are described in the tables that follow.

``` xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
  <type name="example"
        label="Example"
        group="elements"
        component="Magento_PageBuilder/js/content-type"
        preview_component="Vendor_Module/js/content-type/example/preview"
        master_component="Magento_PageBuilder/js/content-type/master"
        form="pagebuilder_example_form"
        icon="icon-pagebuilder-heading"
        sortOrder="21"
        translate="label">
    <children default_policy="deny"/>
    <appearances>
      <appearance name="default"
                  default="true"
                  preview_template="Vendor_Module/content-type/example/default/preview"
                  render_template="Vendor_Module/content-type/example/default/master"
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
            <attribute name="name" source="data-role"/>
            <attribute name="appearance" source="data-appearance"/>
            <tag name="example_type"/>
            <html name="example_text" converter="Magento_PageBuilder/js/converter/html/tag-escaper"/>
            <css name="css_classes"/>
          </element>
        </elements>
      </appearance>
    </appearances>
  </type>
</config>
```

## The `type` node

The `<type>` node defines the key properties of your content type. The attributes are described here:

| Attribute         | Description                                                  |
| :---------------- | ------------------------------------------------------------ |
| name              | Name of the content type that Magento uses for XML merging. The convention for using multi-word names is to separate the words with hyphens. |
| label             | Label displayed in the Page Builder panel, option menu, and on the Admin stage. |
| group             | Group or category in the panel menu where your content type is displayed. The default groups are Layout, Elements, Media, and Add Content. See [Panel configurations](../configurations/panel-configurations.md) for more details. |
| component         | Currently there are two component types to choose from: `content-type` and `content-type-collection`. Use `Magento_PageBuilder/js/content-type` for static content types that do not have children. Use `Magento_PageBuilder/js/content-type-collection` for content types that can contain children, otherwise known as container content types. |
| preview_component | JavaScript file that provides preview-specific rendering logic within the Admin UI. |
| master_component  | JavaScript file that provides master format rendering logic generic for all appearances of your content type when rendered on the storefront. |
| form              | UI component form that provides the editor for your content type. |
| icon              | Optional. PNG or SVG image displayed in the Page Builder panel alongside the label. |
| is_hideable       | Optional. Default `true`. Include it only when you want to set it to `false` to prevent the end-user from hiding your  content type on demand, using a button (eye icon) in the options menu. A setting of false will remove the hide button from the options menu. |
| translate         | Identifies the attribute you want Magento to translate. Here, the `label` value is set for translation. |
{:style="table-layout:auto"}

## The `appearance` node

The purpose of the `<appearance>` node in a configuration is to define how your content type appears when it is dragged on the stage in the in the Admin UI (using the`preview.html` template) and when it's displayed in the storefront for customers (using the `master.html` template).

The `<appearance>` attributes are described as follows:

| Attribute        | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| name             | Name of the appearance for extending as needed.              |
| default          | Content types must specify one of the appearances as the default appearance. That means if you only have one appearance, it must be set as the default. |
| preview_template | `preview.html` - the HTML template for rendering the preview appearance of a content type within the Admin. |
| render_template  | `master.html` - the HTML template for rendering the storefront appearance of a content type for customers. |
| reader           | Reads data for the content type from the master format       |
{:style="table-layout:auto"}

All content types must have at least one `<appearance>` defined within the `<appearances>` node.

## The `elements` node

The purpose of `<elements>` node in the configuration is to map the data from the editor to the content type's master format so that the values entered in the editor can be stored and rendered correctly within both the Admin preview and the storefront. These nodes will be explained more fully in Step 4: Add editor.

## Next

At this point, if you try to view Page Builder you get an error noting that the `preview_template` and `render_template` from the `<appearance>` element are missing. These templates are referenced in the `example.xml` config file, but we have not yet created them. Let's do that next in [Step 2: Add templates](step-2-add-templates.md).

<!-- {% endraw %} -->