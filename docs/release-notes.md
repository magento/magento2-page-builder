# Release notes for Page Builder

The following updates describe the latest improvements to Page Builder.

The release notes include:

- {:.new}New features
- {:.fix}Fixes and improvements

## **1.3.0** for Magento Commerce 2.3.5

{:.new}**Full Height Rows, Banners, and Sliders**

Page Builder Rows, Banners, and Sliders now have the option to set their heights to the full-height of the page using a number with any CSS unit (px, %, vh, em) or a calculation between units (100vh - 237px). These new features are documented here: [Rows](https://docs.magento.com/m2/ee/user_guide/cms/page-builder-layout-row.html), [Banners](https://docs.magento.com/m2/ee/user_guide/cms/page-builder-media-banner.html), [Sliders](https://docs.magento.com/m2/ee/user_guide/cms/page-builder-media-slider.html).

{:.new}**Video Backgrounds for Rows, Banners, and Sliders**

Page Builder Rows, Banners, and Sliders now have the option to use videos for their backgrounds. These new features are documented here: [Rows](https://docs.magento.com/m2/ee/user_guide/cms/page-builder-layout-row.html), [Banners](https://docs.magento.com/m2/ee/user_guide/cms/page-builder-media-banner.html), [Sliders](https://docs.magento.com/m2/ee/user_guide/cms/page-builder-media-slider.html).

{:.new}**Templates**

Page Builder now has templates that can be created from existing content and applied to new content areas. Page Builder templates save both content and layouts of existing pages, blocks, dynamic blocks, product attributes, and category descriptions. For example, you can save an existing Page Builder CMS page as a template and then apply that template (with all its content and layouts) to quickly create new CMS Pages for your site. This new feature is documented here: [Templates](https://docs.magento.com/m2/ee/user_guide/cms/page-builder-templates.html).

{:.new}**Content type upgrade library**

We can now introduce new versions of Page Builder content types without introducing backward-incompatible issues with previous versions. Prior to this release, significant changes to content type configurations would create display and data-loss issues with previously saved Page Builder content types. Our new upgrade library eliminates these issues. The library upgrades previous versions of content types saved to the database to match the configuration changes of the new versions. The new upgrade library is documented here: [Upgrading content types](https://devdocs.magento.com/page-builder/docs/how-to/how-to-upgrade-content-types.html){:data-proofer-ignore='true'}.

{: .bs-callout .bs-callout-info }
Page Builder automatically runs the upgrade library on each new release to ensure that the _native_ Page Builder content types are always upgraded to match any changes made to content types for a new release. However, to upgrade previous versions of your _custom_ Page Builder content types requires additional development, as noted in the previous documentation link.

{:.new}**Documentation on adding new Appearances**

Everything you need to know about [adding appearances](https://devdocs.magento.com/page-builder/docs/how-to/how-to-add-appearance.html) for existing or custom content types.

**Various fixes**

- {:.fix}<!-- PB-50 -->Fixed an issue where the TinyMCE menu for slide content appears underneath other content types if the parent container of the slide is duplicated.
- {:.fix}<!-- PB-154 -->Updated Page Builder `npm` dependencies due to the high number of vulnerabilities.
- {:.fix}<!-- PB-166 -->Updated Page Builder to implement destroy method to prevent memory leaks in some scenarios.
- {:.fix}<!-- PB-170 -->Improved TinyMCE performance when multiple instances are used on the Admin stage.
- {:.fix}<!-- PB-252 -->Fixed an issue in which the Dynamic Block content type does not render on the Admin stage if the top row is marked as hidden.
- {:.fix}<!-- PB-273 -->Removed 200ms delay from content type option menus & toolbars. In some cases, the delay made it difficult to interact with nested content items.
- {:.fix}<!-- PB-284 -->Fixed an issue in which live edit fields (as used in Heading, Tabs, Button content types) would execute harmful XSS, even though the harmful code would not be persisted.
- {:.fix}<!-- PB-294 -->Fixed an issue in which the currency symbol was being escaped improperly in the Product List widget within the Block/Dynamic Block on the Admin stage.
- {:.fix}<!-- PB-296 -->Fixed an issue in which the product total on the Page Builder edit panel did not work for custom MSI stock products.
- {:.fix}<!-- PB-317 -->Fixed an issue in which saving Page Builder content with background images on Microsoft Edge does not render those images on the storefront.
- {:.fix}<!-- PB-390 -->Fixed an issue in which nested Page Builder content fails to save if users click the Save button before the page fully renders.
- {:.fix}<!-- PB-418 -->Fixed data collection failures caused by an error in `ContentTypeUsageReportProvider`.

## **1.2.0** for Magento Commerce 2.3.4

**Page Builder integration with PWA Studio**

- {:.new}Added Page Builder content rendering to the Venia app in PWA Studio. Page Builder content can now be viewed within the PWA Studio Venia app. See the Page Builder documentation within [PWA Studio][] for all the information on this new feature.

**Products content type enhancements**

- {:.new}<!-- PB-77, PB-173, PB-175 -->Added Product carousel. The Products content type now provides an option to display your products in a carousel / slider format, including several options to customize the carousel to your needs.
- {:.new}<!-- PB-69 -->Added Product SKU sorting. The Products content type now provides an option to sort your products by SKU in the order you add them to a list within the Admin.
- {:.new}<!-- PB-181 -->Added Product Category sorting. The Products content type now provides an option to sort your products by category _position_, displaying them in same order that they appear within your Magento Catalog.
- {:.new}<!-- PB-107 -->Added Product selection totals. The Products content type Admin editor now displays the total number of products that match your product selection options.

**Various fixes**

- {:.fix}<!-- PB-237 -->Security enhancements.
- {:.fix}<!-- PB-41 -->Fixed searches within UI select components to make only one AJAX request per search term.
- {:.fix}<!-- PB-76, PB-84-->Updated Product previews in the Admin to match the storefront, including the star rating, color, and size options of the product when relevant.
- {:.fix}<!-- PB-169 -->Fixed an issue in which Page Builder could not be saved when Magento's JavaScript minification and bundling are enabled.
- {:.fix}<!-- PB-241 -->Fixed the Admin previews of Products, Blocks, and Dynamic Blocks to render correctly on Magento installations that define different URLs for the Admin and the frontend.
- {:.fix}<!-- PB-238 -->Fixed the Admin previews of Products, Blocks, and Dynamic Blocks to render correctly on Magento installations with B2B installed with the "Login Only" option enabled. Prior to this fix, the Page Builder preview would cause the page to redirect to the customer account login.
- {:.fix}<!-- PB-239 -->Fixed a session error that can occur when previewing a large page in the Page Builder Admin.
- {:.fix}<!-- PB-248 -->Updated Page Builder LESS styles to prevent storefront style duplication.

## **1.1.1** for Magento Commerce 2.3.3-p1

- {:.new}Security enhancements.


## **1.1.0** for Magento Commerce 2.3.3

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

## **1.0.3** for Magento Commerce 2.3.2-p2

- {:.new}Security enhancements.

## **1.0.2** for Magento Commerce 2.3.2-p1

- {:.new}Security enhancements.

## **1.0.1** for Magento Commerce 2.3.2

- {:.new}Ensures compatibility with Magento Commerce 2.3.2.

## **1.0.0** for Magento Commerce 2.3.1

- {:.new}General availability release!

### Documentation

To learn more about Page Builder and Page Builder development:

- For developers: [What is Page Builder?](https://devdocs.magento.com/page-builder/docs/index.html)
- For end-users: [Page Builder User Guide](https://docs.magento.com/m2/ee/user_guide/cms/page-builder.html)


[PWA Studio]: https://magento.github.io/pwa-studio/