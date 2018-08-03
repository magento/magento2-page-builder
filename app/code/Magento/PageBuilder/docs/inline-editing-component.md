# Use the inline editing component

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
    1. [How to add a new content type]
    1. [Events]
    1. [Bindings]
    1. [Master format]
    1. [Visual select] 
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Use the block chooser UI component]
    1. **Use the inline text editing component**
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

## What's in this topic
This topic describes how to add a reusable inline text editing text component to the PageBuilder stage for a content type.

## Overview

To add inline editing customization to PageBuilder:
1. [Add configuration for the inline editor](#add-configuration-for-the-inline-text-editor)
2. [Update the `<YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js` file](#update-the-yourmoduleviewadminhtmlwebjscontent-typecontent_type_namepreviewjs-file-js-file)
3. [Update the preview template to display the inline editor component](#update-the-preview-template-to-display-the-inline-text-editor-component)

## Add configuration for the inline text editor

To add configuration for the inline text editor:

1. Use `additional_data` in your `<YourModule>/view/base/pagebuilder/content_type/<content-type-name>.xml` XML config file to add the custom inline text editor configuration to a content type:

  ``` xml
  <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
     ...
         <additional_data>
             <item name="wysiwygConfig" xsi:type="array">
                 <item name="wysiwygConfigData" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Wysiwyg\Config</item>
                 <item name="parentSelectorsToUnderlay" xsi:type="array">
                     <item name="0" xsi:type="string">.column-container</item>
                     <item name="1" xsi:type="string">.row-container</item>
                 </item>
             </item>
         </additional_data>
     </type>
  </config>
  ```
2. Add your custom editor adapter class to the list of WYSIWYG adapters supporting inline text editing in the `di.xml` file:

  ``` xml 
    <type name="Magento\PageBuilder\Model\Wysiwyg\InlineEditingSupportedAdapterList">
        <arguments>
            <argument name="wysiwygAdaptersSupportingInlineEditing" xsi:type="array">
                <item name="mage/adminhtml/wysiwyg/tiny_mce/tinymce4Adapter" xsi:type="boolean">true</item>
            </argument>
        </arguments>
    </type>
```

## Update the <YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js file

To update the `<YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js` file:

1. Add the inline text editing component, `Magento_PageBuilder/js/content-type/text`, dependency:

``` js
import Wysiwyg from "../wysiwyg";
```

If you are creating a custom content type, however, use an existing content type that already implements a WYSIWYG as your template. `Magento_PageBuilder/js/content-type/text` can be used as a reference for injecting the required inline text editor dependency into your own custom content type:

``` js
/**
 * @param {HTMLElement} element
 */
public initWysiwyg(element: HTMLElement) {
    if (!Config.getConfig("can_use_inline_editing_on_stage")) {
        return;
    }
 
    this.element = element;
 
    element.id = this.parent.id + "-editor";
 
    this.wysiwyg = new Wysiwyg(
        this.parent.id,
        element.id,
        this.config.additional_data.wysiwygConfig.wysiwygConfigData,
        this.parent.dataStore,
    );
...
```

2. Add configuration for the inline text editor in the `<content-type-name>.xml` file.

## Update the preview template to display the inline text editor component

This is an optional step.

If you want to create your own custom template, you can update your custom preview template file to display the inline text editor component:

``` html
<div class="pagebuilder-content-type pagebuilder-text" event="{ mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
   <div class="inline-wysiwyg" ko-style="data.main.style" css="data.main.css" attr="data.main.attributes" afterRender="initWysiwyg">
       <div html="data.main.html"/>
   </div>
   <div class="placeholder-text" ifnot="data.main.html" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" translate="'Edit Text'"></div>
   <render args="getOptions().template" />
</div>
```
