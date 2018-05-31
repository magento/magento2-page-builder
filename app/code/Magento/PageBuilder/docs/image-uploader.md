
---
layout: default
group: modules
title: Custom image uploader for content types
version: 2.3
github_link: modules/pagebuilder/image-uploader.md
---

## What's in this topic
This topic describes how to add a reusable image uploader component to the PageBuilder stage for a content type.

## Overview

To add image uploader customization to PageBuilder:
1. [Add configuration for the uploader to the XML config](#xml-config)
2. [Update the `ts/js/content-type/%content_type_name%/preview.ts` file](#ts-file)
3. [Update the preview template to display the uploader component](#preview)

## Add the uploader to the XML config {#xml-config}

Add the following configuration values, as shown, to the `app/code/Magento/PageBuilder/view/base/pagebuilder/content_type/%content-type-name%.xml` file: 

``` xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <content_types>
        <type name="MyName" translate="label">
            ...
            <additional_data>
                <arguments name="uploaderConfig" xsi:type="array">
                    <item name="isShowingImageUploadInstructionsInitially" xsi:type="boolean">false</item>
                    <item name="isAlwaysShowingImageUploadOptions" xsi:type="boolean">true</item>
                    <item name="maxFileSize" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader\MaxFileSize</item>
                    <item name="allowedExtensions" xsi:type="string">jpg jpeg gif png</item>
                    <item name="component" xsi:type="string">Magento_PageBuilder/js/form/element/image-uploader</item>
                    <item name="componentType" xsi:type="string">imageUploader</item>
                    <item name="dataScope" xsi:type="string">background_image</item>
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
                        <item name="storeId" xsi:type="object">Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\StoreId</item>
                    </item>
                    <item name="validation" xsi:type="array">
                        <item name="required-entry" xsi:type="boolean">true</item>
                    </item>
                </arguments>
            </additional_data>
        </type>
    </content_types>
</config>
```

## Update the `ts/js/content-type/%content_type_name%/preview.ts` file {#ts-file}

To update the `ts/js/content-type/%content_type_name%/preview.ts` file:

1. Add the uploader component, 'Magento/PageBuilder/view/adminhtml/web/ts/js/content-type/uploader.ts', dependency:

``` ts
import Uploader from "../uploader";
```

2. Specify the registry callback reference to the uploader UI component:

``` ts
/**
 * Get registry callback reference to uploader UI component
 *
 * @returns {Uploader}
 */
public getUploader() {
    return this.uploader;
}
```
3. Add needed logic to bind events:

``` ts
/**
 * @inheritDoc
 */
protected bindEvents() {
    super.bindEvents();
 
    events.on(`${this.parent.id}:updated`, () => {
        const dataStore = this.parent.dataStore.get();
        const imageObject = dataStore[this.config.additional_data.uploaderConfig.dataScope][0] || {};
        events.trigger(`image:assigned:${this.parent.id}`, imageObject);
    });
 
    events.on(`${this.config.name}:block:ready`, () => {
        const dataStore = this.parent.dataStore.get();
        const initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";
 
        // Create uploader
        this.uploader = new Uploader(
            this.parent.id,
            "imageuploader_" + this.parent.id,
            Object.assign({}, this.config.additional_data.uploaderConfig, {
                value: initialImageValue,
            }),
        );
 
        // Register listener when image gets uploaded from uploader UI component
        this.uploader.onUploaded(this.onImageUploaded.bind(this));
    });
}
```

4. Add needed logic to `imageUploaded`:

``` ts
/**
 * Update image data inside data store
 *
 * @param {Array} data - list of each files' data
 */
private onImageUploaded(data: object[]) {
    this.parent.dataStore.update(
        data,
        this.config.additional_data.uploaderConfig.dataScope,
    );
}
```
## Update the preview template to display the uploader component {#preview}

To update the preview template file, `bluefoot/app/code/Magento/PageBuilder/view/adminhtml/web/template/content-type/%content-type-name%/%appearance_name%/preview.html`, to display the uploader component:

``` html
<div>
   ...
            <scope args="getUploader().getUiComponent()">
                <render />
            </scope>
   ...
</div>
```