/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/resource/jarallax/jarallax", "underscore", "./block"], function (_jquery, _knockout, _jarallax, _underscore, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    // private childSubscribe: KnockoutSubscription;

    /**
     * Assign a debounce and delay to the init of Jarallax to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Row(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this; // this.childSubscribe = this.parent.children.subscribe(this.buildJarallax);
      // this.parent.stage.store.subscribe(this.buildJarallax);

      _this.getChildren = void 0;
      _this.wrapClass = _knockout.observable(false);
      _this.element = void 0;
      _this.buildJarallax = _underscore.debounce(function () {
        if (_this.element && _this.element.hasClass("jarallax")) {
          // Build Parallax
          (0, _jquery)(_this.element).jarallax(_this.buildJarallaxConfig());
        }
      }, 10);
      return _this;
    }
    /**
     * Capture an after render event
     */


    var _proto = Row.prototype;

    _proto.onAfterRender = function onAfterRender(row) {
      this.element = (0, _jquery)(row).closest(".pagebuilder-row");
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
    /**
     * Build the Jarallax config object
     *
     * @returns {{imgPosition: string; imgRepeat: string;
     * imgSize: string; speed: (any | number);}}
     */


    _proto.buildJarallaxConfig = function buildJarallaxConfig() {
      return {
        imgPosition: this.data.background_position() || "50% 50%",
        imgRepeat: this.data.background_repeat() || "no-repeat",
        imgSize: this.data.background_size() || "cover",
        speed: this.data.parallax_speed() || 0.5
      };
    };

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
