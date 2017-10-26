define(["underscore", "knockout"], function (_underscore, _knockout) {
  /**
   * PreviewBlock class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
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

      Object.defineProperty(this, "template", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: ''
      });
      Object.defineProperty(this, "parent", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "config", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "data", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: {}
      });
      this.parent = parent;
      this.config = config;

      if (typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
        this.template = this.config.preview_template;
      } // Subscribe to this blocks data in the store


      this.parent.stage.store.subscribe(function (data) {
        var missingFields = _underscore.difference(_this.config.fields_list, _underscore.keys(data));

        missingFields.forEach(function (key) {
          _this.updateDataValue(key, '');
        });

        _underscore.forEach(data, function (value, key) {
          _this.updateDataValue(key, value);
        });
      }, this.parent.id);
    }
    /**
     * Update the data value of a part of our internal Knockout data store
     *
     * @param {string} key
     * @param value
     */


    var _proto = PreviewBlock.prototype;

    _proto.updateDataValue = function updateDataValue(key, value) {
      if (typeof this.data[key] !== 'undefined' && _knockout.isObservable(this.data[key])) {
        this.data[key](value);
      } else {
        this.data[key] = _knockout.observable(value);
      }
    };

    return PreviewBlock;
  }();

  return PreviewBlock;
});