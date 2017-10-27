define([], function () {
  /**
   * Option Class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Option =
  /*#__PURE__*/
  function () {
    /**
     * Option constructor
     *
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param action
     * @param classes
     * @param sort
     * @param template
     */
    function Option(parent, code, icon, title, action, classes, sort, template) {
      Object.defineProperty(this, "parent", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "code", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "icon", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "title", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "action", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: false
      });
      Object.defineProperty(this, "classes", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "sort", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "template", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: null
      });
      this.parent = parent;
      this.code = code;
      this.icon = icon;
      this.title = title;
      this.action = action;
      this.classes = classes.join(' ');
      this.sort = sort;
      this.template = template;
    }
    /**
     * Return template for option
     *
     * @deprecated
     * @returns {string}
     */


    var _proto = Option.prototype;

    _proto.getTemplate = function getTemplate() {
      return this.template;
    };

    return Option;
  }();

  return {
    Option: Option
  };
});