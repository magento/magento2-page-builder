# Module integration

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
    1. **Module integration**
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

## Product attribute fields

The PageBuilder module is compatible with all product attributes fields that use an input of type `text`.
If your module creates a custom product attribute as a feature, you can change the input of that attribute to PageBuilder.

For example, the following code creates a new product attribute called "Sample Field" with a default input type of `textarea`.

``` php
use Magento\Catalog\Setup\CategorySetup;
use Magento\Catalog\Setup\CategorySetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;

...

$categorySetup = $this->categorySetupFactory->create(['setup' => $this->moduleDataSetup]);

$attributeSetId = $categorySetup->getDefaultAttributeSetId(\Magento\Catalog\Model\Product::ENTITY);
$categorySetup->addAttributeGroup(
    \Magento\Catalog\Model\Product::ENTITY,
    $attributeSetId,
    'Sample Field',
    115
);

$categorySetup->addAttribute(
    \Magento\Catalog\Model\Product::ENTITY,
    'sample_field',
    [
        'type' => 'text',
        'label' => 'Sample Field',
        'input' => 'textarea',
        'source' => \Magento\Catalog\Model\Product\Attribute\Source\Layout::class,
        'required' => false,
        'sort_order' => 10,
        'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
        'group' => 'Content',
        'is_used_in_grid' => true,
        'is_visible_in_grid' => false,
        'is_filterable_in_grid' => false,
        'is_visible_on_front' => true,
        'default' => 'Hello World'
    ]
);
```

The following steps changes a custom product attribute's input type to PageBuilder using the Admin:

1. On the Admin sidebar, click **Stores**.
1. Under **Attributes**, click on **Product**.
1. Select the target custom product attribute.
   You may have to use the search function or increase the amount displayed on the page to find it.
1. Under **Attribute Properties**, select **Page Builder** for **Catalog Input Type for Store Owner**.

   ![Catalog Input Type]

## WYSIWYG form fields configuration

All form fields that use the [WYSIWYG UI Component] are compatible with the PageBuilder module.

The following configuration settings in your module's [UI Component configuration file] affect how a form field interacts with the PageBuilder module:

### `pagebuilder_button`

The `pagebuilder_button` configuration determines the appearance of the PageBuilder editor.

When this configuration is set to `true`, a button replaces the input field on the form.
This button launches the PageBuilder editor in Full Screen Mode when clicked.
Use this feature to save space on forms with multiple fields.

![PageBuilder button]

When this configuration is not specified or set to `false`, the PageBuilder editor appears inline on the form.

**Example:**

``` xml
...
<field name="message" sortOrder="10" formElement="wysiwyg" template="ui/form/field">
    <argument name="data" xsi:type="array">
        <item name="config" xsi:type="array">
            <item name="source" xsi:type="string">page</item>
            <item name="wysiwygConfigData" xsi:type="array">
                <item name="pagebuilder_button" xsi:type="boolean">false</item>
                ...
            </item>
        </item>
    </argument>
...
</field>
...
```

### `is_pagebuilder_enabled`

When the PageBuilder module is enabled, all form fields that use the [WYSIWYG UI Component] automatically switch to PageBuilder.

To prevent your form field from switching or using PageBuilder, set the `is_pagebuilder_enabled` configuration to `false`.

**Example:**

``` xml
...
<field name="message" sortOrder="10" formElement="wysiwyg" template="ui/form/field">
    <argument name="data" xsi:type="array">
        <item name="config" xsi:type="array">
            <item name="source" xsi:type="string">page</item>
            <item name="wysiwygConfigData" xsi:type="array">
                <item name="is_pagebuilder_enabled" xsi:type="boolean">false</item>
                ...
            </item>
        </item>
    </argument>
...
</field>
...
```

[Catalog Input Type]: images/catalog-input-type.png
[PageBuilder button]: images/pagebuilder-button.png
[WYSIWYG UI Component]: https://devdocs.magento.com/guides/v2.2/ui_comp_guide/components/ui-wysiwyg.html
[UI Component configuration file]: https://devdocs.magento.com/guides/v2.2/ui_comp_guide/concepts/ui_comp_xmldeclaration_concept.html
