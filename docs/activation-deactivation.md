## Activate and Deactivate PageBuilder

<!--{% comment %}-->
## Navigation

1. [Introduction]
2. [Installation guide]
3. **Activate and Deactivate PageBuilder**
4. [Contribution guide]
5. [Developer documentation]
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
    1. [Custom Toolbar]
    1. [Full width page layouts]
    1. [Add custom logic to content types]
6. [Roadmap and known issues]
7. [How to create custom PageBuilder content type container]

[Introduction]: introduction.md
[Contribution guide]: ../CONTRIBUTING.md
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
[Add custom logic to content types]: add-custom-logic.md
[Roadmap and Known Issues]: roadmap.md
[How to create custom PageBuilder content type container]: how-to-create-custom-content-type-container.md
[Activate and Deactivate PageBuilder]: activation-deactivation.md
<!--{% endcomment %}-->

<!-- {% raw %} -->
## Activate PageBuilder

Follow these steps to activate PageBuilder in the Admin:

1. Navigate to the Admin section of you Magento instance.
2. In the **Stores** tab, select **Configuration** under the Settings group.
3. In the **General** group on the page, select **Content Management**.
4. Under **Advanced Content Tools**, select **Yes** for **Enable Page Builder**.
5. Click **Save Config**

## Deactivate PageBuilder

We recommend you deactivate the PageBuilder editor through the Admin instead of disabling the module itself.
This allows the PageBuilder module to continue rendering the content on the storefront even if the editor is not used in the Admin.

If you disabled or uninstalled the entire PageBuilder module instead of just the editor, you need to do the following to continue using PageBuilder-built content:

1. Implement PageBuilder widgets and initialize them on dynamic blocks since JavaScript functionality provided by PageBuilder will no longer work.
2. Change the layout in the database for entities that use the full width layout to prevent blank layout content.

<!-- {% endraw %} -->