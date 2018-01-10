/*eslint-disable */
define(["knockout", "underscore"], function (_knockout, _underscore) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var PreviewBlock =
  /*#__PURE__*/
  function () {
    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function PreviewBlock(parent, config) {
      var _this = this;

      this.parent = void 0;
      this.config = void 0;
      this.data = {};
      this.parent = parent;
      this.config = config; // Create an empty observable for all fields

      if (this.config.fields) {
        _underscore.keys(this.config.fields).forEach(function (key) {
          _this.updateDataValue(key, "");
        });
      } // Subscribe to this blocks data in the store


      this.parent.stage.store.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          _this.updateDataValue(key, value);
        });
      }, this.parent.id);
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
