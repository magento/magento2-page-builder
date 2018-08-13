# Project Roadmap

## Navigation

1. [Introduction]
2. [Installation guide]
3. [Contribution guide]
4. [Developer documentation]
5. **Roadmap and Known Issues**
   1. [Overview](#overview)
   1. [Planned features and functionality](#planned-features-and-functionality)
   1. [Known issues](#known-issues)
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

This page lists the upcoming functionality and known issues for the PageBuilder project.

## Planned features and functionality

### Overall stage improvements

* A flexible grid system that allows you to choose between 2 to 20 column grids.
  This allows you to build highly customized store pages. <!-- MAGETWO-87048 -->
* Ability to select a color using the ColorPicker. <!-- MAGETWO-90240 -->
* Ability to set the vertical alignment for content inside a container. <!-- MAGETWO-90242 -->
* Ability to upload and use SVG files in the content. <!-- MAGETWO-53778 -->

### Text content block

  * Text block enhancements will make it easier to see the content block and access its settings on the stage. <!-- MAGETWO-87070 -->
  * Edit text content on the stage. <!--MAGETWO-86724-->

### Map content block

  * Google Map API integration with the Map content block. <!-- MAGETWO-88225 -->

### Developer experience

  * A tutorial, with code examples, that shows how to create Custom content blocks that meet the specific needs of a merchant. <!-- MAGETWO-72564 -->
  * Improved exception handling. <!-- MAGETWO-88348 -->
  * Improved validation of `content_types.xml`. <!-- MAGETWO-88379 -->
  * Documentation on how to create custom appearances for PageBuilder blocks and containers. <!-- MAGETWO-86522 -->
  * Static test - investigate why existing test for LESS coding styles doesn't work for PageBuilder code. <!-- MAGETWO-87592 -->
  * Remove the dependency on Column from the Row migration renderer. <!-- MAGETWO-88772 -->
  * Stabilize PageBuilder tests related to EE functionality. <!--MAGETWO-87898-->
  * Generate translation for PageBuilder module. <!--MAGETWO-88456-->
  * Set TinyMCE v3.5.8 WYSIWYG as a deprecated module. <!--MAGETWO-89695-->
  * PageBuilder data separation and configuration improvements. <!--MAGETWO-88351-->
  * Unskip Tests Under Banner & Staging Directories. <!--MAGETWO-90239-->
  * Unskip unstable MFTF tests for env with Page Builder Part 2. <!-- MAGETWO-89829-->
  * Add Tests to Update Advanced Configuration For Each Content Type 3. <!--MAGETWO-90175-->



## Known Issues

* The edit row form is missing the background position field after it has been created and the row settings are opened again. <!-- MAGETWO-89477 -->
* Advanced attributes are not updated on the Stage until after the pages is saved. <!-- MAGETWO-89560 -->
* Configuration fields will not display their entire value if the field is smaller than the value's string. <!-- MAGETWO-88226 -->
* When hovering the mouse over the fullscreen button in the upper right corner of Contents section in PageBuilder, the mouse has the incorrect cursor & does not display a tooltip. <!-- MAGETWO-88353 -->
* Image Uploader looks broken on the stage. <!-- MAGETWO-90116 -->
* The configuration for **require.js** is incorrect. <!-- MAGETWO-81327 -->
* WYSIWYG is not not compatible with the Dynamic Rows UI component. <!-- MAGETWO-80151 -->
* Required attributes on background section are inconsistent between different content types. <!-- MAGETWO-86986 -->
* Adding an empty product to the stage and saving breaks the entire storefront page. <!-- MAGETWO-89998 -->
* Adding an empty product list to the stage and saving displays every product on the storefront. <!-- MAGETWO-90010 -->
* Product count attribute for Product List does not work on the storefront. <!-- MAGETWO-90100 -->
* The Alignment attribute is not working as expected for Product, Map, and Divider. <!-- MAGETWO-90101 -->
* The Product List displays as a vertical list on stage and as a wrapped grid on the storefront. <!-- MAGETWO-90102 -->
* Image is not display on the storefront if added to a saved CMS page and secure keys are enabled in the Admin. <!-- MAGETWO-90177 -->
* Unable to add Image to banner. <!-- MAGETWO-90178 -->
* Multiple, random issues with buttons when created on a Block. <!-- MAGETWO-90184 -->
* Saving an Edit Form with no text does not give a Field Validation Error. <!-- MAGETWO-89867 -->
* The ImageUploader `maxFileSize` configuration cn exceed PHP's `upload_max_filesize`. <!-- MAGETWO-90241 -->
* Cannot save short description product attribute set. <!-- MAGETWO-90277 -->
* Cannot set border to default once it is set to another value. <!-- MAGETWO-90283 -->
* The Close Icon is display for attribute sets on the catalog product edit form. <!-- MAGETWO-90347 -->
* Editing/Deleting a block that is tied to the page does not update the storefront page until the page is saved or the cache is flushed. <!-- MAGETWO-90429 -->
* A disabled block still appears on the storefrunt until the page is saved or the cache is flushed. <!-- MAGETWO-90430 -->
* Disabled products still show up on the stage and storefront. <!-- MAGETWO-90431 -->
* Editing/Deleting a product that is tied to a page does not update a page on the storefront until the page is saved or the cache is flushed. <!-- MAGETWO-90432 -->


