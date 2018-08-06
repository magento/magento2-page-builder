/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/resource/jarallax/jarallax.min", "Magento_PageBuilder/js/resource/resize-observer/ResizeObserver.min", "underscore", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _events, _jarallax, _ResizeObserver, _underscore, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    /**
     * Debounce and defer the init of Jarallax
     *
     * @type {(() => void) & _.Cancelable}
     */

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _PreviewCollection.call(this, parent, config, observableUpdater) || this;
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
              imgPosition: _this.data.main.style().backgroundPosition || "50% 50%",
              imgRepeat: _this.data.main.style().backgroundRepeat === "0" ? "no-repeat" : "repeat",
              imgSize: _this.data.main.style().backgroundSize || "cover",
              speed: _this.data.main.attributes()["data-parallax-speed"] || 0.5
            });
            jarallax(_this.element, "onResize");
          });
        }
      }, 50);

      _this.parent.dataStore.subscribe(_this.buildJarallax);

      _events.on("row:mountAfter", function (args) {
        if (args.id === _this.parent.id) {
          _this.buildJarallax(); // Disable the remove option when there is only a single row


          var removeOption = _this.getOptions().getOption("remove");

          _this.parent.parent.children.subscribe(function (children) {
            removeOption.is_disabled(children.length < 2);
          });
        }
      });

      _events.on("contentType:mountAfter", function (args) {
        if (args.contentType.parent.id === _this.parent.id) {
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


    var _proto = Preview.prototype;

    _proto.initParallax = function initParallax(element) {
      var _this2 = this;

      this.element = element;

      _underscore.defer(function () {
        _this2.buildJarallax();
      });

      new _ResizeObserver(function () {
        // Observe for resizes of the element and force jarallax to display correctly
        if ((0, _jquery)(_this2.element).hasClass("jarallax")) {
          jarallax(_this2.element, "onResize");
          jarallax(_this2.element, "onScroll");
        }
      }).observe(this.element);
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
