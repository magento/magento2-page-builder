/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/resource/jarallax/jarallax.min", "underscore", "../../event-bus", "./block"], function (_jquery, _knockout, _jarallax, _underscore, _eventBus, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    /**
     * Debounce and defer the init of Jarallax
     *
     * @type {(() => void) & _.Cancelable}
     */

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Row(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.getChildren = void 0;
      _this.wrapClass = _knockout.observable(false);
      _this.element = void 0;
      _this.buildJarallax = _underscore.debounce(function () {
        // Destroy all instances of the plugin prior
        try {
          jarallax(_this.element, "destroy");
        } catch (e) {// Failure of destroying is acceptable
        }

        if (_this.element && (0, _jquery)(_this.element).hasClass("jarallax")) {
          _underscore.defer(function () {
            // Build Parallax on elements with the correct class
            jarallax(_this.element, {
              imgPosition: _this.data.background_position() || "50% 50%",
              imgRepeat: _this.data.background_repeat() === "0" ? "no-repeat" : "repeat",
              imgSize: _this.data.background_size() || "cover",
              speed: _this.data.parallax_speed() || 0.5
            });
          });
        }
      }, 50);

      _this.parent.stage.store.subscribe(_this.buildJarallax);

      _eventBus.on("row:block:ready", function (event, params) {
        if (params.id === _this.parent.id) {
          _this.buildJarallax();
        }
      });

      _eventBus.on("block:mount", function (event, params) {
        if (params.block.parent.id === _this.parent.id) {
          _this.buildJarallax();
        }
      });

      return _this;
    }
    /**
     * Init the parallax element
     *
     * @param {Element} element
     */


    var _proto = Row.prototype;

    _proto.initParallax = function initParallax(element) {
      this.element = element;
      this.buildJarallax();
    };
    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */


    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      // The style attribute mapper converts images to directives, override it to include the correct URL
      if (this.data.background_image && _typeof(this.data.background_image()[0]) === "object") {
        styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
      } // If the bottom margin is 0, we set it to 1px to overlap the rows to create a single border


      if (styles.marginBottom === "0px") {
        styles.marginBottom = "1px";
      } // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles


      if (this.data.border && this.data.border() === "_default") {
        styles.border = "none";
      }

      return styles;
    };

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
