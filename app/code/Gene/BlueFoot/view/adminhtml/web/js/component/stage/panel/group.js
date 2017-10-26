define(["knockout"], function (_knockout) {
  /**
   * Group Class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Group =
  /*#__PURE__*/
  function () {
    /**
     * Group constructor
     *
     * @param id
     * @param group
     * @param blocks
     *
     * @todo change group type
     */
    function Group(id, group, blocks) {
      if (blocks === void 0) {
        blocks = [];
      }

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
        value: _knockout.observable('')
      });
      Object.defineProperty(this, "label", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable('')
      });
      Object.defineProperty(this, "icon", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable('')
      });
      Object.defineProperty(this, "sort", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable()
      });
      Object.defineProperty(this, "blocks", {
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
      Object.defineProperty(this, "hidden", {
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
      this.blocks(blocks);
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