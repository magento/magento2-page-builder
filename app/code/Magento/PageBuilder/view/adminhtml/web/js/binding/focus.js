/*eslint-disable */
define(["knockout", "Magento_Ui/js/lib/knockout/template/renderer"], function (_knockout, _renderer) {
  "use strict";

  _knockout = _interopRequireDefault(_knockout);
  _renderer = _interopRequireDefault(_renderer);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * The hasFocusNoScroll binding allows inline editing.
   * Source: <Magento_Pagebuilder_module_dir>/view/adminhtml/web/js/binding/focus. See on Github.
   * Value type: Object.
   * Configuration for the hasFocusNoScroll widget.
   * Aliases: [ko-pagebuilder-noscrollonfocus]
   * Usage example:
   * <div ko-pagebuilder-noscrollonfocus="parent.parent.preview.focusedTab() === $index()"></div>
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

  _renderer.default.addAttribute('hasFocusNoScroll', {
    name: 'ko-pagebuilder-noscrollonfocus'
  });
});
//# sourceMappingURL=focus.js.map
