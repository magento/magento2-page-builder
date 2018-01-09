/*eslint-disable */
define(["knockout", "../../../config"], function (_knockout, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ColumnBuilder =
  /*#__PURE__*/
  function () {
    /**
     * ColumnBuilder constructor
     */
    function ColumnBuilder() {
      this.position = _knockout.observable("");
      this.sizes = _knockout.observableArray([]);
      this.template = "Gene_BlueFoot/component/stage/structural/column/builder.html";
      this.visible = _knockout.observable(false);

      var columnOptions = _config.getInitConfig("column_definitions");

      for (var _iterator = columnOptions, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _columnOption = _ref;

        if (_columnOption.displayed === true) {
          this.sizes.push({
            className: _columnOption.className,
            label: _columnOption.label
          });
        }
      }
    }
    /**
     * Show the builder from the column options scope
     */


    var _proto = ColumnBuilder.prototype;

    _proto.showFromOption = function showFromOption() {
      this.position("top");
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
     * Proxy to the correct parent"s add column function
     */


    _proto.addColumn = function addColumn(parents, data) {
      // Nest a column (within a column or on a row)
      if (this.position() === "top") {
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
//# sourceMappingURL=builder.js.map
