/*eslint-disable */
define(["jquery", "mage/translate", "Magento_PageBuilder/js/modal/dismissible-confirm"], function (_jquery, _translate, _dismissibleConfirm) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Validate inline editor for having nested link
   * Creates a dialog and removes inline editor link if present
   *
   * @param {DataObject} dataStore
   * @param {WysiwygInterface} wysiwyg
   * @param {string} inlineMessageField
   * @param {string} linkUrlField
   */
  function nestingLinkDialog(dataStore, wysiwyg, inlineMessageField, linkUrlField) {
    var dataStoreContent = dataStore.get();
    var inlineMessage = dataStoreContent[inlineMessageField];
    var linkUrl = dataStoreContent[linkUrlField];
    var aLinkRegex = /<a[\s]+([^>]+)>|<a>|<\/a>/igm;

    if (inlineMessage.match(aLinkRegex) && linkUrl && ["page", "product", "category", "default"].indexOf(linkUrl.type) !== -1 && linkUrl[linkUrl.type] && linkUrl[linkUrl.type].length !== 0) {
      (0, _dismissibleConfirm)({
        actions: {
          always: function always() {
            var anchorLessInlineMessage = inlineMessage.replace(aLinkRegex, "");
            dataStore.update(anchorLessInlineMessage, inlineMessageField);
            (0, _jquery)("#" + wysiwyg.elementId).html(anchorLessInlineMessage);
          }
        },
        content: (0, _translate)("Adding link in content and outer element is not allowed. Remove the link from the element before adding links to the content."),
        // tslint:disable-line:max-line-length
        title: (0, _translate)("Nesting links are not allowed"),
        haveCancelButton: false
      });
    }
  }

  return nestingLinkDialog;
});
//# sourceMappingURL=nesting-link-dialog.js.map
