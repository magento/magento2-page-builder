/*eslint-disable */
/* jscs:disable */
define(["jquery", "knockout"], function (_jquery, _knockout) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  // Create a new sortable Knockout binding
  _knockout.default.bindingHandlers.draggable = {
    init: function init(element, valueAccessor) {
      (0, _jquery.default)(element).draggable(valueAccessor());
    }
  };
});
//# sourceMappingURL=draggable.js.map