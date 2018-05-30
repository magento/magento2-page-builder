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
    1. **Custom Toolbar**
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
[Custom Toolbar]: toolbar.md
[Roadmap and Known Issues]: roadmap.md

## What's in this topic
This document outlines how to add a custom toolbar in Page Builder. It's a simplified/lightweight version of a WYSIWYG:
![Page Builder toolbar](images/toolbar.png)

## Overview

To add a custom toolbar to a Page Builder content block:
1. [Add a toolbar configuration](#toolbarConfig)
2. [Add a toolbar template](#toolbarTpl)

## Add a toolbar configuration

To add a Toolbar configuration to your content block, you need to create a new instance of the `Toolbar` class, then add configuration options to it. Page Builder's Heading content block (`app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/content-type/heading/preview.ts`) provides an example of what you can do in your own content block:

```typescript
import $ from "jquery";
import events from "uiEvents";
import _ from "underscore";
import ContentTypeConfigInterface from "../../content-type-config.d";
import Toolbar from "../../content-type-toolbar";
import ToolbarOptionInterface from "../../content-type-toolbar/option.d";
import ContentTypeInterface from "../../content-type.d";
import ContentTypeReadyEventParamsInterface from "../content-type-ready-event-params.d";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";
 
export default class Heading extends BasePreview {
    public toolbar: Toolbar;
    private element: Element;
 
    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);
        this.toolbar = new Toolbar(
            this,
            this.getToolbarOptions(),
        );
    }
 
    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    public afterRender(element: Element): void {
        this.element = element;
    }
 
    public bindEvents() {
        super.bindEvents();
 
        // When a heading is dropped for the first time show heading toolbar
        events.on("heading:block:dropped:create", (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.parent.id) {
                _.delay(() => {
                    $(this.element).focus();
                }, 100); // 100 ms delay to allow for heading to render
            }
        });
    }
 
    /**
     * Build and return the tool bar options for heading
     *
     * @returns {ToolbarOptionInterface[]}
     */
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
}
```

In the Heading example, the `Toolbar` constructor requires its parent preview and the toolbar options you want to include:

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


