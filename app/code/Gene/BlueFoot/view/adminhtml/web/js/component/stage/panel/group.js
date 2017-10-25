define(["knockout"], function (_knockout) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    function Group(id, group) {
      var blocks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      _classCallCheck(this, Group);

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


    _createClass(Group, [{
      key: "toggle",
      value: function toggle() {
        this.active(!this.active());
      }
    }]);

    return Group;
  }();

  return {
    Group: Group
  };
});
//# sourceMappingURL=group.js.map
