# How to Add New Content Type 

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

Adding new content type starts with [configuration](content-type-configuration.md).

To add configuration for a new content type, create a file under the following location `Vendor\ModuleName\view\adminhtml\pagebuilder\content_type\simple.xml` with the following content
``` XML
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Vendor_ModuleName:etc/content_type.xsd">
    <type name="simple"
          label="Simple"
          component="Vendor_ModuleName/js/content-type"
          form="modulename_simple_form"
          group="layout"
          icon="icon-modulename-simple"
          sortOrder="35"
          translate="label">
        <parents default_policy="deny">
            <parent name="row" policy="allow"/>
        </parents>
        <appearances>
            <appearance default="true"
                        name="default"
                        preview_template="Vendor_ModuleNameCustom/content-type/simple/default/preview"
                        render_template="Vendor_ModuleNameCustom/content-type/simple/default/master"
                        reader="Magento_PageBuilder/js/master-format/read/configurable">
                <elements>
                    <element name="main">
                        <style name="text_align" source="text_align"/>
                        <style name="border" source="border_style"/>
                        <style name="border_color" source="border_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/border-width"/>
                        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
                        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings"/>
                        <attribute name="name" source="data-role"/>
                        <css name="css_classes"/>
                    </element>
                </elements>
            </appearance>
        </appearances>
    </type>
</config>
```

In this example, content type has only one element in the template.

Let's create templates specified in the configuration. 

Optional: For template knockout bindings, you can use the original data-bind syntax, or utilize Magento custom Knockout.js bindings as seen in the template snippets below. `http://devdocs.magento.com/guides/v2.2/ui_comp_guide/concepts/knockout-bindings.html`

Preview template `app/code/Vendor/ModuleName/view/adminhtml/web/template/content-type/simple/default/preview.html`.

``` HTML
<div class="pagebuilder-content-type" event="{mouseover: onMouseOver, mouseout: onMouseOut}, mouseoverBubble: false">
    <div attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></div>
    <!-- Display context menu options for content type -->
    <render args="getOptions().template" />
</div>
```

And master template `app/code/Vendor/ModuleName/view/adminhtml/web/template/content-type/simple/default/master.html`.

``` HTML
<div attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></div>
```

In the `simple.xml` above we defined border attributes and form for component. Let's create form `Vendor/ModuleName/view/adminhtml/ui_component/modulename_simple_form.xml` which enables the user to modify these attributes from the admin.

``` XML
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd" extends="pagebuilder_base_form">
    <argument name="data" xsi:type="array">
        <item name="js_config" xsi:type="array">
            <item name="provider" xsi:type="string">modulename_simple_form.modulename_simple_form_data_source</item>
        </item>
        <item name="label" xsi:type="string" translate="true">Simple</item>
    </argument>
    <settings>
        <deps>
            <dep>modulename_simple_form.modulename_simple_form_data_source</dep>
        </deps>
        <namespace>modulename_simple_form</namespace>
    </settings>
    <dataSource name="modulename_simple_form_data_source">
        <argument name="data" xsi:type="array">
            <item name="js_config" xsi:type="array">
                <item name="component" xsi:type="string">Magento_PageBuilder/js/form/provider</item>
            </item>
        </argument>
        <dataProvider name="modulename_simple_form_data_source" class="Magento\PageBuilder\Model\ContentBlock\DataProvider">
            <settings>
                <requestFieldName/>
                <primaryFieldName/>
            </settings>
        </dataProvider>
    </dataSource>
    <fieldset name="appearance_fieldset" component="Magento_PageBuilder/js/form/element/dependent-fieldset">
        <settings>
            <label translate="true">Appearance</label>
            <collapsible>true</collapsible>
            <opened>true</opened>
            <imports>
                <link name="hideFieldset">${$.name}.appearance:options</link>
                <link name="hideLabel">${$.name}.appearance:options</link>
            </imports>
        </settings>
        <field name="appearance" sortOrder="10" formElement="select" component="Magento_PageBuilder/js/form/element/dependent-select">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="default" xsi:type="string">default</item>
                </item>
            </argument>
            <settings>
                <dataType>text</dataType>
                <label translate="true">Appearance</label>
                <validation>
                    <rule name="required-entry" xsi:type="boolean">true</rule>
                </validation>
            </settings>
            <formElements>
                <select>
                    <settings>
                        <options>
                            <option name="0" xsi:type="array">
                                <item name="value" xsi:type="string">default</item>
                                <item name="label" xsi:type="string" translate="true">Default</item>
                            </option>
                        </options>
                    </settings>
                </select>
            </formElements>
        </field>
    </fieldset>
    <fieldset name="advanced">
        <field name="margins_and_padding">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="default" xsi:type="string">{"margin":{"top":"","right":"","bottom":"","left":""},"padding":{"top":"","right":"","bottom":"","left":""}}</item>
                </item>
            </argument>
        </field>
    </fieldset>
</form>
```

Every form should have default appearance to allow other modules to add more appearances.

Attributes that we want to edit as part of the advanced section are defined in `pagebuilder_base_form`, so we can just extend it.

And to allow this form to be loaded in PageBuilder, let's create layout `Vendor/ModuleName/view/adminhtml/layout/pagebuildercustom_simple_form.xml`.

``` XML
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="admin-1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="modulename_simple_form"/>
        </referenceContainer>
    </body>
</page>
```

## Preview, PreviewCollection, Content, and ContentCollection

If your content type has custom preview logic, you need to specify `preview_component`, otherwise the default one `Magento_PageBuilder/js/content-type/preview` will be used.

If your content type can have other components as children, you need to extend `Magento_PageBuilder/js/content-type/preview-collection` component. Otherwice you need to extend `Magento_PageBuilder/js/content-type/preview`.

In the preview component you can add custom logic that will be available in the template. You can also do modifications to observables used in preview template if you override `afterObservablesUpdated` method. 

Let's add a button in the preview that would display `Hello World` on click.

``` js
define(["Magento_PageBuilder/js/content-type/preview"], function (Preview) {
    var Simple = function() {
        Preview.apply(this, arguments);
    };

    Simple.prototype = Object.create(Preview.prototype);
    Simple.prototype.constructor = Simple;

    /**
     * Alert Hello World
     */
    Simple.prototype.helloWorld = function() {
        alert("Hello World");
    };

    return Simple;
});
```

And the last part is to add button to a template.

``` HTML
<render args="getOptions().template" />
<button type="button" click="helloWorld" translate="'Display Hello World'"/>
```

Now, let's add content type that can contain other content types. Create configuration `Vendor\ModuleName\view\adminhtml\pagebuilder\content_type\complex.xml`.

``` XML
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <type name="complex"
          label="Complex"
          component="Magento_PageBuilder/js/content-type-collection"
          preview_component="Magento_PageBuilder/js/content-type/preview-collection"
          master_component="Magento_PageBuilder/js/content-type/content-collection"
          form="vendorname_complex_form"
          group="layout"
          icon="icon-vendorname-complex"
          sortOrder="35"
          translate="label">
        <children default_policy="deny">
            <child name="heading" policy="allow"/>
        </children>
        <appearances>
            <appearance default="true"
                        name="default"
                        preview_template="Vendor_ModuleName/content-type/complex/default/preview"
                        render_template="Vendor_ModuleName/content-type/complex/default/master"
                        reader="Magento_PageBuilder/js/master-format/read/configurable">
                <elements>
                    <element name="main">
                        <style name="text_align" source="text_align"/>
                        <style name="border" source="border_style"/>
                        <style name="border_color" source="border_color" converter="Magento_PageBuilder/js/converter/style/color"/>
                        <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/border-width"/>
                        <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
                        <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
                        <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings"/>
                        <attribute name="name" source="data-role"/>
                        <css name="css_classes"/>
                    </element>
                </elements>
            </appearance>
        </appearances>
    </type>
</config>
```

Now need to create preview and render templates.

`Vendor/ModuleName/view/adminhtml/web/template/content-type/complex/default/preview.html`

``` HTML
<div class="pagebuilder-content-type type-container pagebuilder-complex children-min-height" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" event="{mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
    <render args="getOptions().template" />
    <render args="previewChildTemplate" />
</div>
```

`Vendor/ModuleName/view/adminhtml/web/template/content-type/complex/default/master.html`
``` HTML
<div attr="data.main.attributes" ko-style="data.main.style" css="data.main.css">
    <render args="renderChildTemplate" />
</div>
```

Please also notice that we specified in configuration the following, to allow our content type accept other content types as children.

| Setting             | Value                                                       |
| ------------------- | ----------------------------------------------------------- |
| `component`         | Magento_PageBuilder/js/content-type-collection              |
| `preview_component` | Magento_PageBuilder/js/content-type/preview-collection      |
| `master_component`  | Magento_PageBuilder/js/content-type/content-collection      |

You can also specify `content_component` if you want to do modifications to observables used in master format templates.


## component, preview_component and content_component

`component` is structure element. If your content type can contain children use `Magento_PageBuilder/js/content-type-collection`, otherwise use `Magento_PageBuilder/js/content-type`. You may extend default `component` if you want to dispatch additional or subscribe to existing events.

`preview_component` contains preview logic that is generic for all appearances. If `preview_component` not specified, the default one `Magento_PageBuilder/js/content-type/preview` will be used. If your content type can have other components as children, you need to specify `Magento_PageBuilder/js/content-type/preview-collection`.

You can also do modifications to observables used in preview template if you override `afterObservablesUpdated` method. 

`content_component` contains master format rendering logic that is generic for all appearances. If `content_component` not specified, the default one `Magento_PageBuilder/js/content-type/content` will be used. If your content type can have other components as children, you need to specify `Magento_PageBuilder/js/content-type/content-collection`. If you need to do modifications to observables used in preview template if you override `afterObservablesUpdated` method.

## Config

Sometimes you need to have access to other content types configuration in your component or stage configuration. This configuration available via `Magento_PageBuilder/js/component/config`.

Config have the following methods

| Method                 | Description                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `setConfig`            | Method is used for initial initialization of the config, not expected to be used by developers. |
| `getConfig`            | Returns the whole configuration as object.                                                      |
| `getContentTypeConfig` | Retrieves configuration for specific content type.                                              |
