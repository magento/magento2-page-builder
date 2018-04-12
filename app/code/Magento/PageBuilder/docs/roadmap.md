# Project Roadmap

This page lists the upcoming functionality and known issues for the PageBuilder project.

## Planned features and functionality

* Text block enhancement to make it easier to see the content block on the stage and access its settings. <!-- MAGETWO-87070 -->
* Extensible grid feature allows content builders to use an extensible grid system to build highly customized store pages. <!-- MAGETWO-87048 -->
* The PageBuilder module will be available as a bundled extension. <!-- MAGETWO-70499 -->
* Custom content blocks that allow developers to build content blocks that meet the specific needs of a merchant. <!-- MAGETWO-72564 -->
* Improved exception handling <!-- MAGETWO-88348 -->
* Color selector for the ColorPicker <!-- MAGETWO-90240 -->
* Ability to set content vertical alignment inside a container <!-- MAGETWO-90242 -->
* Ability to add content inside Accordion items <!-- MAGETWO-66514 -->
* Ability to add additional items to Accordion content and configure it within the stage <!-- MAGETWO-87046 -->
* Ability to configure Accordion behavior <!-- MAGETWO-87098 -->
* New Anchor Content blocks to add anchor links on a page <!-- MAGETWO-87098 -->
* Ability to see a newly-dragged Accordion content block on the stage <!-- MAGETWO-87089 -->
* Ability to delete AccordianSection containers <!-- MAGETWO-87053 -->
* Ability to cancel changes on the stage and revert to the previously saved state <!-- MAGETWO-87987 -->
* Ability to rearrange AccordionSection containers inside an Accordion on the stage <!-- MAGETWO-87051 -->
* Ability to duplicate AccordionSection containers <!-- MAGETWO-88857 -->
* Google Map API integration with the Map content block <!-- MAGETWO-88225 -->
* Custom appearances for PageBuilder blocks and containers <!-- MAGETWO-86522 -->
* SVG file upload support <!-- MAGETWO-53778 -->
* PageBuilder will be available as a marketplace extension <!-- MAGETWO-71246 -->
* Improved validation of `content_types.xml` <!-- MAGETWO-88379 -->

## Known Issues

* The edit row form is missing the background position field after it has been created and the row settings are opened again. <!-- MAGETWO-89477 -->
* Advanced attributes are not updated on the Stage until after the pages is saved <!-- MAGETWO-89560 -->
* Configuration fields will not display their entire value if the field is smaller than the value's string. <!-- MAGETWO-88226 -->
* When hovering the mouse over the fullscreen button in the upper right corner of Contents section in PageBuilder, the mouse has the incorrect cursor & does not display a tooltip. <!-- MAGETWO-88353 -->
* Image Uploader looks broken on the stage <!-- MAGETWO-90116 -->
* The configuration for **require.js** is incorrect <!-- MAGETWO-81327 -->
* WYSIWYG is not not compatible with the Dynamic Rows UI component <!-- MAGETWO-80151 -->
* Required attributes on background section are inconsistent between different content types <!-- MAGETWO-86986 -->
* Uncaught TypeError on loading CMS Grid: Cannot read property 'map' of undefined <!-- MAGETWO-89950 -->
* Adding an empty product to the stage and saving breaks the entire storefront page <!-- MAGETWO-89998 -->
* Adding an empty product list to the stage and saving displays every product on the storefront <!-- MAGETWO-90010 -->
* Product count attribute for Product List does not work on the storefront <!-- MAGETWO-90100 -->
* The Alignment attribute is not working as expected for Product, Map, and Divider <!-- MAGETWO-90101 -->
* The Product List displays as a vertical list on stage and as a wrapped grid on the storefront <!-- MAGETWO-90102 -->
* Image is not display on the storefront if added to a saved CMS page and secure keys are enabled in the Admin <!-- MAGETWO-90177 -->
* Unable to add Image to banner <!-- MAGETWO-90178 -->
* Multiple, random issues with buttons when created on a Block <!-- MAGETWO-90184 -->
* Saving an Edit Form with no text does not give a Field Validation Error <!-- MAGETWO-98867 -->
* The ImageUploader `maxFileSize` configuration cn exceed PHP's `upload_max_filesize` <!-- MAGETWO-90241 -->
* Cannot save short description product attribute set <!-- MAGETWO-90277 -->
* Cannot set border to default once it is set to another value <!-- MAGETWO-90283 -->
* The Close Icon is display for attribute sets on the catalog product edit form <!-- MAGETWO-90347 -->
* Editing/Deleting a block that is ted to the page does not update the storefront page until the page is saved or the cache is flushed. <!-- MAGETWO-90429 -->
* A disabled block still appears on the storefrunt until the page is saved or the cache is flushed. <!-- MAGETWO-90430 -->
* Disabled products still show up on the stage and storefront <!-- MAGETWO-90431 -->
* Editing/Deleting a product that is tied to a page does not update a page on the storefront until the page is saved or the cache is flushed <!-- MAGETWO-90432 -->

## Misc Issues

* MAGETWO-87592 - Static test - investigate why existing test for LESS coding styles doesn't work for PageBuilder code
* MAGETWO-88772 - Remove dependency on Column from Row migration renderer
* MAGETWO-89188 - PageBuilder data separation for accordion
* MAGETWO-89226 - Cleanup master format for accordion
* MAGETWO-87898 - Stabilize PageBuilder tests related to EE functionality
* MAGETWO-88456 - Generate translation for PageBuilder module
* MAGETWO-89695 - TinyMCE v3.5.8 WYSIWYG as a deprecated module
* MAGETWO-88351 - PageBuilder data separation, config improvements
* MAGETWO-90239 - Unskip Tests Under Banner & Staging Directories
* MAGETWO-89829 - Unskip unstable MFTF tests for env with Page Builder Part 2
* MAGETWO-90175 - Add Tests to Update Advanced Configuration For Each Content Type 3
