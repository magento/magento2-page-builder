/*eslint-disable */
define(["knockout"], function (_knockout) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Group =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * Group constructor
     *
     * @param id
     * @param group
     * @param contentTypes
     *
     * @todo change group type
     */
    function Group(id, group, contentTypes) {
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
      this.code(group.code);
      this.label(group.label);
      this.icon(group.icon);
      this.sort(group.sort);
      this.contentTypes(contentTypes);
    }
    /**
     * Toggle the group
     */


    var _proto = Group.prototype;

    _proto.toggle = function toggle() {
      this.active(!this.active());
    };

    return Group;
  }();

  return {
    Group: Group
  };
});
//# sourceMappingURL=group.js.map
