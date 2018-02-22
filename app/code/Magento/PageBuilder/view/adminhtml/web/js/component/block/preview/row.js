/*eslint-disable */
define(["knockout", "underscore", "../../format/style-attribute-filter", "../../format/style-attribute-mapper", "./block"], function (_knockout, _underscore, _styleAttributeFilter, _styleAttributeMapper, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {object} config
     */
    function Row(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.rowStyles = void 0;
      _this.getChildren = void 0;
      _this.wrapClass = _knockout.observable(false);
      var styleAttributeMapper = new _styleAttributeMapper();
      var styleAttributeFilter = new _styleAttributeFilter();
      _this.rowStyles = _knockout.computed(function () {
        // Extract data values our of observable functions
        var styles = styleAttributeMapper.toDom(styleAttributeFilter.filter(_underscore.mapObject(_this.data, function (value) {
          if (_knockout.isObservable(value)) {
            return value();
          }

          return value;
        }))); // The style attribute mapper converts images to directives, override it to include the correct URL

        if (_this.data.background_image && _typeof(_this.data.background_image()[0]) === "object") {
          styles.backgroundImage = "url(" + _this.data.background_image()[0].url + ")";
        }

        return styles;
      }); // Force the rowStyles to update on changes to stored style attribute data

      Object.keys(styleAttributeFilter.getAllowedAttributes()).forEach(function (key) {
        if (_knockout.isObservable(_this.data[key])) {
          _this.data[key].subscribe(function () {
            _this.rowStyles.notifySubscribers();
          });
        }
      });
      return _this;
    }

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
