/*eslint-disable */
/* jscs:disable */
define(["knockout"], function (_knockout) {
  "use strict";

  _knockout = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  _knockout.default.bindingHandlers.hasFocusNoScroll = {
    init: _knockout.default.bindingHandlers.hasFocus.init,
    update: function update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = !!_knockout.default.utils.unwrapObservable(valueAccessor());
      value ? element.focus({
        preventScroll: true
      }) : element.blur();
    }
  };
});
//# sourceMappingURL=focus.js.map