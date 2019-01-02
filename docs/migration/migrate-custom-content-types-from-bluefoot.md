# Migrate custom content types from BlueFoot

## Before you begin

This tutorial goes through the process of using the PageBuilder migration API to convert data from a third-party content type into its new PageBuilder content type.

The example code used in this tutorial is for migrating the data for a custom BlueFoot content type called `list` inside the `VendorName_ModuleName` module.

This tutorial assumes that a content type for `list` has already been re-implemented using PageBuilder extension points and that the initial migration of core BlueFoot content types has occurred.

You can also extend PageBuilder upgrade to migrate data for custom content types during initial migration. Refer to [BlueFoot data migration]

As a third-party PageBuilder content type developer, use this tutorial as a guide for creating the migration code for your PageBuilder content type.

## Prerequisites

* Familiarize yourself with the [PageBuilder migration API].
* Familiarize yourself with the [module lifecycle].
* Re-implement your BlueFoot content type as a PageBuilder content type.

## Step 1: Increase version

Increase your module's `version` in the [`composer.json`] file.

This causes Magento to run your module's setup scripts during the migration process.

**Note:** Follow Magento's [versioning policy] when deciding the value of your module's next version.

## Step 2: Add Page Builder dependency

Add the `Magento_PageBuilder` module dependency to your `composer.json` and `module.xml` files.

This ensures that your module will have access to the required migration API during the migration process.

## Step 3: Build the renderer

The renderer contains the main data conversion code for your content type.
It should take the BlueFoot JSON structure and convert it to the new storage format used by the re-implemented content type.

Create this class under `Setup/DataConverter/Renderer` and have it implement the following interface:

`Magento\PageBuilder\Setup\DataConverter\RendererInterface`

**Example: List renderer**

``` php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace VendorName\ModuleName\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;

class List implements RendererInterface
{
    /**
     * @var EavAttributeLoaderInterface
     */
    private $eavAttributeLoader;

    public function __construct(
        EavAttributeLoaderInterface $eavAttributeLoader
    ) {
        $this->eavAttributeLoader = $eavAttributeLoader;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->eavAttributeLoader->load($itemData['entity_id']);

        return '<div>Your output HTML here</div>';
    }
}
```

## Step 4: Add renderer to the RenderPool

Create an entry for the `RenderPool` in your module's `di.xml` file and specify your renderer as a list item under `renderers`.

When the migration process runs, it looks for the BlueFoot content type specified in the `name` attribute and passes it to your renderer for processing.

**Example: List renderer di.xml entry**

``` xml
<type name="Magento\PageBuilder\Setup\DataConverter\RendererPool">
    <arguments>
        <argument name="renderers" xsi:type="array">
            <item name="list" xsi:type="object">VendorName\ModuleName\Setup\DataConverter\Renderer\List</item>
        </argument>
    </arguments>
</type>
```

## Step 5: Create data upgrade class

Modify or create the `UpgradeData.php` class under the `Setup` directory.

This upgrade class must implement the following interface:

`\Magento\Framework\Setup\UpgradeDataInterface`

This is an executable class that Magento runs during the [data upgrade] stage of your module's lifecycle.
Your upgrade class should implement version checks to make sure the migration code is only run once.

For this migration, your upgrade class need the following dependencies:

* `Magento\Framework\EntityManager\MetadataPool`
* `Magento\Framework\DB\AggregatedFieldDataConverter`
* `Magento\Framework\DB\Select\QueryModifierFactory`
* `Magento\Framework\DB\FieldToConvert`
* `Magento\PageBuilder\Setup\DataConverter\MixedToPageBuilder`

In your upgrade class, use the following code to convert CMS pages, blocks, and product attributes.

**Note:** `MixedToPageBuilder` is used because the initial migration converted all unknown content types into a special type  used for delayed migrations.

``` php
$pageMetadata = $this->metadataPool->getMetadata(PageInterface::class);
$blockMetadata = $this->metadataPool->getMetadata(BlockInterface::class);
$this->aggregatedFieldConverter->convert(
    [
        new FieldToConvert(
            DataConverter\MixedToPageBuilder::class,
            $this->setup->getTable('cms_page'),
            $pageMetadata->getIdentifierField(),
            'content',
            $this->createQueryModifier('content', Format::BLUEFOOT_KEY)
        ),
        new FieldToConvert(
            DataConverter\MixedToPageBuilder::class,
            $this->setup->getTable('cms_block'),
            $blockMetadata->getIdentifierField(),
            'content',
            $this->createQueryModifier('content', Format::BLUEFOOT_KEY)
        ),
        new FieldToConvert(
            DataConverter\MixedToPageBuilder::class,
            $this->setup->getTable('catalog_product_entity_text'),
            'value_id',
            'value',
            $this->createQueryModifier('value', Format::BLUEFOOT_KEY)
        )
    ],
    $setup->getConnection()
);
```

### Content in other tables

The code sample provided does not migrate data outside the CMS pages, blocks, and product attributes tables.
If your content type has data in other tables or entities, you need to create an additional that would migrate data for that entity.

For instance, if there is module `Blog` that has BlueFoot content in the database, you can create module `BlogPageBuilder` with dependencies on `Blog` and `PageBuilder` modules to migrate BlueFoot content in the `Blog` module.

**Example: Module which creates a table called blog**

``` php
$this->aggregatedFieldConverter->convert(
    [
        new FieldToConvert(
            DataConverter\MixedToPageBuilder::class,
            $this->setup->getTable('blog'),
            'blog_id',
            'content',
            $this->createQueryModifier('content', Format::BLUEFOOT_KEY)
        )
    ],
    $this->setup->getConnection()
);
```

## Step 6: Run migration

Run the following command on the server to initiate your module's migration process:

`magento setup:upgrade`

## Congratulations

You have migrated your old BlueFoot content type into your new PageBuilder content type!

[PageBuilder migration API]: migrate-from-bluefoot.md
[BlueFoot data migration]: migrate-from-bluefoot.md
[`composer.json`]: https://devdocs.magento.com/guides/v2.2/extension-dev-guide/build/composer-integration.html
[versioning policy]: https://devdocs.magento.com/guides/v2.2/extension-dev-guide/versioning/
[module lifecycle]: https://devdocs.magento.com/guides/v2.2/extension-dev-guide/prepare/lifecycle.html
[data upgrade]: https://devdocs.magento.com/guides/v2.2/extension-dev-guide/prepare/lifecycle.html#data-upgrade
