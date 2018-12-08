# How to add a custom Toolbar

## What's in this topic

This document outlines how to implement the inline editing toolbar for any content type. This feature is used within the heading to allow for easy modification of the heading type and alignment. It can be used within your content types to quickly change common things without needing to open the full editor.

![Page Builder toolbar](../images/toolbar.png)

## Overview

To add a custom toolbar to a Page Builder content block:

1. [Add a toolbar configuration](#toolbarConfig)
2. [Add a toolbar template](#toolbarTpl)

## Add a toolbar configuration {#toolbarConfig}

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

## Add toolbar template {#toolbarTpl}

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
