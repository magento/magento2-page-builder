/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/utils/array", "Magento_PageBuilder/js/component/event-bus"], function (_jquery, _knockout, _array, _eventBus) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _eventBus = _interopRequireDefault(_eventBus);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      var instance = context.$data;

      var options = _knockout.default.unwrap(valueAccessor());

      var originalPosition;
      (0, _jquery.default)(element).sortable(options).on("sortstart", function (event, ui) {
        originalPosition = ui.item.index();

        _eventBus.default.trigger("previewSortable:sortstart", {
          instance: instance,
          originalPosition: originalPosition,
          ui: ui
        });
      }).on("sortupdate", function (event, ui) {
        var index = ui.item.index();

        if (originalPosition !== index) {
          ui.item.remove();
          (0, _array.moveArrayItem)(instance.children, originalPosition, index);

          _eventBus.default.trigger("previewSortable:sortupdate", {
            instance: instance,
            newPosition: index,
            originalPosition: originalPosition,
            ui: ui
          });
        }
      });
    }
  };
});
//# sourceMappingURL=binding.js.map
