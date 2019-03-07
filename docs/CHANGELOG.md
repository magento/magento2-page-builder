# Changelog

## Beta 8 - February 19, 2019

- Resolved: Analytics module sequence issue.

## Beta 7 - February 14, 2019

Beta 7 has breaking changes due to renaming of several critical variables and parameters in Page Builder's code and configuration. Please refer to the [breaking changes document](https://devdocs.magedevteam.com/ds_pagebuilder/page-builder/breaking-changes.html) for details on how to update your custom content types.

- Resolved: Content type markup within Text content type causes whole stage to become HTML <!--MC-13917-->
- Resolved: Hard-coded margins on individual Button <!--MC-13925-->
- Resolved: Various TypeScript errors <!--MC-10833-->
- Resolved: Column rearranging drop zone indicators are too small and sometimes hard to activate <!--MC-4262-->
- Resolved: Collect Page Builder content type data for Page Builder analytics <!--MC-1426-->
- Resolved: Improve naming of the critical variables/parameters in the code and configuration <!--MC-5810-->
- Resolved: Text height inconsistency on stage and storefront <!--MC-4254-->
- Resolved: Option menus, Heading inline editor, and tinyMCE inline editor are cut off on full screen view <!--MC-5383-->
- Resolved: Anchor tags for TinyMCE links are not added to the storefront for Banners and Slides (Added notification for when link attribute is entered) <!--MC-5386-->
- Resolved: `WidgetInitializerConfig` only supports <div /> elements <!--MC-13770-->
- Resolved: Slide dots are hard to see against certain backgrounds on storefront <!--MC-5701-->
- Resolved: Missing validation message when uploading big image <!--MC-5184-->
- Resolved: Security issues <!--MC-10871, MC-13922-->

## Beta 6 - February 4, 2019

- Resolved: Background attachments of "fixed" do not work in storefront on Android or iPhone mobile devices<!-- MC-5419 -->
- Resolved: Minimum height issues with Columns <!-- MC-5405 -->
- Resolved: Parallax fixed settings should work in admin and storefront <!-- MC-11066 -->
- Resolved: Move data migration into its own module <!-- MC-5824 -->
- Resolved: Changing row appearance with two rows on stage breaks admin <!-- MC-11821 -->
- Resolved: Banner and Slider TinyMCE menus display inconsistently in admin <!-- MC-13691 -->
- Improved: Test coverage for CMS Blocks and Catalog Product <!-- MC-3328, MC3329 -->

## Beta 5 - January 28, 2019

- Resolved: Prefixed field names with section name to avoid field name collision <!-- MC-5232 -->
- Resolved: MFTF: Rewrite Selectors/ActionGroups to allow using PageBuilder in non-CMS page areas <!-- MC-4231 -->
- Resolved: Right/Left Margin Not Working For Content Types <!-- MC-5025 -->
- Resolved: Alignment doesn't work for Slide, Banners, & Text Placeholders & for Slide Content & Banner Poster Content <!-- MMC-4290 -->
- Resolved: Implement better developer error reporting <!-- MC-5691 -->
- Resolved: Banner placeholder disappears when user switching between different appearances <!-- MC-5727 -->

## Beta 4 - January 14, 2019

- Resolved: Collage Center/Left/Right does not work correctly in a container smaller than 100% width <!-- MC-5372 -->
- Resolved: Contained row appearance renders too small when in smaller container or in Block/Dynamic Block <!-- MC-5432 -->
- Resolved: XSS Vulnerability in Page Builder <!-- MC-5835 -->

## Beta 3 - December 19, 2018

- Improved: Handling of invalid Google Maps API keys <!-- MC-5723 -->
- Removed: Legacy overlay transparency field from banner & slider in favor of using the color picker <!-- MC-3895 -->
- Resolved: Box sizing issues on storefront and Admin <!-- MC-5079 --> 
- Resolved: Issue with initiation of tabs breaking in certain scenarios <!-- MC-5363 --> 
- Resolved: Performance issues with "Edit with Page Builder" button in category and product areas <!-- MC-5403 --> 
- Resolved: Numerous issues within staging slide out <!-- MC-5423 --> 

## Beta 2 - December 10, 2018

- Resolved: Image inside Text Content Type is scaled on stage <!-- MC-3509 --> 
- Resolved: Padding is not respected on Text <!-- MC-3713 --> 
- Resolved: Saving Slide Button Type As Secondary Or Link Will Still Show As Primary On Edit Form <!-- MC-3818 --> 
- Resolved: Columns Widths Are Not Consistent Between Stage & Storefront <!-- MC-3992 --> 
- Resolved: Review Information Covered By Add To Cart Button On Products On Stage <!-- MC-4130 --> 
- Resolved: Hard Coded Padding On Button Groups & On Text <!-- MC-4278 --> 
- Resolved: Remove Reset Button From Slide Outs For All Content Types <!-- MC-5790 --> 
- Resolved: Remove is_hideable option from content type configuration <!-- MC-4959 --> 
- Resolved: IE11 - Cannot Use Slide Item Option Menu <!-- MC-5443 --> 

## Beta 1 - November 27, 2018

- Initial beta release

## Known Issues

* Degraded admin experience when using IE 11.
* Product does not display in admin when it is assigned to a specific website. <!-- MC-5373 -->
* Issues with padding, margins, and box-sizing on numerous content types. <!-- MC-11021 -->
* Floating option menus and other controls can be displayed off screen when content types are rendered near the edge of the screen. <!-- MC-5383 -->
* Degraded Parallax performance on storefront and in admin within some browsers. <!-- MC-5480 -->
* Using Page Builder within a slide out form has a degraded experience.
    * Left-side panel will not scroll with the user.
    * Dragging and dropping can become broken due to another instance of Page Builder being loaded.

