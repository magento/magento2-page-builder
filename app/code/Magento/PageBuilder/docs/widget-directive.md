# Store component master format as widget directive

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
    1. **Store component master format as widget directive**
    1. [Use the block chooser UI component]
    1. [Use the inline text editing component]
    1. [Render a backend content type preview]
    1. [Custom Toolbar]
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
This topic describes how to store a component's master format as a `widget-directive`.

## Overview

To enable the storage of a component's master format as a `widget-directive`:
1. [Extend the `widget-directive` `mass-converter`](#extend)
2. [Add the `mass-converter` to your content type declaration XML file](#declaration)

## Extend the `widget-directive` `mass-converter` {#extend}

To use the `widget-directive` converter extend it and apply specific values for your use case.

To extend the `widget-directive` `mass-converter` add the following to the 'app/code/Magento/Pagebuilder/view/adminhtml/web/js/content-type/<my-type>/mass-converter/widget-directive.js' file:

``` javascript
define(["Magento_PageBuilder/js/mass-converter/widget-directive-abstract"], function(WidgetDirectiveAbstract) {
    var MyDirective = function() {
        WidgetDirectiveAbstract.apply(this, arguments);
    };

    MyDirective.prototype = Object.create(WidgetDirectiveAbstract.prototype);
    MyDirective.prototype.constructor = MyDirective;

    MyDirective.prototype.fromDom = function(data, config) {
        var attributes = WidgetDirectiveAbstract.prototype.fromDom.call(this, data, config);
        data.products_count = attributes.products_count;
        return data;
    };

    MyDirective.prototype.toDom = function(data, config) {
        var attributes = {
            type: "Magento\\CatalogWidget\\Block\\Product\\ProductsList",
            template: "Magento_CatalogWidget::product/widget/content/grid.phtml",
            anchor_text: "",
            id_path: "",
            show_pager: 0,
            products_count: data.products_count,
            type_name: "Catalog Products List",
        };

        data[config.html_variable] = this.buildDirective(attributes);
        return data;
    };

    return MyDirective;
});
```

## Add the `mass-converter` to your content type declaration XML file {#declaration}

To add the extended converter to your content type declaration XML file, 'Magento_PageBuilder/view/base/pagebuilder/content_type/<my-type>.xml':

``` xml
<converters>
    <converter component="Magento_PageBuilder/js/content-type/<my-type>/mass-converter/widget-directive" name="widget_directive">
        <config>
            <item name="html_variable" value="html"/>
        </config>
    </converter>
</converters>
```
The preceding code samples utilize example file paths. Substitute the file path with values specific to your content type and component.

