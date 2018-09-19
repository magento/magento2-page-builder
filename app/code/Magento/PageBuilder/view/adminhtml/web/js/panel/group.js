/*eslint-disable */
define(["knockout"], function (_knockout) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Group =
  /*#__PURE__*/
  function () {
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

      Object.defineProperty(this, "hidden", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable(false)
      });
      Object.defineProperty(this, "id", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable()
      });
      Object.defineProperty(this, "code", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable("")
      });
      Object.defineProperty(this, "label", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable("")
      });
      Object.defineProperty(this, "icon", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable("")
      });
      Object.defineProperty(this, "sort", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable()
      });
      Object.defineProperty(this, "contentTypes", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observableArray([])
      });
      Object.defineProperty(this, "active", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable(false)
      });
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
