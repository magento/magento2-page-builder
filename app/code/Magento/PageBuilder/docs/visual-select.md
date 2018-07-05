# Visual Select

## Navigation

1. [Introduction]
2. [Installation guide]
3. [Contribution guide]
4. [Developer documentation]
    1. [Architecture overview]
    1. [BlueFoot to PageBuilder data migration]
    1. [Third-party content type migration]
    1. [Iconography]
    1. [Module integration]
    1. [Additional data configuration]
    1. [Content type configuration]
    1. [How to add a new content type]
    1. [Events]
    1. [Bindings]
    1. [Master format]
    1. **Visual select**
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Custom Toolbar]
    1. [Add image uploader to content type]
    1. [Full width page layouts]
5. [Roadmap and known issues]

[Introduction]: README.md
[Installation Guide]: install.md
[Contribution guide]: CONTRIBUTING.md
[Developer documentation]: developer-documentation.md
[Architecture overview]: architecture-overview.md
[BlueFoot to PageBuilder data migration]: bluefoot-data-migration.md
[Third-party content type migration]: new-content-type-example.md
[Iconography]: iconography.md
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
[Custom Toolbar]: toolbar.md
[Full width page layouts]: full-width-page-layouts.md
[Add image uploader to content type]: image-uploader.md
[Roadmap and Known Issues]: roadmap.md

## What's in this topic
This topic describes how to extend some Page Builder fields to accommodate a custom look and feel for the text alignment option.

The text alignment field for each content block, in the Advanced section, now shows an icon and title. You can customize the text alignment field to show this new look and feel for all content blocks.

All image formats are supported for icons, though we suggest using an SVG format.

## Overview

To add Visual Select customization to a Page Builder content block:
1. [Override the select component with an element template](#element-template)
2. [Add Visual Select to the XML config](#xml-config)

## Override the select component with an element template {#element-template}

We use the default select component in the `/app/code/Magento/PageBuilder/view/adminhtml/ui-component/pagebuilder_base_form.xml` file. You can override the default template, specifying an element template for this functionality, to implement the Visual Select option.

In the provided template, specify `<elementTmpl>`:

``` xml
<field name="text_align" sortOrder="10" formElement="select">
    <settings>
        <dataType>text</dataType>
        <label translate="true">Alignment</label>
        <elementTmpl>Magento_PageBuilder/form/element/align</elementTmpl>
    </settings>
```

## Add Visual Select to the XML config {#xml-config}

The available options for select, `value`, `title`, and `icon`, can be provided by the PHP class that implements the `\Magento\Framework\Option\ArrayInterface` method. 

Options should return an array with the following format:

``` php
[
    value => "value", //key used in the component dataSource
    title => "Title",
    icon => "path/to/picture/on/server"
]
```

These new configuration values are used in the `align.html` template file stored in Page Builder's `app/code/Magento/Pagebuilder/view/adminhtml/web/template/form/element` directory.

Use a virtual type of `Magento\PageBuilder\Model\Source\VisualSelect` in your module's `di.xml` configuration file to define the options in a visual select field.

``` xml
<virtualType name="AlignmentSource" type="Magento\PageBuilder\Model\Source\VisualSelect">
       <arguments>
           <argument name="optionsSize" xsi:type="string">small</argument>
           <argument name="optionsData" xsi:type="array">
               <item name="0" xsi:type="array">
                   <item name="value" xsi:type="string"/>
                   <item name="title" xsi:type="string" translate="true">Default</item>
               </item>
               <item name="1" xsi:type="array">
                   <item name="value" xsi:type="string">left</item>
                   <item name="title" xsi:type="string" translate="true">Left</item>
                   <item name="icon" xsi:type="string">Magento_PageBuilder/css/images/form/element/visual-select/alignment/left.svg</item>
               </item>
               <item name="2" xsi:type="array">
                   <item name="value" xsi:type="string">center</item>
                   <item name="title" xsi:type="string" translate="true">Center</item>
                   <item name="icon" xsi:type="string">Magento_PageBuilder/css/images/form/element/visual-select/alignment/center.svg</item>
               </item>
               <item name="3" xsi:type="array">
                   <item name="value" xsi:type="string">right</item>
                   <item name="title" xsi:type="string" translate="true">Right</item>
                   <item name="icon" xsi:type="string">Magento_PageBuilder/css/images/form/element/visual-select/alignment/right.svg</item>
               </item>
           </argument>
       </arguments>
   </virtualType>
```
