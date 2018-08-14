# Custom Toolbar

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
    1. [Render a backend content type preview]
    1. **Custom Toolbar**
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
This document outlines how to add a custom toolbar in Page Builder. It's a simplified/lightweight version of a WYSIWYG:
![Page Builder toolbar](images/toolbar.png)

## Overview

To add a custom toolbar to a Page Builder content block:
1. [Add a toolbar configuration](#toolbarConfig)
2. [Add a toolbar template](#toolbarTpl)

## Add a toolbar configuration

To add a Toolbar configuration to your content block, you need to create a new instance of the `Toolbar` class, then add configuration options to it. 

An example implementation can be found in the Heading content block:
`app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/content-type/heading/preview.ts`

In the Heading example, the `Toolbar` constructor requires its parent preview and the toolbar options you want to include as follows:

```javascript
new Toolbar(this, this.getToolbarOptions());
```

where `this.getToolbarOptions()`returns the toolbar options. For example, the Heading toolbar's three text-alignment options are defined as follows:

```typescript
{
    key: "text_align",
    type: "select",
    values: [
        {
            value: "left",
            label: "Left",
            icon: "icon-pagebuilder-align-left",
        },
        {
            value: "center",
            label: "Center",
            icon: "icon-pagebuilder-align-center",
        },
        {
            value: "right",
            label: "Right",
            icon: "icon-pagebuilder-align-right",
        },
    ],
},
```
Option property descriptions:

| Element             | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `key`               | Describes the group name in the menu (comparable to a CSS property, `text_align`). |
| `type`              | Describes the element type (comparable to the HTML `input` type).                  |
| `values`            | Array of values for each option.                                                   |
| `value`             | Value referenced in the dataStore (comparable to a CSS property value).            |
| `label`             | Label of the option. If no icon is specified, this will be displayed               |
| `icon`              | Name of CSS class to use for the icon.                                             |


## Add toolbar template

In your content block template, add the toolbar events to your main toolbar container, and insert the toolbar template:
```html
<div class="pagebuilder-toolbar-container" tabindex="0" event="{ focusin: toolbar.onFocusIn, focusout: toolbar.onFocusOut }">
    <with args="toolbar">
        <render args="template" />
    </with>
</div>
```

An example implementation can be found in the Heading content block:
`app/code/Magento/PageBuilder/view/adminhtml/web/template/content-type/heading/default/preview.html`


