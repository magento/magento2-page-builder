define(["knockout", "underscore", "./block", "../../format/style-attribute-mapper", "../../format/style-attribute-filter"], function (_knockout, _underscore, _block, _styleAttributeMapper, _styleAttributeFilter) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    function Row(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.rowStyles = void 0;
      _this.getChildren = void 0;
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

        if (_this.data.background_image && _typeof(_this.data.background_image()[0]) === 'object') {
          styles['backgroundImage'] = 'url(' + _this.data.background_image()[0].url + ')';
        }

        return styles;
      }); // Force the rowStyles to update on changes to stored style attribute data

      Object.keys(styleAttributeFilter.allowedAttributes).forEach(function (key) {
        if (_knockout.isObservable(_this.data[key])) {
          _this.data[key].subscribe(function () {
            _this.rowStyles.notifySubscribers();
          });
        }
      });
      _this.getChildren = _knockout.computed(function () {
        var groupedChildren = [];
        var columnGroup = [];
        Object.keys(parent.children()).map(function (key) {
          var children = parent.children()[key];

          if (children.constructor.name === 'Column') {
            columnGroup.push(children);
          } else {
            if (columnGroup.length > 0) {
              groupedChildren.push(columnGroup);
              groupedChildren.push(children);
              columnGroup = [];
            } else {
              groupedChildren.push(children);
            }
          }

          console.log(groupedChildren);
        });

        if (columnGroup.length > 0) {
          groupedChildren.push(columnGroup);
        }

        return groupedChildren;
      }); // ko.bindingHandlers.wrapColumns = {
      //     init: function(elem, valueAccessor) {
      //
      //         console.log(parent.children());
      //
      //         // Get name of child and render if columns
      //         Object.getOwnPropertyNames(parent.children()).forEach(
      //             function (val, index, array) {
      //                 if ( (parent.children()[val].constructor.name === 'Column') ) {
      //                     this.isColumn = true;
      //                 } else {
      //                     this.isColumn = false;
      //                 }
      //             }
      //         );
      //         // Let bindings proceed as normal *only if* my value is false
      //         // var shouldAllowBindings = ko.unwrap(valueAccessor());
      //         // return { controlsDescendantBindings: !shouldAllowBindings };
      //     }
      // }

      return _this;
    }

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
