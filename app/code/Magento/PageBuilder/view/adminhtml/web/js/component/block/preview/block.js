/*eslint-disable */
define(["jquery", "knockout", "underscore", "../../format/style-attribute-filter", "../../format/style-attribute-mapper"], function (_jquery, _knockout, _underscore, _styleAttributeFilter, _styleAttributeMapper) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var PreviewBlock =
  /*#__PURE__*/
  function () {
    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {object} config
     */
    function PreviewBlock(parent, config) {
      var _this = this;

      this.parent = void 0;
      this.config = void 0;
      this.data = {};
      this.previewStyle = void 0;
      var styleAttributeMapper = new _styleAttributeMapper();
      var styleAttributeFilter = new _styleAttributeFilter();
      this.parent = parent;
      this.config = config || {};
      this.setupDataFields(); // Calculate the preview style utilising the style attribute mapper & appearance system

      this.previewStyle = _knockout.computed(function () {
        var data = _underscore.mapObject(_this.data, function (value) {
          if (_knockout.isObservable(value)) {
            return value();
          }

          return value;
        });

        if (typeof data.appearance !== "undefined" && typeof config.appearances !== "undefined" && typeof config.appearances[data.appearance] !== "undefined") {
          _underscore.extend(data, config.appearances[data.appearance]);
        } // Extract data values our of observable functions


        return _this.afterStyleMapped(styleAttributeMapper.toDom(styleAttributeFilter.filter(data)));
      });
      Object.keys(styleAttributeFilter.getAllowedAttributes()).forEach(function (key) {
        if (_knockout.isObservable(_this.data[key])) {
          _this.data[key].subscribe(function () {
            _this.previewStyle.notifySubscribers();
          });
        }
      });
    }
    /**
     * Retrieve the template for the preview block
     *
     * @returns {string}
     */


    var _proto = PreviewBlock.prototype;

    /**
     * Update the data value of a part of our internal Knockout data store
     *
     * @param {string} key
     * @param value
     */
    _proto.updateDataValue = function updateDataValue(key, value) {
      if (typeof this.data[key] !== "undefined" && _knockout.isObservable(this.data[key])) {
        this.data[key](value);
      } else {
        if (_underscore.isArray(value)) {
          this.data[key] = _knockout.observableArray(value);
        } else {
          this.data[key] = _knockout.observable(value);
        }
      }
    };
    /**
     * Set state based on mouseover event for the preview
     */


    _proto.onMouseOver = function onMouseOver(data, event) {
      var currentTarget = event.currentTarget;
      var optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper").first();

      if ((0, _jquery)(currentTarget).hasClass("type-nested")) {
        optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper");
      }

      optionsMenu.addClass("pagebuilder-options-visible");
      (0, _jquery)(currentTarget).addClass("pagebuilder-content-type-active");
    };
    /**
     * Set state based on mouseout event for the preview
     */


    _proto.onMouseOut = function onMouseOut(data, event) {
      var currentTarget = event.currentTarget;
      var optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper").first();

      if ((0, _jquery)(currentTarget).hasClass("type-nested")) {
        optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper");
      }

      optionsMenu.removeClass("pagebuilder-options-visible");
      (0, _jquery)(currentTarget).removeClass("pagebuilder-content-type-active");
    };
    /**
     * Setup fields observables within the data class property
     */


    _proto.setupDataFields = function setupDataFields() {
      var _this2 = this;

      // Create an empty observable for all fields
      if (this.config.fields) {
        _underscore.keys(this.config.fields).forEach(function (key) {
          _this2.updateDataValue(key, "");
        });
      } // Subscribe to this blocks data in the store


      this.parent.stage.store.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          _this2.updateDataValue(key, value);
        });
      }, this.parent.id);
    };
    /**
     * Callback function to update the styles are mapped
     *
     * @param {StyleAttributeMapperResult} styles
     * @returns {StyleAttributeMapperResult}
     */


    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      return styles;
    };

    _createClass(PreviewBlock, [{
      key: "template",
      get: function get() {
        if (this.config.preview_template) {
          return this.config.preview_template;
        }

        return "";
      }
    }]);

    return PreviewBlock;
  }();

  return PreviewBlock;
});
//# sourceMappingURL=block.js.map
