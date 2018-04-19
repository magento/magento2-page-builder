# How to Add New Content Type 

## Configuration

Adding new content type starts with [configuration](content-type-configuration.md).

To add configuration for a new content type, create a file under the following location `Vendor\ModuleName\etc\content_types\simple.xml` with the following content
``` XML
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Vendor_ModuleName:etc/content_types.xsd">
    <content_types>
        <type name="simple" sortOrder="35" translate="label">
            <label>Simple</label>
            <icon>icon-modulename-simple</icon>
            <component>Vendor_ModuleName/js/content-type</component>
            <form>modulename_simple_form</form>
            <group>general</group>
            <allowed_parents>
                <parent name="row"/>
            </allowed_parents>
            <appearances>
                <appearance default="true" name="default">
                    <data_mapping>
                        <elements>
                            <element name="main" path=".">
                                <style_properties>
                                    <property name="text_align" var="text_align"/>
                                    <property name="border_style" var="border"/>
                                    <property converter="Magento_PageBuilder/js/converter/default/style/color" name="border_color" var="border_color"/>
                                    <property converter="Magento_PageBuilder/js/converter/default/style/border-width" name="border_width" var="border_width"/>
                                    <property converter="Magento_PageBuilder/js/converter/default/style/remove-px" name="border_radius" var="border_radius"/>
                                    <complex_property converter="Magento_PageBuilder/js/converter/default/style/margins-and-paddings" reader="Magento_PageBuilder/js/property/default/margins-and-paddings" var="margins_and_padding"/>
                                </style_properties>
                                <attributes>
                                    <attribute name="data-role" var="name"/>
                                </attributes>
                                <css var="css_classes"/>
                            </element>
                        </elements>
                    </data_mapping>
                    <preview_template>Vendor_ModuleNameCustom/content-type/preview/simple.html</preview_template>
                    <render_template>Vendor_ModuleNameCustom/content-type/master/simple.html</render_template>
                    <reader>Magento_PageBuilder/js/component/format/read/configurable</reader>
                </appearance>
            </appearances>
        </type>
    </content_types>
</config>
```

In this example, content type has only one element in the template.

Let's create templates specified in the configuration. Preview template `app/code/Vendor/ModuleName/view/adminhtml/web/template/content-type/preview/simple.html`.

``` HTML
<div class="pagebuilder-content-type pagebuilder-entity pagebuilder-entity-preview" data-bind="event: {mouseover: onMouseOver, mouseout: onMouseOut}, mouseoverBubble: false" style="padding: 5px;">
    <div data-bind="attr: data.main.attributes, style: data.main.style, css: data.main.css, html: data.main.html"></div>
    <!-- ko template: getOptions().template --><!-- /ko -->
</div>
```

And master template `app/code/Vendor/ModuleName/view/adminhtml/web/template/content-type/master/simple.html`.

``` HTML
<div data-bind="attr: data.main.attributes, style: data.main.style, css: data.main.css, html: data.main.html"></div>
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
    <fieldset name="appearance" component="Magento_PageBuilder/js/form/element/dependent-fieldset">
        <settings>
            <label translate="true">Appearance</label>
            <collapsible>true</collapsible>
            <opened>true</opened>
            <imports>
                <link name="appearancesHidden">${$.name}.appearance:options</link>
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

Attributes that we want to edit part of advanced section that defined in `pagebuilder_base_form`, so we can just extend it.

And to allow this form to be loaded in PageBuilder, let's create layout `Vendoe/ModuleName/view/adminhtml/layout/pagebuildercustom_simple_form.xml`.

``` XML
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="admin-1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="modulename_simple_form"/>
        </referenceContainer>
    </body>
</page>```

## Preview, PreviewCollection, Content and ContentCollection

If your content type has custom preview logic, you need to specify `preview_component`, otherwise the default one `Magento_PageBuilder/js/preview` will be used.

If your content type can have other components as children, you need to extend `Magento_PageBuilder/js/preview-collection` component. Otherwice you need to extend `Magento_PageBuilder/js/preview`.

In the preview component you can add custom logic that will be available in the template. You can also do modifications to observables used in preview template if you override `afterObservablesUpdated` method. 

Let's add a button in the preview that would display `Hello World` on click.

``` JS
define(["Magento_PageBuilder/js/preview"], function (Preview) {
    var Simple = function() {
        Preview.apply(this, arguments);
    };

    Simple.prototype = Object.create(Preview.prototype);
    Simple.prototype.constructor = Custom;
    
    var super_ = Preview.prototype;

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
<!-- ko template: getOptions().template --><!-- /ko -->
<button type="button" click="helloWorld" translate="'Display Hello World'"/>
```

Now, let's add content type that can contain other content types. Create configuration `Vendor\ModuleName\etc\content_types\complex.xml`.

``` XML
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_types.xsd">
    <content_types>
        <type name="complex" sortOrder="35" translate="label">
            <label>Complex</label>
            <icon>icon-vendorname-complex</icon>
            <component>Magento_PageBuilder/js/content-type-collection</component>
            <preview_component>Magento_PageBuilder/js/preview-collection</preview_component>
            <content_component>Magento_PageBuilder/js/content-collection</content_component>
            <form>vendorname_complex_form</form>
            <group>general</group>
            <allowed_parents>
                <parent name="row"/>
                <parent name="column"/>
            </allowed_parents>
            <appearances>
                <appearance default="true" name="default">
                    <data_mapping>
                        <elements>
                            <element name="main" path=".">
                                <style_properties>
                                    <property name="text_align" var="text_align"/>
                                    <property name="border_style" var="border"/>
                                    <property converter="Magento_PageBuilder/js/converter/default/style/color" name="border_color" var="border_color"/>
                                    <property converter="Magento_PageBuilder/js/converter/default/style/border-width" name="border_width" var="border_width"/>
                                    <property converter="Magento_PageBuilder/js/converter/default/style/remove-px" name="border_radius" var="border_radius"/>
                                    <complex_property converter="Magento_PageBuilder/js/converter/default/style/margins-and-paddings" reader="Magento_PageBuilder/js/property/default/margins-and-paddings" var="margins_and_padding"/>
                                </style_properties>
                                <attributes>
                                    <attribute name="data-role" var="name"/>
                                </attributes>
                                <css var="css_classes"/>
                            </element>
                        </elements>
                    </data_mapping>
                    <preview_template>Vendor_ModuleName/content-type/preview/complex.html</preview_template>
                    <render_template>Vendor_ModuleName/content-type/master/complex.html</render_template>
                    <reader>Magento_PageBuilder/js/component/format/read/configurable</reader>
                </appearance>
            </appearances>
        </type>
    </content_types>
</config>
```

Now we need to specify which content types can be inserted into our new content type. To allow default content type Heading be inserted into our Complex content type, add the following configuration.

`Vendor\ModuleName\etc\content_types\heading.xml`

``` XML
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_types.xsd">
    <content_types>
        <type name="heading" sortOrder="30" translate="label">
            <allowed_parents>
                <parent name="complex"/>
            </allowed_parents>
        </type>
    </content_types>
</config>
```

Now need to create preview and render templates.

`Vendor/ModuleName/view/adminhtml/web/template/content-type/preview/complex.html`

``` HTML
<div class="pagebuilder-content-type type-container pagebuilder-complex children-min-height" data-bind="attr: data.main.attributes, style: data.main.style, css: data.main.css, event: {mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
    <!-- ko template: getOptions().template --><!-- /ko -->
    <!-- ko template: previewChildTemplate --><!-- /ko -->
</div>
```

`Vendor/ModuleName/view/adminhtml/web/template/content-type/master/complex.html`
``` HTML
<div data-bind="attr: data.main.attributes, style: data.main.style, css: data.main.css">
    <!-- ko template: renderChildTemplate --><!-- /ko -->
</div>
```

Please also notice that we specified in configuration the following, to allow our content type accept other content types as children.

| Setting             | Value                                          |
| ------------------- | ---------------------------------------------- |
| `component`         | Magento_PageBuilder/js/content-type-collection |
| `preview_component` | Magento_PageBuilder/js/preview-collection      |
| `content_component` | Magento_PageBuilder/js/content-collection      |

You can also specify `content_component` if you want to do modifications to observables used in master format templates.


## component, preview_component and content_component

`component` is structure element. If your content type can contain children use `Magento_PageBuilder/js/content-type-collection`, otherwise use `Magento_PageBuilder/js/content-type`. You may extend default `component` if you want to dispatch additional or subscribe to existing events.

`preview_component` contains preview logic that is generic for all appearances. If `preview_component` not specified, the default one `Magento_PageBuilder/js/preview` will be used. If your content type can have other components as children, you need to specify `Magento_PageBuilder/js/preview-collection`.

You can also do modifications to observables used in preview template if you override `afterObservablesUpdated` method. 

`content_component` contains master format rendering logic that is generic for all appearances. If `content_component` not specified, the default one `Magento_PageBuilder/js/content` will be used. If your content type can have other components as children, you need to specify `Magento_PageBuilder/js/content-collection`. If you need to do modifications to observables used in preview template if you override `afterObservablesUpdated` method.

## Config

Sometimes you need to have access to other content types configuration in your component or stage configuration. This configuration available via `Magento_PageBuilder/js/component/config`.

Config have the following methods

| Method                 | Description                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `setConfig`            | Method is used for initial initialization of the config, not expected to be used by developers. |
| `getConfig`            | Returns the whole configuration as object.                                                      |
| `getContentTypeConfig` | Retrieves configuration for specific content type.                                              |
