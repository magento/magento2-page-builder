# Release notes for Page Builder

The following updates describe the latest improvements to Page Builder.

The release notes include:

- {:.new}New features
- {:.fix}Fixes and improvements

## 1.2.0

This release is part of Magento Commerce 2.3.4.

**Page Builder integration with PWA Studio**

- {:.new}Added Page Builder content rendering to the Venia app in PWA Studio.

**Products content type enhancements**

- {:.new}<!-- PB-77, PB-173, PB-175 -->Added Product carousel. The Products content type now provides an option to display your products in a carousel / slider format, including several options to customize the carousel to your needs.
- {:.new}<!-- PB-69 -->Added Product SKU sorting. The Products content type now provides an option to sort your products by SKU in the order you add them to a list within the Admin.
- {:.new}<!-- PB-181 -->Added Product Category sorting. The Products content type now provides an option to sort your products by category _position_, displaying them in same order that they appear within your Magento Catalog.
- {:.new}<!-- PB-107 -->Added Product selection totals. The Products content type Admin editor now displays the total number of products that match your product selection options.

**Various Fixes**

- {:.fix}<!-- PB-237 -->Security enhancements.
- {:.fix}<!-- PB-41 -->Fixed searches within UI select components to make only one AJAX request per search term.
- {:.fix}<!-- PB-76, PB-84-->Updated Product previews in the Admin to match the storefront, including the star rating, color, and size options of the product when relevant.
- {:.fix}<!-- PB-169 -->Fixed an issue in which Page Builder could not be saved when Magento's JavaScript minification and bundling are enabled.
- {:.fix}<!-- PB-241 -->Fixed the Admin previews of Products, Blocks, and Dynamic Blocks to render correctly on Magento installations that define different URLs for the Admin and the frontend.
- {:.fix}<!-- PB-238 -->Fixed the Admin previews of Products, Blocks, and Dynamic Blocks to render correctly on Magento installations with B2B installed with the "Login Only" option enabled. Prior to this fix, the Page Builder preview would cause the page to redirect to the customer account login.
- {:.fix}<!-- PB-239 -->Fixed a session error that can occur when previewing a large page in the Page Builder Admin.
- {:.fix}<!-- PB-248 -->Updated Page Builder LESS styles to prevent storefront style duplication.

## 1.1.1

This release is part of Magento Commerce 2.3.3-p1.

- {:.new}Security enhancements.


## 1.1.0

This release is part of Magento Commerce 2.3.3.

- {:.new}<!-- MC-15250 -->Added explicit product sorting to the Products content type.

- {:.new}<!-- MC-17823 -->Added buttons for inserting images, widgets, and variables in the HTML content type.

- {:.fix}Improved Page Builder security.

- {:.fix}<!-- MC-1805 -->Updated Page Builder to support PHP version 7.3.

- {:.fix}<!-- MC-4137 -->Updated TinyMCE to version 4.9.5. This update, along with our additional improvements, fixed several TinyMCE inline editor issues:

   - {:.fix}Variables, images, & image links now get added where the cursor is place.
   - {:.fix}Tables and table cells can now be center aligned.
   - {:.fix}Copy/paste now pastes content at the cursor's position.
   - {:.fix}Links can now be applied to selected text.
   - {:.fix}Bullets are now properly aligned.
   - {:.fix}Changes within the inline editor can now be saved without first clicking outside the editor.

- {:.fix}<!-- MC-3880 -->Fixed an issue in which the minimum height & vertical alignment was inconsistent between sections on the edit panel for each content type.

- {:.fix}<!-- MC-14994 -->Fixed an issue in which the toolbar from the Heading content type was positioned incorrectly when first dropped on the stage.

- {:.fix}<!-- MC-15742 -->Fixed hard-coded margins in both Slider and Video content types.

- {:.fix}<!-- MC-16241 -->Fixed an issue in which the required asterisk symbol was displayed twice on form fields.

## 1.0.3

This release is part of Magento Commerce 2.3.2-p2.

- {:.new}Security enhancements.

## 1.0.2

This release is part of Magento Commerce 2.3.2-p1.

- {:.new}Security enhancements.

## 1.0.1

- {:.new}Ensures compatibility with Magento Commerce 2.3.2.

## 1.0.0

This release is part of Magento Commerce 2.3.1.

- {:.new}General availability release!

### Documentation

To learn more about Page Builder and Page Builder development:

- For developers: [What is Page Builder?](https://devdocs.magento.com/page-builder/docs/index.html)
- For end-users: [Page Builder User Guide](https://docs.magento.com/m2/ee/user_guide/cms/page-builder.html)
