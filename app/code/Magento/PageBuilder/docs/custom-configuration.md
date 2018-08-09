# Additional Data Configuration

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
    1. **Additional data configuration**
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

## What's in this topic
This topic describes how to extend and configure Page Builder content types to accommodate any preferred setting that is not addressed in the confines of our existing `content_type.xsd` schema definition.

`additional_data` allows you to provide extra configuration, such as `maxFileSize` or `allowedExtensions`, for various content types.

For example, if you want to load data from the backend, you can use objects, `xsi:type="object"`, to implement `Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface` to process the data and dynamically load information based on the system config.


## Overview

To add customization to a Page Builder content type:
1. [Add additional data to the XML config](#additional-data)
2. [Implement `ProviderInterface` for conversion](#conversion) (Optional, as it is only required if you're using `xsi:type="object"` to obtain dynamic configuration at runtime)

## Add additional data to the XML config {#additional-data}

Use `additional_data` in your `Vendor/ModuleName/view/adminhtml/pagebuilder/content_type/<your-content-type>.xml` XML config file to add custom configuration to a content type:

``` xml
<additional_data>
    <item name="uploaderConfig" xsi:type="array">
        <item name="maxFileSize" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader\MaxFileSize</item>
        <item name="allowedExtensions" xsi:type="string">jpg jpeg gif png</item>
        <item name="component" xsi:type="string">Magento_PageBuilder/js/form/element/image-uploader</item>
        <item name="componentType" xsi:type="string">imageUploader</item>
        <item name="dataScope" xsi:type="string">image</item>
        <item name="formElement" xsi:type="string">imageUploader</item>
        <item name="uploaderConfig" xsi:type="array">
            <item name="url" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader\SaveUrl</item>
        </item>
        <item name="previewTmpl" xsi:type="string">Magento_PageBuilder/form/element/uploader/preview</item>
        <item name="template" xsi:type="string">Magento_PageBuilder/form/element/uploader/preview/image</item>
        <item name="mediaGallery" xsi:type="array">
            <item name="openDialogUrl" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader\OpenDialogUrl</item>
            <item name="openDialogTitle" xsi:type="string" translate="true">Insert Images...</item>
            <item name="initialOpenSubpath" xsi:type="string">wysiwyg</item>
            <item name="storeId" xsi:type="object">\Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\StoreId</item>
        </item>
        <item name="validation" xsi:type="array">
            <item name="required-entry" xsi:type="boolean">true</item>
        </item>
    </item>
</additional_data>
 ```

## Implement `ProviderInterface` for conversion {#conversion}

Array and scalar types, `xsi:type="array"` and `xsi:type="string"` for example (but also boolean, integer, and constant), designated in the XML file are provided as-is to the additional data configuration payload.

Object content types, `xsi:type="object"`, must implement `ProviderInterface` in `/app/code/Magento/PageBuilder/Model/Config/ContentType/AdditionalData/ProviderInterface.php` to be converted:

``` php
<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData;

/**
 * Provides runtime-specific data for additional data content types configuration
 */
interface ProviderInterface
{
	/**
	 * Get data from the provider
	 * @param string $itemName - the name of the item to use as key in returned array
	 * @return array
	 */
	public function getData(string $itemName) : array;
}
```

`getData` then returns an array that must contain the key of the configuration item you're providing.

### Example use case

In the `additional_data` XML config there is a `storeId` item with a `storeId` provider class, which must return `['storeId' => ...value here...]` to be integrated properly:

```
<item name="storeId" xsi:type="object">\Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\StoreId</item>
```

Custom configuration is injected into relevant content type block constructors, such as for the image block shown here, and accessed in `config.additional_data` within the content block type in `/app/code/Magento/PageBuilder/view/adminhtml/web/js/content-type/<your-content-type>/preview.js`:

``` js
var uploaderConfiguration = Object.assign(
    {},
    config.additional_data.uploaderConfig,
    {
        value: this.dataStore.get().image,
    },
);

// Create uploader
this.uploader = new Uploader(
    this.id,
    "imageuploader_" + this.id,
    Object.assign({}, uploaderConfiguration, {
        value: this.dataStore.get().image,
    }),
    uploaderConfiguration,
);
```

