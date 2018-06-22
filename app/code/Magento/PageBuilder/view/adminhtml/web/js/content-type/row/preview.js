/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/resource/jarallax/jarallax.min", "Magento_PageBuilder/js/resource/resize-observer/ResizeObserver.min", "underscore", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _translate, _jarallax, _ResizeObserver, _underscore, _option, _events, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

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

      _events.on("row:contentType:ready", function (args) {
        if (args.id === _this.parent.id) {
          _this.buildJarallax();
        }
      });

      _events.on("contentType:mount", function (args) {
        if (args.contentType.parent.id === _this.parent.id) {
          _this.buildJarallax();
        }
      });

      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */


    var _proto = Preview.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];
      var removeFn = this.onOptionRemove;

      if (this.parent.parent.children().length < 2) {
        removeFn = function removeFn() {
          return;
        };

        removeClasses.push("disabled");
      }

      newOptions.push(new _option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };
    /**
     * Init the parallax element
     *
     * @param {Element} element
     */


    _proto.initParallax = function initParallax(element) {
      var _this2 = this;

      this.element = element;
      this.buildJarallax(); // Observe for resizes of the element and force jarallax to display correctly

      if ((0, _jquery)(this.element).hasClass("jarallax")) {
        new _ResizeObserver(function () {
          jarallax(_this2.element, "onResize");
          jarallax(_this2.element, "onScroll");
        }).observe(this.element);
      }
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
