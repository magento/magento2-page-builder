/*eslint-disable */
/* jscs:disable */
define(["jquery", "mage/translate", "Magento_PageBuilder/js/modal/dismissible-confirm"], function (_jquery, _translate, _dismissibleConfirm) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Validate inline editor for having nested link
   * Creates a dialog and removes inline editor link if present
   *
   * @param {DataStore} dataStore
   * @param {WysiwygInterface} wysiwyg
   * @param {string} inlineMessageField
   * @param {string} linkUrlField
   */
  function nestingLinkDialog(dataStore, wysiwyg, inlineMessageField, linkUrlField) {
    var dataStoreContent = dataStore.getState();
    var inlineMessage = dataStoreContent[inlineMessageField];
    var linkUrl = dataStoreContent[linkUrlField];
    var aLinkRegex = /(<a[\s]+[^>]+).+(?=<\/a>)<\/a>/igm;

    if (wysiwyg && inlineMessage.match(aLinkRegex) && linkUrl && ["page", "product", "category", "default"].indexOf(linkUrl.type) !== -1 && linkUrl[linkUrl.type] && linkUrl[linkUrl.type].length !== 0) {
      var inlineEditor = (0, _jquery)("#" + wysiwyg.elementId);
      inlineEditor.trigger("blur");
      (0, _dismissibleConfirm)({
        actions: {
          always: function always() {
            var anchorLessDataStoreMessage = inlineMessage.replace(aLinkRegex, "");
            var anchorLessInlineMessage = inlineEditor.html().replace(aLinkRegex, "");
            dataStore.set(inlineMessageField, anchorLessDataStoreMessage);
            inlineEditor.html(anchorLessInlineMessage);
          }
        },
        content: (0, _translate)("We are unable to support links within the content field whilst having a link set on the content type. Please remove the content type link if you'd like to set a link within the content. We will automatically remove the links within the content field."),
        // tslint:disable-line:max-line-length
        title: (0, _translate)("Nested links are not allowed"),
        haveCancelButton: false
      });
    }
  }

  return nestingLinkDialog;
});
//# sourceMappingURL=nesting-link-dialog.js.map