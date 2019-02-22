# Architecture

## What is Page Builder

PageBuilder is a tool that simplifies content creation by letting you drag-and-drop content types and configure them without writing a line of code.
Changes appear in real time in the preview area in the Admin and matches what users see on the storefront.

## Technologies

We wrote PageBuilder in [TypeScript], a superset of JavaScript. Before each release, we transpile the TypeScript to JavaScript.
Use the TypeScript components in the module as a reference to understand the flow of information.

**Note:**
*You need not use TypeScript in your module to work with the PageBuilder code.*

PageBuilder also uses core Magento technologies such as jQuery, Knockout, and UI Components, along with additional libraries to help with various content types shipped with the module.

## Storage format

**[Can you add a definition and explain what the master format is? The first sentence below is not clear.]**

PageBuilder uses XHTML with inline styles and data attributes for storage and as the master format.
This allows Page Builder to display content with minimum changes to the Magento storefront and other third-party systems.
Use the following steps to display PageBuilder content on a Magento storefront or third-party system:
<!-- {% raw %} -->

1. Replace all Magento directives such as `{{image url=path/to/image.png}}`
2. Add custom stylesheet to provide the base styles that the user can't edit. This includes styles for the content types, such as the `slider` and the `tabs`.
3. After the content renders, load and initialize the widgets and libraries on the frontend that need initialization, such as the `slider` and the `tabs`.
<!-- {% endraw %} -->

## Integration with Magento and custom modules

**[This seems very relevant to our current issues with PB compatibility. Can you provide more detailed info on this topic?]**

When you activate PageBuilder, it replaces all WYSIWYG instances by intercepting the WYSIWYG UI Component field and replacing the traditional WYSIWYG editor with the PageBuilder editor.
This means that you need to write any custom extension that uses the WYSIWYG field UI Component to support the PageBuilder editor.
You can revert to using the default WYSIWYG again by adding the following entry to the field configuration in the XML configuration file:

```
<item name="wysiwygConfigData" xsi:type="array">
    <item name="is_pagebuilder_enabled" xsi:type="boolean">false</item>
</item>
```

## Big picture

![Page Builder big picture](../../../images/big-picture.png)

| Entity            | Name in configuration | Description                                                  |
| ----------------- | --------------------- | ------------------------------------------------------------ |
| Content type      | `component`           | View model responsible for rendering the preview and master format |
| Preview component | `preview_component`   | Contains preview specific logic generic for all appearances. Preview component is optional |
| Master component  | `content_component`   | Contains master format rendering logic generic for all appearances. Content component is optional |
| Data Store        |                       | Contains data for the content type                           |
| Appearance        | `appearance`          | Configuration for content type that defines look and behavior. Includes data mapping, form, templates, reader. |
| Preview template  | `preview_template`    | Template used to display the element in the preview          |
| Master template   | `master_template`     | Template used to render the content type to the master format |
| Form              | `form`                | Form used to edit attributes of the content type             |
| Reader            | `reader`              | Reads data for the content type from the master format       |

## Data flow

![Page Builder data flow](../../../images/data-flow.png)
The following is a simple overview of the data flow:

1. Page Builder's reader (`Magento_PageBuilder/js/master-format/read/configurable`) reads the data.
2. Page Builder's element converters convert the data for each element (`border`, `border_color`, `border_width` etc) to an internal format.
3. Page Builder's mass converters convert the data. For more details see [converter interface](../configurations/content-type-configuration.md).
4. Page Builder creates its content types and populates the `Magento_PageBuilder/js/data-store` with data.
5. End-users modify the data in the data store within the form editor or when using `live-edit` on the stage.
6. Page Builder converts the data using mass converters.
7. Page Builder converts the data using element data converters.
8. Page Builder updates the preview and master component observables.
9. When the end-user saves the page's master format into the database, Page Builder updates the editable entity attribute.

### Mass converter

A Mass converter changes data for all content type elements.
For example, the content type for two elements, main and image, has data stored in the fields `border`, `border_color`, `border_width`, `background_image`.
A mass converter allows you to change all these fields.

**[Can you provide a small snippet of code that shows briefly what using a mass converter looks like within a content type.]**

For more information, read about how Page Builder [stores data](#datastore). 

### Element converter

An element converter changes a single field at a time.

## Datastore

Page Builder stores data for content types in a simple object called the DataStore: `Magento_PageBuilder/js/data-store`.



**[Can you provide more information to the paragraph below needs more explanation. I'm not sure what significance the parameter `var` has. It was just mentioned but it needs more info on its use and significance]**

The parameter `var` from [content type configuration](../configurations/content-type-configuration.md) is the name of a parameter in the DataStore.
You can use the `subscribe` method to listen for changes in the DataStore and perform custom actions on the data.

## Content type configuration

Please see [content type configuration](../configurations/content-type-configuration.md) for more information.

## Appearances

Appearances allow you to customize existing content types as follows:

1. Add new style properties to existing content types.
2. Add new attributes to existing content types. This is similar to adding new style properties.
3. Change templates.
4. Move data between elements, by data-mapping within the content type's configuration file.
   For example, a developer can move the `margin` style property from one element to another.
5. Change the form for a [content type].

## Module structure

| File type               | Location                                                     |
| ----------------------- | ------------------------------------------------------------ |
| Content type components | `Vendor/ModuleName/view/adminhtml/web/js/content-type/content-type-name` |
| Content type templates  | `Vendor/ModuleName/view/adminhtml/web/template/content-type/content-type-name/appearance-name` |
| Styles                  | `Vendor/ModuleName/view/adminhtml/web/css/source/content-type/content-type-name` |



**[Is the note below still relevant?]**

**Note:**
*We also considered introducing appearance component and/or moving the initialization of the libraries to bindings. This would allow you to add custom logic per appearance changes and libraries per appearance for content types like the `slider` and the `tabs`.

[TypeScript]: https://www.typescriptlang.org/
