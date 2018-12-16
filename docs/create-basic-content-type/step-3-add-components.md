# Step 3: Add components (optional)

***
The development of this tutorial is currently **IN PROGRESS**.

***

Components are the JavaScript files that define the behaviors of your content type when they appear on the stage in the Admin UI (using the `preview.js` component) and in the storefront (using the `master.js` component). As such, they are complementary to the templates you added previously in Step 2, acting as the view models to the template's views. 

These component files are completely optional. Among the reasons for adding your own component is to customize the options menu in the Admin preview. That's what we will do for our Quote content type.

## Add component directories

The directory structure for your Quote components should look like this (`view/adminhtml/web/js/content-type/example-quote/`):

![Create config file](../images/step3-add-component.png)

  

## Component configuration

In your configuration file, reference your Admin `preview_component` (`preview.js`) as shown here:

```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
  <type name="example_quote"
        label="Quote"
        component="Magento_PageBuilder/js/content-type"
        preview_component="Example_PageBuilderQuote/js/content-type/example_quote/preview"
        master_component="Magento_PageBuilder/js/content-type/master">
        ...
  </type>
</config>
```

The following table describes each component-related attribute from the Quote configuration.

| Attribute           | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `component`         | There are two component types to choose from: `content-type` and `content-type-collection`. Use `Magento_PageBuilder/js/content-type` for static content types that do not have children (like our Quote). Use `Magento_PageBuilder/js/content-type-collection` for content types that can contain children (container content types). |
| `preview_component` | Optional. The `preview.js` file provides rendering logic to the Admin preview template. If your content type does not require any changes to the standard option menu (shown on mouseover) for a content type or other user-interactivity in the Admin, you can omit this attribute from the the `type` element. When you omit the attribute, Page Builder will use `Magento_PageBuilder/js/content-type/preview` by default. |
| `master_component`  | Optional. The `master.js` file provides rendering logic to the master format storefront template. As with the `preview_component`, if your content type does not require any specific user-interactivity or other behavior when it's displayed in the storefront, you can simply omit this attribute from the the `type` element. When you omit the attribute, Page Builder will use `Magento_PageBuilder/js/content-type/master` by default. <br /><br />In the Quote configuration, the `master_component` attribute is only included for discussion. It simply points to the Page Builder default `master.js` component that would be used the attribute was omitted. |

## Create preview.js component



```js
define([
    'Magento_PageBuilder/js/content-type/preview',
], function (PreviewBase) {
    'use strict';
    var $super;

    function Preview(parent, config, stageId) {
        PreviewBase.call(this, parent, config, stageId);
    }
    Preview.prototype = Object.create(PreviewBase.prototype);
    $super = PreviewBase.prototype;

    Preview.prototype.retrieveOptions = function retrieveOptions() {
        var options = $super.retrieveOptions.call(this, arguments);
        console.log(options);

        // Remove menu options
        // delete options.move;
        // delete options.duplicate;
        // delete options.edit;
        // delete options.remove;

        // options.edit.preview.config.icon = "<i class='icon-pagebuilder-copy'></i>";
        // options.edit.config.icon = "<i class='icon-pagebuilder-copy'></i>";
        // options.edit.icon._latestValue = "<i class='icon-pagebuilder-copy'></i>";

        // Change option menu icons
        // options.edit.icon = "<i class='icon-pagebuilder-copy'></i>";

        // Change option menu label
       // options.title.preview.config.label = "title.preview.config.label"; // works
        // options.title.title = "title.title"; // doesn't work

        // Change tooltips
        options.move.title = "Drag";
        options.duplicate.title = "Copy";
        options.remove.title = "Delete";
        options.edit.title = "Open Editor";

        return options;
    };
    //
    // Preview.prototype.isContainer = function () {
    //     return false;
    // };

    return Preview;
});
```

