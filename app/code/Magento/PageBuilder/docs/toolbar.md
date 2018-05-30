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
    1. [Module integration]
    1. [Additional data configuration]
    1. [Content type configuration]
    1. [How to add a new content type]
    1. [Events]
    1. [Master format]
    1. [Visual select]
    1. **Toolbar**
5. [Roadmap and known issues]

[Introduction]: README.md
[Installation Guide]: install.md
[Contribution guide]: CONTRIBUTING.md
[Developer documentation]: developer-documentation.md
[Architecture overview]: architecture-overview.md
[BlueFoot to PageBuilder data migration]: bluefoot-data-migration.md
[Third-party content type migration]: new-content-type-example.md
[Iconography]: iconography.md
[Module integration]: module-integration.md
[Additional data configuration]: custom-configuration.md
[Content type configuration]: content-type-configuration.md
[How to add a new content type]: how-to-add-new-content-type.md
[Events]: events.md
[Master format]: master-format.md
[Visual select]: visual-select.md
[Toolbar]: toolbar.md
[Roadmap and Known Issues]: roadmap.md

## What's in this topic
This document outlines how to add a custom toolbar in Page Builder. It's a simplified/lightweight version of a WYSIWYG:
![Page Builder toolbar](images/toolbar.png)

## Overview

To add toolbar customization to a Page Builder content block:
1. [Add toolbar configuration](#toolbarConfig)
2. [Add toolbar template](#toolbarTpl)

## Add toolbar configuration

Add configuration options to your content block preview. This is an array of options:

| Element             | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `key`               | Describes the group name in the menu.                                    |
| `type`              | Describes the element type.                                              |
| `values`            | Array of values for each option.                                         |
| `value`             | Value referenced in the dataStore.                                       |
| `label`             | Label of the option. If no icon is specified, this will be displayed     |
| `icon`              | Name of CSS class to use for the icon.                                   |


```javascript
private getToolbarOptions(): ToolbarOptionInterface[] {
    return [
        {
            key: "heading_type",
            type: "select",
            values: [
                {
                    value: "h1",
                    label: "H1",
                    icon: "",
                },
                {
                    value: "h2",
                    label: "H2",
                    icon: "",
                },
                {
                    value: "h3",
                    label: "H3",
                    icon: "",
                },
                {
                    value: "h4",
                    label: "H4",
                    icon: "",
                },
                {
                    value: "h5",
                    label: "H5",
                    icon: "",
                },
                {
                    value: "h6",
                    label: "H6",
                    icon: "",
                },
            ],
        },
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
    ];
}
```
 
Pass toolbar configuration to a new instance of Toolbar.
```javascript
new Toolbar(this, this.getToolbarOptions());
```

An example implementation can be found in the Heading content block:
`app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/content-type/heading/preview.ts`

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


