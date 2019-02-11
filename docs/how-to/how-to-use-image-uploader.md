# How to use the Image Uploader

## What's in this topic

This topic describes how to add a reusable image uploader component to the PageBuilder stage for a content type.

## Overview

To add image uploader customization to PageBuilder:
    - [Add configuration for the uploader](#add-configuration-for-the-uploader)
    - [Update the `<YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js` file {#js-file}](#js-file)
    - [Update the preview template to display the uploader component {#preview}](#preview)

## Add configuration for the uploader {#add-configuration-for-the-uploader}

Use `additional_data` in your `<YourModule>/view/base/pagebuilder/content_type/<content-type-name>.xml` XML config file to add the image uploader custom configuration to a content type:

``` xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <type name="MyName" translate="label" label="MyName" icon="icon-modulename-simple" component="Vendor_ModuleName/js/content-type" form="modulename_simple_form" menu_section="layout">
        ...
        <additional_data>
            <item name="uploaderConfig" xsi:type="array">
                <item name="isShowImageUploadInstructions" xsi:type="boolean">false</item>
                <item name="isShowImageUploadOptions" xsi:type="boolean">true</item>
                <item name="maxFileSize" xsi:type="string">4194304</item>
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
            </item>
        </additional_data>
    </type>
</config>
```

## Update the `<YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js` file {#js-file}

To update the `<YourModule>/view/adminhtml/web/js/content-type/<content_type_name>/preview.js` file:

1. Import the 'Magento_PageBuilder/js/content-type/uploader' component as a dependency:

    ``` js
    define(['Magento_PageBuilder/js/content-type/uploader'], function (Uploader) {
    ```

    **Constructor arguments**
     
    | Argument           | Type      | Description                                                                         | Required | Default                                                                                                 |
    | ------------------ | --------- | ----------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
    | `name`             | String    | Used to locate the component in the UI registry once it is created.                  | yes     | None                                                                                                    |
    | `uploaderConfig`   | Object    | Initializes the image uploader UI component.                                  | yes     | None                                                                                                    |
    | `contentTypeId`    | String    | The ID of the parent content type this will be used in.                             | yes     | None                                                                                                    |
    | `dataStore`        | DataStore | The DataStore that the selected image should be stored in.                          | yes     | None                                                                                                    |
    | `initialValue`     | Object[]  | The value to be used for the initial state of the component.               | yes     | None                                                                                                    |
    | `onChangeCallback` | Function  | A callback that will be called when an image is selected.                           | no    | The image will be saved to the provided `dataStore` using `uploaderConfig.dataScope` as the key.        |
    | `onDeleteCallback` | Function  | A callback that will be called when the current used image is deleted from storage. | no    | The image will be removed from to the provided `dataStore` using `uploaderConfig.dataScope` as the key. |

    The following is an example extracted from the image content type:

    ```js
    var dataStore = this.parent.dataStore.get();
    var initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";

    this.uploader = new Uploader(
       'imageuploader_' + this.parent.id,
       this.config.additional_data.uploaderConfig,
       this.parent.id,
       this.parent.dataStore,
       initialImageValue,
    );
    ```

2. Add configuration for the uploader in the `<content-type-name>.xml` file to initialize the uploader.

3. Register the listener to specify when the image is loaded from the uploader UI component:

``` js
/**
 * Get registry callback reference to uploader UI component
 *
 * @returns {Uploader}
 */
public getUploader() {
    return this.uploader;
}
```

## Update the preview template to display the uploader component {#preview}

Update the preview template file, `bluefoot/app/code/Magento/PageBuilder/view/adminhtml/web/template/content-type/<content-type-name>/<ppearance_name>/preview.html`, to display the uploader component:

``` html
<div>
   ...
    <scope args="getUploader().getUiComponent()">
        <render />
    </scope>
   ...
</div>
```

**Note:** When a file is deleted from the media browser, the `fileDeleted` event is triggered on the window with the `mediabrowser` namespace. The passed argument is an object containing the `ids` property, which is an array of ID strings for each of the deleted files. The IDs of the selected files are provided in the objects dispatched by the `addFile` and `processFile` methods inside the image uploader UI Component.
