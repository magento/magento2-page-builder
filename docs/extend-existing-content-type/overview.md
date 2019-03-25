# Overview

One of quickest ways to customize Page Builder is by changing how _existing_ content types look and behave. End-users can already edit Page Builder's content types in several ways. But sometimes your end-users will want to change the structure or modify properties that do not exist on a given content type. In those cases, you can extend an existing content type by customizing its existing _appearance_ or adding a new _appearance_.

## Appearances

An **appearance** is an XML element in a content type's configuration file that lets you modify existing properties, templates, styles, and form fields, or create new ones. In other words, all Page Builder content types (existing or custom) are extended through appearances.

Many of Page Builder's content types have only one `appearance` element. These include the Heading, Text, Image, Video, Tabs, and more. Other content types have several appearances. For example, the Banner content type has four appearances, as shown here:

![banner-appearances](../images/banner-appearances.png)  

Page Builder defines these appearances in the Banner's configuration file (`Magento/PageBuilder/view/adminhtml/pagebuilder/content_type/banner.xml`), as shown here:

```
<appearances>
    <appearance name="collage-left"...>
    <appearance name="collage-centered"...>
    <appearance name="collage-right"...>
    <appearance name="poster" default="true" ...>
</appearances>
```

Within each `appearance` element, you can change content types in the following ways:

- Add new style properties.
- Add or change templates.
- Add to or change existing forms.
- Add new attributes.
- Move data between elements.

## Banner extension tutorial

In this tutorial, you will extend the Banner content type by adding a new `max-height` style property to two of the Banner's existing appearances: `collage-left` and `collage-right`.

![Page Builder Banner menu item](../images/extend-banner-menu.png){:width="815px" height="auto"}

## Banner extension steps

These steps show the basic pattern for adding style properties using existing appearances to extend a content type:

![Creating Custom Content Types](../images/extension-steps-overview.svg)

1. **Create an extension module**: Create a basic module for your Banner extensions.
2. **Extend appearances**: Extend the existing content type's configuration file by customizing an existing appearance with new style properties.
3. **Extend forms**: Extend the existing content type's UI component form by adding new form fields and changing defaults for existing fields.

## Next

[Step 1: Create an extension module](step-1-create-extension-module.md)

