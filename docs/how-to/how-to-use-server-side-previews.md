# How to use server-side previews

## What's in this topic

This topic describes how to use the `RenderPool` on the stage to render a backend [content type] preview. 

Using this method, you can preview content types that cannot be rendered on the stage and require further backend processing to be previewed.

The following steps utilize some example values. Substitute those with values specific to your situation.

## Step 1: Create a renderer

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

## Step 2: Add the renderer to the pool

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

## Step 3: Submit an HTTP request to the preview controller

To invoke the renderer from the stage, submit an HTTP request to the Page Builder preview controller:

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

## Step 4: Render the element

Your exact configuration and situation determine when, and how, you render the element. 

Generally, you would perform this operation when the properties change, by overriding the `afterObservablesUpdated` method with this logic (as shown in the previous example).

To update the Document Object Model (DOM) to display your content, amend the JavaScript property that represents the HTML variable of your main element with the response from the HTTP request, `this.data.main.html(response.content);` from the previous example.
