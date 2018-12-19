# Release Notes

Here are the Page Builder beta release notes and the higher priority known issues. We are actively working on many of these items and will update this document with each beta release.

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

* Degraded admin experience in IE 11.
    * Inline editing placeholders behave strangely within the admin and won't disappear when typing starts.
* Product does not display in admin when it is assigned to a specific website. <!-- MC-5373 -->
* TinyMCE inline editing mode is focused after saving a content type within the admin. <!-- MC-3812 -->
* Issues with padding, margins, and box-sizing on numerous content types.
* Floating option menus and other controls can be displayed off screen when content types are rendered near the edge of the screen.
* Degraded Parallax performance on storefront and in admin within some browsers. <!-- MC-5480 -->
* Using Page Builder within a slide out form has a degraded experience.
    * Left-side panel will not scroll with the user.
    * Dragging and dropping can become broken due to another instance of Page Builder being loaded.
* Scrolling within full-screen mode can cause the underlying page to scroll instead of the Page Builder content.