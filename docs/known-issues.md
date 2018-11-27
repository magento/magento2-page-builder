# Known Issues

This article outlines the known higher priority issues present in the Page Builder beta release. We're actively working on many of these items and will update this document accordingly.

## Issues

* Degraded admin experience in IE 11.
    * Unable to edit a slide item due to being unable to click on the edit icon for a slide item. <!-- MC-5443 -->
    * Inline editing placeholders behave strangely within the admin and won't disappear when typing starts.
* Product does not display in admin when it is assigned to a specific website. <!-- MC-5373 -->
* TinyMCE inline editing mode is focused after saving a content type within the admin. <!-- MC-3812 -->
* Column rendered widths differ from storefront to admin. <!-- MC-3992 -->
* Issues with paddings, margins, and box-sizing on numerous content types.
* Floating option menus and other controls can be displayed off screen when content types are rendered near the edge of the screen.
* Degraded Parallax performance on storefront and in admin within some browsers. <!-- MC-5480 -->
* Using Page Builder within a slide out form has a degraded experience.
    * Left-side panel will not scroll with the user.
    * Dragging and dropping can become broken due to another instance of Page Builder being loaded.
* Scrolling within full-screen mode can cause the underlying page to scroll instead of the Page Builder content.
