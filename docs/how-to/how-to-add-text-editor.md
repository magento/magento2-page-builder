# How to add a text editor

## What's in this topic

This topic describes how to add a reusable inline text editing component to the Page Builder stage for a content type.

## Add configuration for the inline text editor

To add configuration for the inline text editor:

1. Use `additional_data` in your `<YourModule>/view/base/pagebuilder/content_type/<content-type-name>.xml` XML config file to add the custom inline text editor configuration to a content type:

  ``` xml
  <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
     ...
         <additional_data>
             <item name="wysiwygConfig" xsi:type="array">
                 <item name="wysiwygConfigData" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Wysiwyg\Config</item>
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

## Update the `<YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js` file

To update the `<YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js` file:

1. Add the inline text editing component, `Magento_PageBuilder/js/content-type/text`, dependency:

``` js
define([
"Magento_PageBuilder/js/config",
"Magento_PageBuilder/js/content-type/preview",
"Magento_PageBuilder/js/wysiwyg/factory"
], function (_config, _preview, _factory) { ...
```

If you are creating a custom content type, however, use an existing content type that already implements a WYSIWYG as your template. `Magento_PageBuilder/js/content-type/text` can be used as a reference for injecting the required inline text editor dependency into your own custom content type via `Magento_PageBuilder/js/wysiwyg/factory`:

``` js
initWysiwyg: function (element) {
    var self = this;
    this.element = element;
    element.id = this.parent.id + '-editor';
    factory(
        this.parent.id,
        element.id,
        this.config.name,
        this.config.additional_data.wysiwygConfig.wysiwygConfigData,
        this.parent.dataStore,
        'content'
    ).then(function (wysiwyg) {
        self.wysiwyg = wysiwyg;
    });
}
```

2. Add configuration for the inline text editor in the `<content-type-name>.xml` file.

## Update the preview template to display the inline text editor component

This is an optional step.

If you want to create your own custom template, you can update your custom preview template file to display the inline text editor component:

``` html
<div class="pagebuilder-content-type pagebuilder-text" event="{ mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
    <div if="isWysiwygSupported()" class="inline-wysiwyg" ko-style="data.main.style" css="data.main.css" attr="data.main.attributes" afterRender="initWysiwyg">
        <div html="data.main.html" />
    </div>
    <div if="isWysiwygSupported()" class="placeholder-text" ifnot="data.main.html" translate="'Edit Text'"></div>
   <div ifnot="isWysiwygSupported()">
        <textarea
            class="inline-wysiwyg-textarea"
            afterRender="initTextarea"
            event="{keyup: onTextareaKeyUp, focus: onTextareaFocus, blur: onTextareaBlur}"
            data-bind="attr: { placeholder: $t('Edit Text') }" />
    </div>
    <render args="getOptions().template" />
</div>
```

## Extend the component

You can override the default inline text editor component with your own component by adding relevant configuration to the `di.xml` file.

To extend the inline text editor component:

1. Add configuration to the `di.xml` file for your component type preview:

    ``` xml
    <type name="Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Wysiwyg\Config">
        <arguments>
            <argument name="editors" xsi:type="array">
                <item name="mage/adminhtml/wysiwyg/tiny_mce/tinymce4Adapter" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_PageBuilder/js/wysiwyg/tinymce4</item>
                    <item name="component_initializers" xsi:type="array">
                        <item name="text" xsi:type="string">Magento_PageBuilder/js/content-type/text/wysiwyg/tinymce4/component-initializer</item>
                    </item>
                    <item name="config_modifiers" xsi:type="array">
                        <item name="text" xsi:type="string">Magento_PageBuilder/js/content-type/text/wysiwyg/tinymce4/config-modifier</item>
                    </item>
                    <item name="mode" xsi:type="string">inline</item>
                    <item name="minToolbarWidth" xsi:type="number">360</item>
                    <item name="parentSelectorsToUnderlay" xsi:type="array">
                        <item name="0" xsi:type="string">.column-container</item>
                        <item name="1" xsi:type="string">.row-container</item>
                    </item>
                </item>
            </argument>
        </arguments>
    </type>
    ```

2. Specify the name of a preferred editor, as noted in the system configuration path `cms/wysiwyg/editor`.

    This configuration can be specified for every editor that is supported for display on the inline editing mode on the stage. `factory` then returns the WYSIWYG instance referenced in your current Magento configuration.

3. Specify the `component_initializers`, per content type, where the inline text editor component will be used. Within this configuration, you can extend the existing event logic:

    ``` javascript
    initialize: function(wysiwyg) {
        var tinymce = wysiwyg.getAdapter();
        this.element = $("#" + wysiwyg.elementId);
        this.config = wysiwyg.config;
        tinymce.eventBus.attachEventHandler('afterFocus', this.onFocus.bind(this));
        tinymce.eventBus.attachEventHandler('afterBlur', this.onBlur.bind(this));
    };
    ...
     onFocus: function () {
      //implement your logic here
     };
    ...
    ```
    The following events can be extended for the default TinyMCE4 editor:
    - `onFocus`
    - `onBlur`
    - `afterChangeContent`

4. Specify the list of modifers, `config_modifiers`, that can update the WYSIWYG configuration before the component is initialized. These configuration keys can also be used to update the default WYSIWYG editor (TinyMCE4).
5. Specify the `mode` in which TinyMCE4 will be rendered on the stage.
6. Specify the `minToolbarWidth` to limit the width of TinyMCE4. If a component is used with a content type configured to a small width, this will limit the width to match.
7. Specify the `parentSelectorsToUnderlay` for TinyMCE4 to utilize an array of selectors for applying the z-index, which will prevent the toolbar from overlaying content type elements.