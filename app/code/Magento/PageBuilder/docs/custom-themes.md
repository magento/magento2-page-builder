# Custom Theme Integration

## Navigation

1. [Introduction]
2. [Installation guide]
3. [Contribution guide]
4. [Developer documentation]
    1. [Architecture overview]
    1. [BlueFoot to PageBuilder data migration]
    1. **Custom theme integration**
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
    1. [Custom Toolbar]
    1. [Full width page layouts]
    1. [Add custom logic to content types]
5. [Roadmap and known issues]
6. [How to create custom PageBuilder content type container]

[Introduction]: README.md
[Contribution guide]: CONTRIBUTING.md
[Installation guide]: install.md
[Developer documentation]: developer-documentation.md
[Architecture overview]: architecture-overview.md
[BlueFoot to PageBuilder data migration]: bluefoot-data-migration.md
[Custom theme integration]: custom-themes.md
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
[Add custom logic to content types]: add-custom-logic.md
[Roadmap and Known Issues]: roadmap.md
[How to create custom PageBuilder content type container]: how-to-create-custom-content-type-container.md

## What's in this topic
This topic describes Page Builder specifics for usage with custom themes.  

## Responsive Mobile Images
Within Page Builder we have dynamic style generation for our mobile background images for containers. This functionality requires the mobile breakpoint to be specified, if different from the modules configuration, within your theme.

The module provides this configuration default within `Magento_PageBuilder/etc/view.xml`. We use the industry standard maximum width of 767px for the mobile image breakpoint.
```xml
<vars module="Magento_PageBuilder">
    <var name="breakpoints">
        <var name="mobile">767px</var>
    </var>
</vars>
```

If your theme utilises this breakpoint for your mobile layout no additional configuration is required.

If your theme does have a different mobile breakpoint you'll need to configure this value within your theme. This can be done within your themes `view.xml` by including the following within the `<view />` node:
```xml
<vars module="Magento_PageBuilder">
    <var name="breakpoints">
        <var name="mobile">BREAKPOINTpx</var>
    </var>
</vars>
```
You need to replace `BREAKPOINT` with the integer value of your themes breakpoint.