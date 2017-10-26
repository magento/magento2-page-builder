define(["knockout", "../../../config"], function (_knockout, _config) {
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


    var _proto = ColumnBuilder.prototype;

    _proto.showFromOption = function showFromOption() {
      this.position('top');
      this.visible(true);
    };

    /**
     * Change the visibility to visible
     */
    _proto.show = function show() {
      this.visible(true);
    };

    /**
     * Change the visibility to hidden
     */
    _proto.hide = function hide() {
      this.visible(false);
    };

    /**
     * Proxy to the correct parent's add column function
     */
    _proto.addColumn = function addColumn(parents, data) {
      // Nest a column (within a column or on a row)
      if (this.position() == 'top') {
        parents[1].addColumn(data);
      } else {
        // Add to left or right side of current column
        parents[1].insertColumnAtIndex(this.position(), parents[1], data);
      }
    };

    return ColumnBuilder;
  }();

  return {
    ColumnBuilder: ColumnBuilder
  };
});