/*eslint-disable */
define(["knockout"], function (_knockout) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Option =
  /*#__PURE__*/
  function () {
    /**
     * @param {Preview} parent
     * @param {string} code
     * @param {string} icon
     * @param {string} title
     * @param {() => void} action
     * @param {string[]} classes
     * @param {number} sort
     * @param {string} optionTemplate
     */
    function Option(parent, code, icon, title, action, classes, sort, optionTemplate) {
      this.classes = _knockout.observable({});
      this.code = void 0;
      this.icon = _knockout.observable("");
      this.parent = void 0;
      this.sort = void 0;
      this.title = _knockout.observable("");
      this.action = void 0;
      this.optionTemplate = void 0;
      this.parent = parent;
      this.code = code;
      this.icon(icon);
      this.title(title);

      if (action) {
        this.action = action;
      } else {
        this.action = function () {
          return;
        };
      }

      var koClasses = {};
      classes.forEach(function (cssClass) {
        koClasses[cssClass] = true;
      });
      this.classes(koClasses);
      this.sort = sort;
      this.optionTemplate = optionTemplate;
    }

    var _proto = Option.prototype;

    /**
     * Bind events for the option menu item
     */
    _proto.bindEvents = function bindEvents() {// Bind any events required by the option menu item
    };

    _createClass(Option, [{
      key: "template",
      get: function get() {
        return this.optionTemplate || null;
      }
    }]);

    return Option;
  }();

  return Option;
});
//# sourceMappingURL=option.js.map
