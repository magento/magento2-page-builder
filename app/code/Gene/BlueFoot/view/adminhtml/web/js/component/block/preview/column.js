define(["knockout", "underscore", "./block", "../../format/style-attribute-mapper", "../../format/style-attribute-filter"], function (_knockout, _underscore, _block, _styleAttributeMapper, _styleAttributeFilter) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    // afterColumnRenders: KnockoutComputed<{}>;

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    function Row(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.columnStyles = void 0;
      var styleAttributeMapper = new _styleAttributeMapper();
      var styleAttributeFilter = new _styleAttributeFilter();
      _this.columnStyles = _knockout.computed(function () {
        // Extract data values our of observable functions
        var styles = styleAttributeMapper.toDom(styleAttributeFilter.filter(_underscore.mapObject(_this.data, function (value) {
          if (_knockout.isObservable(value)) {
            return value();
          }

          return value;
        }))); // The style attribute mapper converts images to directives, override it to include the correct URL

        if (_this.data.background_image && _typeof(_this.data.background_image()[0]) === 'object') {
          styles['backgroundImage'] = 'url(' + _this.data.background_image()[0].url + ')';
        }

        styles['flex-grow'] = 1;
        return styles;
      }); // Force the columnStyles to update on changes to stored style attribute data

      Object.keys(styleAttributeFilter.allowedAttributes).forEach(function (key) {
        if (_knockout.isObservable(_this.data[key])) {
          _this.data[key].subscribe(function () {
            _this.columnStyles.notifySubscribers();
          });
        }
      });

      _this.afterColumnRenders = function () {
        // Not wrapping correctly here, but does if ran once after all elements render
        jQuery('.row-container').find('.bluefoot-column').parent('.bluefoot-structure-wrapper').addClass('column-flex');
        jQuery('.row-container').each(function (index) {
          if (jQuery(this).find('.column-flex').parent('.column-flex-wrapper').length === 0) {
            jQuery(this).find('.column-flex').wrapAll('<div class="column-flex-wrapper" style="display: flex">');
          }
        });
      };

      return _this;
    }

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=column.js.map
