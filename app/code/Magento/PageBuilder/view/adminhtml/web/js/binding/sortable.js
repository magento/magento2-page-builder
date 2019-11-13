/*eslint-disable */
/* jscs:disable */
define(["jquery", "knockout", "underscore"], function (_jquery, _knockout, _underscore) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _underscore = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  // Create a new sortable Knockout binding
  _knockout.default.bindingHandlers.sortable = {
    init: function init(element, valueAccessor) {
      // As we can't conditionally apply bindings we block this operation when options are null
      if (valueAccessor() === null) {
        return;
      }

      _underscore.default.defer(function () {
        (0, _jquery.default)(element).sortable(valueAccessor());
      });
    }
  };
});
//# sourceMappingURL=sortable.js.map