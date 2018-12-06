# Architecture

## What is PageBuilder

PageBuilder is tool that simplifies content creation by letting you drag and drop content types and configure them without writing a line of code.
Changes appear in real time in the preview area in the Admin and matches what users see on the storefront.

## Technologies

PageBuilder is written in [TypeScript], a superset of JavaScript, that is compiled down to JavaScript prior to a release.
Use the TypeScript components in the module as reference to understand the flow information.

**Note:**
*You do not need to use TypeScript in your module to work with the PageBuilder code.*

PageBuilder also uses core Magento technologies such as jQuery, Knockout & UI Components.
It also uses additional libraries to help with various content types shipped with the module.

## Storage format

PageBuilder uses XHTML with inline styles and data attributes for storage and as the [master format].
This allows the content to be displayed with minimum changes to the Magento storefront and other third-party systems.

To display Page Builder content on storefront Magento and third party systems need to do the following

Use the following steps to display PageBuilder content on a Magento storefront or third-party system:

1. Replace all Magento directives such as `{{image url=path/to/image.png}}`
2. Add custom stylesheet to provide the base styles that user can't edit.
   This includes styles for the content types such as `slider`, `tabs`, etc.
3. After the content renders, load and initialize the widgets and libraries on the frontend that need initialization, such as slider, tabs, etc.

## Integration with Magento and custom modules

When PageBuilder is enabled in the system configuration, it replaces all WYSIWYG instances.
It does this by intercepting the WYSIWYG UI Component field and replacing the traditional WYSIWYG editor with the PageBuilder editor.

This means that any custom extension that utilizes the WYSIWYG field UI Component automatically supports the PageBuilder editor.

To revert back to using the default WYSIWYG, add the following entry to the field configuration in the XML configuration file:

```
<item name="wysiwygConfigData" xsi:type="array">
    <item name="is_pagebuilder_enabled" xsi:type="boolean">false</item>
</item>
```

## Big picture

![Page Builder big picture](../images/big-picture.png)

| Entity            | Name in configuration | Description                                                                                                    |
| ----------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Content type      | `component`           | View model responsible for rendering the preview and master format                                             |
| Preview component | `preview_component`   | Contains preview specific logic that is generic for all appearances. Preview component is optional             |
| Master component  | `content_component`   | Contains master format rendering logic that is generic for all appearances. Content component is optional      |
| Data Store        |                       | Contains data for the content type                                                                             |
| Appearance        | `appearance`          | Configuration for content type that defines look and behavior. Includes data mapping, form, templates, reader. |
| Preview template  | `preview_template`    | Template used to display the element in the preview                                                            |
| Master template   | `master_template`     | Template used to render the content type to the master format                                                  |
| Form              | `form`                | Form that will be used to edit content type                                                                    |
| Reader            | `reader`              | Reads data for the content type from the master format                                                         |

## Data flow

![Page Builder data flow](../images/data-flow.png)

The following is a simple overview of the data flow:

1. Data is read by reader `Magento_PageBuilder/js/master-format/read/configurable`.
2. Data for each element (`border`, `border_color`, `border_width` etc) is converted to an internal format by element converters.
3. Data is converted by mass converters. For more details see [converter interface](../configurations/content-type-configuration.md).
4. Content type is created and `Magento_PageBuilder/js/data-store` is populated with data.
5. Data in the data store is modified in the form or using live edit.
6. Data is converted by mass converters.
7. It is then converted by element data converters.
8. The preview and master component observables are updated.
9. When the user saves the page's master format into the database, the editable with the PageBuilder entity attribute is updated.

### Mass converter

A Mass converter modifies data for all content type elements.
For example, the content type of two elements, main and image has data stored in the fields `border`, `border_color`, `border_width`, `background_image`.
A mass converter allows you to modify all these fields.

For more information, read about how [data is stored internally](#Data store). 

### Element converter

An element converter modifies a single field at a time.

## Data store

Data for content types are stored in a simple object called the DataStore `Magento_PageBuilder/js/data-store`.

`var` from [content type configuration](../configurations/content-type-configuration.md) is the name of a parameter in the DataStore.

You can use the `subscribe` method to subscribe to changes in the data and perform custom action on it.

## Content type configuration

Please see [content type configuration](../configurations/content-type-configuration.md#Converter Interfaces) for information on content type configuration.

## Appearances

Appearances allow you to make the following customization on existing content types:

1. Add new style properties to existing content types
2. Add new attributes to existing content types. This is similar to above.
3. Change templates
4. Move data between elements, achieved with data mapping configuration.
   For example, a developer can move the `margin` style property from one element to another.
5. Change the form for a [content type]

## Module structure

| File type                | Location                                                                                       |
| -------------------------|------------------------------------------------------------------------------------------------|
| Content type components  | `Vendor/ModuleName/view/adminhtml/web/js/content-type/content-type-name`                       |
| Content type templates   | `Vendor/ModuleName/view/adminhtml/web/template/content-type/content-type-name/appearance-name` |
| Styles                   | `Vendor/ModuleName/view/adminhtml/web/css/source/content-type/content-type-name`               |

**Note:**
*We also considered introducing appearance component and/or moving the initialization of the libraries to bindings. This would allow you to add custom logic per appearance changes and libraries per appearance for content types like slider, tabs, etc.*

[TypeScript]: https://www.typescriptlang.org/
[master format]: master-format.md
[content type]: ../how-to/how-to-develop-new-content-type.md