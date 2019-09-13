# Release note for Page Builder

The following updates describe the latest improvements to Page Builder.

The release notes include:

- {:.new}New features
- {:.fix}Fixes and improvements

## 1.1.0

- {:.new}<!-- MC-15250 -->Added explicit product sorting to the Products content type.

- {:.new}<!-- MC-17823 -->Added buttons for inserting images, widgets, and variables in the HTML content type.

- {:.new}<!-- MC-1805 -->Upgraded Page Builder to PHP version 7.3.

- {:.fix}<!-- MC-3880 -->Fixed an issue in which the minimum height & vertical alignment was inconsistent between sections On the edit panel for each content type.

- {:.fix}<!-- MC-4137 -->Fixed several TinyMCE inline editor issues. Variables, images, & image links now get added where cursor is placed; tables and table cells can now be center aligned; copy/paste pastes content at the cursor's position; links can now be applied to selected text; bullets are now properly aligned; editor changes are now saved without first clicking outside the editor.
 
- {:.fix}<!-- MC-14994 -->Fixed an issue in which the toolbar from the Heading content type was positioned incorrectly when first dropped on the stage.

- {:.fix}<!-- MC-15742 -->Removed the hard-coded 35px from the bottom of the Slider content type.

- {:.fix}<!-- MC-15812 -->Removed the hard-code 5px from the bottom of the Video content type.

- {:.fix}<!-- MC-16241 -->Fixed an issue in which the required asterisk symbol was displayed twice on form fields.

- {:.fix}<!-- MC-18799 -->Restricted Page Builder 1.1.0 to Magento 2.3.3+.

## 1.0.2

- {:.fix}<!-- MC-18723 -->Restricted Page Builder 1.0.2 to Magento 2.3.2.1+.

- {:.fix}<!-- MC-19192 -->Backported Page Builder TinyMCE performance fix from 1.1.0-release.

## 1.0.1

- {:.fix}Ensures compatibility with Magento Commerce 2.3.2.

## 1.0.0

- {:.new}General availability release!

### Documentation

To learn more about Page Builder and Page Builder development:

- For developers: [What is Page Builder?](https://devdocs.magento.com/page-builder/docs/index.html)
- For end-users: [Page Builder User Guide](https://docs.magento.com/m2/ee/user_guide/cms/page-builder.html)
