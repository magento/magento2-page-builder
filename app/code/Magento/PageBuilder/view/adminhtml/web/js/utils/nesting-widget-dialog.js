/*eslint-disable */
/* jscs:disable */
define(["jquery", "mage/translate", "Magento_PageBuilder/js/modal/dismissible-confirm"], function (_jquery, _translate, _dismissibleConfirm) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Validate inline editor for having nested widget
   * Creates a dialog and removes inline editor widget if present
   *
   * @param {DataStore} dataStore
   * @param {WysiwygInterface} wysiwyg
   * @param {string} inlineMessageField
   * @param {string} linkUrlField
   */
  function nestingWidgetDialog(dataStore, wysiwyg, inlineMessageField, linkUrlField) {
    var dataStoreContent = dataStore.getState();
    var inlineMessage = dataStoreContent[inlineMessageField];
    var linkUrl = dataStoreContent[linkUrlField];
    var widgetRegex = /\{\{widget(.*?)\}\}/ig;
    var widgetPlaceholderRegex = /<span.*(class=)(\"|\').*((magento-placeholder).*(magento-widget)|(magento-widget).*(magento-placeholder)).*<\/span>/igm;

    if (wysiwyg && inlineMessage.match(widgetRegex) && linkUrl && ["page", "product", "category", "default"].indexOf(linkUrl.type) !== -1 && linkUrl[linkUrl.type] && linkUrl[linkUrl.type].length !== 0) {
      var inlineEditor = (0, _jquery)("#" + wysiwyg.elementId);
      inlineEditor.blur();
      (0, _dismissibleConfirm)({
        actions: {
          always: function always() {
            var widgetLessDataStoreMessage = inlineMessage.replace(widgetRegex, "");
            var widgetLessInlineMessage = inlineEditor.html().replace(widgetPlaceholderRegex, "");
            dataStore.set(inlineMessageField, widgetLessDataStoreMessage);
            inlineEditor.html(widgetLessInlineMessage);
          }
        },
        content: (0, _translate)("We are unable to support widget within the content field whilst having a link set on the content type. Please remove the content type link if you'd like to set a widget within the content. We will automatically remove the widget within the content field."),
        // tslint:disable-line:max-line-length
        title: (0, _translate)("Nested widgets are not allowed"),
        haveCancelButton: false
      });
    }
  }

  return nestingWidgetDialog;
});
//# sourceMappingURL=nesting-widget-dialog.js.map