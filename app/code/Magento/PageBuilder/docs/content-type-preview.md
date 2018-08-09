# Render a backend content type preview

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
    1. [Use the inline text editing component]
    1. **Render a backend content type preview**
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
This topic describes how to use the `RenderPool` on the stage to render a backend [content type] preview. 

Using this method, you can preview content types that cannot be rendered on the stage and require further backend processing to be previewed.

The following steps utilize some example values; substitute those with values specific to your situation.

## Overview

To use the stage's `RenderPool` to produce a content type preview:
1. [Create a renderer](#create-a-renderer)
2. [Add the renderer to the pool](#add-the-renderer-to-the-pool)
3. [Submit an HTTP request to the preview controller](#submit-an-HTTP-request-to-the-preview-controller)
4. [Render the element](#render-the-element)

## Create a renderer

Create a renderer that implements the renderer interface, `Magento\PageBuilder\Model\Stage\RendererInterface`:

``` php
<?php
namespace Magento\PageBuilder\Model\Stage\Renderer;
     
class AwesomeElement implements \Magento\PageBuilder\Model\Stage\RendererInterface
{
    public function render(array $params): array
    {
        return ['message' => 'Hello stage! You said ' . $params['message'] . '!'];
    }
}
```

## Add the renderer to the pool

Add the renderer you just created as an argument to the `Magento\PageBuilder\Model\Stage\RendererPool` type that specifies your custom content type role as the name in the `di.xml` file:

``` xml
<type name="Magento\PageBuilder\Model\Stage\RendererPool">
    <arguments>
        <argument name="renderers" xsi:type="array">
            <item name="awesome-element" xsi:type="object">Magento\PageBuilder\Model\Stage\Renderer\AwesomeElement</item>
        </argument>
    </arguments>
</type>
```

## Submit an HTTP request to the preview controller

To invoke the renderer from the stage, submit an HTTP request to the PageBuilder preview controller:

1. Obtain the URL for the HTTP request from within your preview component by calling `getConfig("preview_url")` on the `Magento_PageBuilder/js/config` component.
2. Make a request to the aforementioned obtained URL specifying your custom content type name and any additional parameters you want to use to render the element:
    
    ``` javascript
        define([
            'jquery',
            'Magento_PageBuilder/js/content-type/preview',
            'Magento_PageBuilder/js/config'
        ], function ($, Preview, Config) {
            var AwesomeElement = function() {
                Preview.apply(this, arguments);
            };
         
            AwesomeElement.prototype = Object.create(Preview.prototype);
            AwesomeElement.prototype.constructor = AwesomeElement;
         
            AwesomeElement.prototype.afterObservablesUpdated = function() {
                Preview.prototype.afterObservablesUpdated.call(this);
                // Get the url to call
                var url = Config.getConfig("preview_url");
                const requestConfig = {
                    method: "GET",
                    data: {
                        role: this.config.name // this would be awesome-element in this case
                        // You can also pass any other data to the renderer
                        message: 'custom data!'
                    }
                };
         
                $.ajax(url, requestConfig).done(function(response) {
                    // Will display: "Hello stage! You said custom content!"
                    this.data.main.html(response.data.message);
                }.bind(this));
            };
         
            return AwesomeElement;
        });
    ```

## Render the element

Your exact configuration and situation determine when, and how, you render the element. 

Generally, you would perform this operation when the properties change, by overriding the `afterObservablesUpdated` method with this logic (as shown in the previous example).

To update the Document Object Model (DOM) to display your content, amend the JavaScript property that represents the HTML variable of your main element with the response from the HTTP request, `this.data.main.html(response.content);` from the previous example.


