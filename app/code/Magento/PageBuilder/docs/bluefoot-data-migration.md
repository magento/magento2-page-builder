# BlueFoot to PageBuilder data migration

## Navigation

1. [Introduction]
2. [Installation guide]
3. [Contribution guide]
4. [Developer documentation]
    1. [Architecture overview]
    1. **BlueFoot to PageBuilder data migration**
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


## Overview

This topic goes over the data migration process for BlueFoot data into the PageBuilder module in Magento 2.3.

It explains the API used for migrating the default content types and how developers can use it to migrate new and customized content types.

## Data migration overview

The PageBuilder module contains the API used for the data migration.

During the migration, Magento converts old BlueFoot content to its PageBuilder equivalent.

### Deprecated content types

The following content types are deprecated in PageBuilder:

* BlueFoot Slider - The Slider content type will be migrated as Advanced Slider.
* BlueFoot Search - The content for the Search content block will be converted to HTML during migration.
* BlueFoot Anchor - The content for the Anchor content block will be converted to HTML during migration.
* BlueFoot Accordion - The content for the Accordion content block will be converted to HTML during migration.
* BlueFoot Code - The content for the Code content block will be wrapped with the following tags:
    ```
    <pre><code></code></pre>
    ```

### New content types

Use the API described in this topic to hook into the migration process and convert custom content types.

If the migration process encounters a content type it cannot handle, it migrates that content type as an HTML content type with the original data included in an HTML comment.

Developers can use the migration API at a later time to migrate this data.

### Customized content types

If you customized a core content type, you must also customize the upgrade class to migrate your customizations.
This must be done prior to the initial migration.

## Content type renderers

Each content type has a corresponding renderer to convert the old BlueFoot JSON structure into the new PageBuilder format.
The PageBuilder format used for reading and writing is an HTML structure with data attributes represented as non-standard HTML attributes.

The HTML `string` output defined in the renderer is then saved to the database to be used by the PageBuilder module.

### Renderer Interface

Use the following interface when you implement a new content type renderer:

`Magento\PageBuilder\Setup\DataConverter\RendererInterface`

This interface specifies a single `render()` method that is called to do the data conversion.
Your implementation must return a `string` that is compatible with the target content type for the data you are migrating.

#### Parameters

| Name              | Description                                     |
| ----------------- | ----------------------------------------------- |
| `$itemData`       | Parsed BlueFoot JSON data ready for processing  |
| `$additionalData` | Additional data for rendering the content block |

**Example: Heading renderer class implementation**

``` php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render heading to PageBuilder format
 */
class Heading implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    /**
     * @var EavAttributeLoaderInterface
     */
    private $eavAttributeLoader;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader // This is an instance of our HeadingEntityHydrator injected by the DI container
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        // We create an array of root level element attributes to be applied later
        $rootElementAttributes = [
            'data-role' => 'heading',
            'class' => $eavData['css_classes'] ?? ''
        ];

        // We extract any styles from the form data
        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            // If styles are discovered we extend the attributes array
            $rootElementAttributes['style'] = $style;
        }

        // We utilise the heading_type key as the element tag name (create h2, h3 etc)
        $rootElementHtml = '<' . $eavData['heading_type'];

        // We iterate through the attributes we defined earlier and apply them to the DOM element
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }

        // We append the title as the content and close the element using the heading_type again
        $rootElementHtml .= '>' . $eavData['title'] . '</' . $eavData['heading_type'] . '>';

        // We've completed the render, so we return generated HTML
        return $rootElementHtml;
    }
}
```


#### Children content blocks

Some BlueFoot content types, such as slider, can contain child content types.
This can result in trees with deeply nested content blocks.

During rendering, content types are processed from the bottom of the tree to the top.
In other words, the system renders all child blocks first and makes the results available to the immediate parent for placement.

Use a virtual type of the following class to get the rendered content for a content type's children:

`Magento\PageBuilder\Setup\DataConverter\ChildrenExtractor\Configurable`

This class accepts an array of paths, defined in the [`di.xml`] file, which provides the location of each child to render.

**Example `di.xml` entry:**

``` xml
<virtualType name="ButtonsChildrenExtractor" type="Magento\PageBuilder\Setup\DataConverter\ChildrenExtractor\Configurable">
    <arguments>
        <argument name="path" xsi:type="string">children/button_items</argument>
    </arguments>
</virtualType>
```

After the system renders the children blocks, the content is available to the parent renderer through `$additionalData['children']`.

**Note:**
*This only applies to content types that contain children.*
*Containers such as rows or columns use a default children extractor.*

If you need different logic for extracting children data, create an implementation for the following interface:

`Magento\PageBuilder\Setup\DataConverter\ChildrenExtractorInterface`

#### EAV data

In BlueFoot, some data could be stored as entity-attribute-value (EAV) across different tables in the database.
If your custom content type has any data stored as EAV you can configure the following class using virtual types to load this data from the database:

`Magento\PageBuilder\Setup\DataConverter\ConfigurableEavAttributeLoader`

**Example `di.xml` entry for EAV hydrator for Heading:**
``` xml
<virtualType name="HeadingEavAttributeLoader" type="Magento\PageBuilder\Setup\DataConverter\ConfigurableEavAttributeLoader">
    <arguments>
        <argument name="additionalEavAttributes" xsi:type="array">
            <item name="title" xsi:type="string">title</item>
            <item name="heading_type" xsi:type="string">heading_type</item>
        </argument>
    </arguments>
</virtualType>
```

In this example, the EAV loader for Heading is assigned the `title` and `heading_type` attributes.

Use [dependency injection] to inject this virtual type into your renderer's constructor.

**Example `di.xml` entry for Heading renderer:**
``` xml
<type name="Magento\PageBuilder\Setup\DataConverter\Renderer\Heading">
    <arguments>
        <argument name="eavAttributeLoader" xsi:type="object">HeadingEavAttributeLoader</argument>
    </arguments>
</type>
```

To use the EAV loader in your renderer class, pass the `$itemData['entity_id']` value into its `load()` method:

``` php
$eavData = $this->eavAttributeLoader->load($itemData['entity_id']);
```

#### Styles

Use the following API to extract the styles from BlueFoot data:

`Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface`

This API provides an `extractStyle()` method that accepts an associative array.
It returns a string of styles ready to be inserted into the `style` DOM attribute.

**Example:**
``` php
$style = $this->styleExtractor->extractStyle($itemData['formData']);
```

### Renderer Pool

The `di.xml` file declares which content type renderers are available in the renderer pool.
The core PageBuilder module implements content type renderers for all its core content types.

**Example di.xml file:**
``` xml
<type name="Magento\PageBuilder\Setup\DataConverter\RendererPool">
    <arguments>
        <argument name="renderers" xsi:type="array">
            <item name="row" xsi:type="object">Magento\PageBuilder\Setup\DataConverter\Renderer\Row</item>
            <item name="column" xsi:type="object">Magento\PageBuilder\Setup\DataConverter\Renderer\Column</item>
            <item name="heading" xsi:type="object">Magento\PageBuilder\Setup\DataConverter\Renderer\Heading</item>
            ....
        </argument>
    </arguments>
</type>
```

If you are creating a new renderer for migration outside the PageBuilder module, you only need to list your custom renderer in the `renderers` array in your `di.xml` file.

[lifecycle]: https://devdocs.magento.com/guides/v2.2/extension-dev-guide/prepare/lifecycle.html
[`di.xml`]: https://devdocs.magento.com/guides/v2.2/extension-dev-guide/build/di-xml-file.html
[dependency injection]: https://devdocs.magento.com/guides/v2.2/extension-dev-guide/depend-inj.html
