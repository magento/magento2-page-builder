# Step 3: Add components (optional)

***
The development of this tutorial is currently **IN PROGRESS**.

***

In this step, we will create a preview component in order to customize the options menu for our Quote. The options menu is the popup menu that appears when you mouseover a content type, as shown here:

![Create config file](../images/options-menu-default.png)

The options menu provides end-users with several functions, including a button to open the content type's form editor, which we will add in [Step 4: Add form](step-4-add-form.md).

## About components

Components are JavaScript files that define the behaviors of your content type when they appear on the Admin stage (using the `preview.js` component) and in the storefront (using the `master.js` component). As such, they are complementary to the templates you added previously in Step 2, acting as the view models to the template's views. 

Adding custom component files to your content types is completely optional. Whether you need one or not will depend on the complexity of your content type. If you do not add components to your content type, Page Builder will use these defaults:

- Default preview component: `Magento_PageBuilder/js/content-type/preview`
- Default master component: `Magento_PageBuilder/js/content-type/master`

When you start developing more complex content types, you will need to create custom preview components in order to make these and other functions available on the Admin stage:

- Initiating and using additional 3rd party libraries like sliders and tabs.
- Adding image uploader support.
- Providing dynamic data into your preview templates from the back-end.
- Allowing the back-end to conduct rendering (such as our block and dynamic block content types).
- Declaring special states based on the data stored, for example, showing a disabled state when certain fields are set to specific values.

Examples of implementing these functions will be add to future tutorials and other topics in this documentation. 

Adding your own master component is far less common. The master component is only necessary if you want to manipulate the final output of your content type before it is persisted to the database.

## Component conventions

The conventions for naming your components and adding them to your module are as follows:

- Your preview component must be named `preview.js` and placed here in your module (`view/adminhtml/web/js/content-type/example-quote/`):

![Create config file](../images/step3-add-component.png)

- Your master component must be named `master.js` and placed here in your module (`view/frontend/web/js/content-type/example-quote/`):

  ![Create config file](../images/step3-add-master-component.png)

We will not create a master component for our Quote example, but the location is given here if you need to include one for more complex content types.

Before continuing, add the preview component file (`preview.js`) to your `PageBuilderQuote` module within the directory structure noted.

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

A description of each component-related attribute from the Quote configuration follows:

| Attribute           | Description                                                  |
| ------------------- | ------------------------------------------------------------ |