define(["knockout", "../../../config"], function (_knockout, _config) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * ColumnBuilder Class
   */
  var ColumnBuilder =
  /*#__PURE__*/
  function () {
    /**
     * ColumnBuilder constructor
     */
    function ColumnBuilder() {
      _classCallCheck(this, ColumnBuilder);

      Object.defineProperty(this, "position", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable('')
      });
      Object.defineProperty(this, "visible", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable(false)
      });
      Object.defineProperty(this, "sizes", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observableArray([])
      });
      Object.defineProperty(this, "template", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 'Gene_BlueFoot/component/stage/structural/column/builder.html'
      });

      var columnOptions = _config.getInitConfig("column_definitions");

      for (var i = 0; i < columnOptions.length; i++) {
        if (columnOptions[i].displayed === true) {
          this.sizes.push({
            label: columnOptions[i].label,
            className: columnOptions[i].className
          });
        }
      }
    }
    /**
     * Show the builder from the column options scope
     */


    _createClass(ColumnBuilder, [{
      key: "showFromOption",
      value: function showFromOption() {
        this.position('top');
        this.visible(true);
      }
    }, {
      key: "show",

      /**
       * Change the visibility to visible
       */
      value: function show() {
        this.visible(true);
      }
    }, {
      key: "hide",

      /**
       * Change the visibility to hidden
       */
      value: function hide() {
        this.visible(false);
      }
    }, {
      key: "addColumn",

      /**
       * Proxy to the correct parent's add column function
       */
      value: function addColumn(parents, data) {
        // Nest a column (within a column or on a row)
        if (this.position() == 'top') {
          parents[1].addColumn(data);
        } else {
          // Add to left or right side of current column
          parents[1].insertColumnAtIndex(this.position(), parents[1], data);
        }
      }
    }]);

    return ColumnBuilder;
  }();

  return {
    ColumnBuilder: ColumnBuilder
  };
});
//# sourceMappingURL=builder.js.map
