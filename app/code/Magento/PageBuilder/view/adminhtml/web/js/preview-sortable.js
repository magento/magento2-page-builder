/*eslint-disable */
define(["jquery", "knockout", "uiEvents", "Magento_PageBuilder/js/utils/array"], function (_jquery, _knockout, _uiEvents, _array) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _uiEvents = _interopRequireDefault(_uiEvents);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  // Create a new sortable Knockout binding
  _knockout.default.bindingHandlers.previewSortable = {
    /**
     * Init the draggable binding on an element
     *
     * @param element
     * @param valueAccessor
     * @param allBindingsAccessor
     * @param data
     * @param context
     */
    init: function init(element, valueAccessor, allBindingsAccessor, data, context) {
      var instance = context.$data.parent;

      var options = _knockout.default.unwrap(valueAccessor());

      var originalPosition;
      (0, _jquery.default)(element).sortable(options).on("sortstart", function (event, ui) {
        event.stopPropagation();
        originalPosition = ui.item.index();

        _uiEvents.default.trigger("previewSortable:sortstart", {
          instance: instance,
          originalPosition: originalPosition,
          ui: ui
        });
      }).on("sortupdate", function (event, ui) {
        var index = ui.item.index();
        (0, _array.moveArrayItem)(instance.children, originalPosition, index);

        _uiEvents.default.trigger("previewSortable:sortupdate", {
          instance: instance,
          newPosition: index,
          originalPosition: originalPosition,
          ui: ui
        });
      });
    }
  };
});
//# sourceMappingURL=preview-sortable.js.map
