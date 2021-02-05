/*eslint-disable */
/* jscs:disable */
define(["knockout"], function (_knockout) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Menu = /*#__PURE__*/function () {
    "use strict";

    /**
     * Menu constructor
     *
     * @param id
     * @param menu
     * @param contentTypes
     * @param stageId
     */
    function Menu(id, menu, contentTypes, stageId) {
      if (contentTypes === void 0) {
        contentTypes = [];
      }

      this.hidden = _knockout.observable(false);
      this.id = _knockout.observable();
      this.code = _knockout.observable("");
      this.label = _knockout.observable("");
      this.icon = _knockout.observable("");
      this.sort = _knockout.observable();
      this.contentTypes = _knockout.observableArray([]);
      this.active = _knockout.observable(false);
      this.id(id);
      this.code(menu.code);
      this.label(menu.label);
      this.icon(menu.icon);
      this.sort(menu.sort);
      this.contentTypes(contentTypes);
      this.stageId = stageId;
    }
    /**
     * Toggle the menu
     */


    var _proto = Menu.prototype;

    _proto.toggle = function toggle() {
      this.active(!this.active());
    };

    return Menu;
  }();

  return {
    Menu: Menu
  };
});
//# sourceMappingURL=menu.js.map