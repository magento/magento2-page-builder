# How to use Page Builder for product attributes

The Page Builder module is compatible with all product attribute fields that use an input of type `text`.
If your module creates a custom product attribute as a feature, you can change the input of that attribute to Page Builder.

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

The following steps change a custom product attribute's input type to Page Builder using the Admin UI:

1. On the Admin sidebar, click **Stores**.
2. Under **Attributes**, click on **Product**.
3. Select the target custom product attribute.
   You may have to use the search function or increase the amount displayed on the page to find it.
4. Under **Attribute Properties**, select **Page Builder** for **Catalog Input Type for Store Owner**.

   ![Catalog Input Type]

## WYSIWYG form fields configuration

All form fields that use the [WYSIWYG UI Component] are compatible with the Page Builder module.

The following configuration settings in your module's [UI Component configuration file] affect how a form field interacts with the Page Builder module:

### `pagebuilder_button`

The `pagebuilder_button` configuration determines the appearance of the Page Builder editor.

When this configuration is set to `true`, a button replaces the input field on the form.
This button launches the Page Builder editor in Full Screen Mode when clicked.
Use this feature to save space on forms with multiple fields.

![Page Builder button]

When this configuration is not specified or set to `false`, the Page Builder editor appears inline on the form.

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

When the Page Builder module is enabled, all form fields that use the [WYSIWYG UI Component] automatically switch to Page Builder.

To prevent your form field from switching or using Page Builder, set the `is_pagebuilder_enabled` configuration to `false`.

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

[Catalog Input Type]: ../images/catalog-input-type.png
[Page Builder button]: ../images/pagebuilder-button.png
[WYSIWYG UI Component]: https://devdocs.magento.com/guides/v2.2/ui_comp_guide/components/ui-wysiwyg.html
[UI Component configuration file]: https://devdocs.magento.com/guides/v2.2/ui_comp_guide/concepts/ui_comp_xmldeclaration_concept.html