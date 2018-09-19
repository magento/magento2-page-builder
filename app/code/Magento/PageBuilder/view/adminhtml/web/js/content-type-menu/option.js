/*eslint-disable */
define(["knockout"], function (_knockout) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Option =
  /*#__PURE__*/
  function () {
    /**
     * @param {OptionConfigInterface} config
     */
    function Option(config) {
      var _this = this;

      Object.defineProperty(this, "config", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "preview", {
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
        value: _knockout.observable("")
      });
      Object.defineProperty(this, "title", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable("")
      });
      Object.defineProperty(this, "classes", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable({})
      });
      Object.defineProperty(this, "sort", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "action", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "isDisabled", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable(false)
      });
      Object.defineProperty(this, "customTemplate", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      this.config = config;
      this.preview = config.preview;
      this.icon(config.icon);
      this.title(config.title);
      this.code = config.code;
      this.sort = config.sort || 0;
      this.customTemplate = config.template; // Generate an array of classes for KO to consume

      var koClasses = {};

      if (config.classes && config.classes.length > 0) {
        config.classes.forEach(function (cssClass) {
          koClasses[cssClass] = true;
        });
      } // Always add a disabled class which tracks whether this option is disabled


      koClasses.disabled = this.isDisabled;
      this.classes(koClasses); // If no action is supplied pass an empty function, this is called within the context of the preview

      var action = config.action ? config.action : function () {
        return;
      };

      this.action = function () {
        if (!_this.isDisabled()) {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          action.apply(_this.preview, args);
        }
      };
    }

    _createClass(Option, [{
      key: "template",
      get: function get() {
        return this.customTemplate || null;
      }
    }]);

    return Option;
  }();

  return Option;
});
//# sourceMappingURL=option.js.map
