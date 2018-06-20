/*eslint-disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/column/resize"], function (_config, _resize) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * Retrieve default  grid size
   *
   * @returns {number}
   */
  function getDefaultGridSize() {
    return parseInt(_config.getConfig("column_grid_default"), 10);
  }
  /**
   * Retrieve the max grid size
   *
   * @returns {number}
   */


  function getMaxGridSize() {
    return parseInt(_config.getConfig("column_grid_max"), 10);
  }
  /**
   * Apply the new grid size, adjusting the existing columns as needed.
   *
   * Rules for resizing the grid:
   *  - The grid size can be increased up to the configured maximum value.
   *  - The grid size can be decreased only if the number of non-empty columns is less than or equal to the new size.
   *  - If the new grid size is less than the number of columns currently in the grid, empty columns will be deleted
   *    to accommodate the new size.
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   */


  function resizeGrid(columnGroup, newGridSize) {
    var resizeUtils = columnGroup.preview.getResizeUtils();
    var currentGridSize = parseInt(columnGroup.dataStore.getKey("gridSize").toString(), 10);
    var numColumns = columnGroup.getChildren()().length; // Validate against the max grid size

    if (newGridSize > getMaxGridSize()) {
      throw new GridSizeError("The maximum grid size supported is " + getMaxGridSize() + ".");
    } else if (newGridSize < numColumns) {
      throw new GridSizeError("Grid size cannot be smaller than the number of columns.");
    } // Validate that the operation will be successful


    if (newGridSize < currentGridSize && numColumns > newGridSize) {
      var numEmptyColumns = 0;
      columnGroup.getChildren()().forEach(function (column) {
        if (column.getChildren().length === 0) {
          numEmptyColumns++;
        }
      });

      if (numEmptyColumns >= currentGridSize - newGridSize) {
        throw new GridSizeError("Grid size cannot be smaller than the current total amount of columns, minus any " + "empty columns.");
      }
    }

    var minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0); // if we have more columns than the new grid size allows, remove empty columns until we are at the correct size

    if (newGridSize < numColumns) {
      columnGroup.getChildren()().forEach(function (column) {
        if (newGridSize < numColumns && column.getChildren().length === 0) {
          columnGroup.removeChild(column);
          numColumns--;
        }
      });
      columnGroup.dataStore.update(numColumns, "gridSize");
    } // update column widths


    var totalNewWidths = 0;
    columnGroup.getChildren()().forEach(function (column, index) {
      var newWidth = (100 * Math.floor(resizeUtils.getColumnWidth(column) / 100 * newGridSize) / newGridSize).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0); // make sure the column is at least one grid size wide

      if (newWidth < minColWidth) {
        newWidth = minColWidth;
      } // make sure we leave enough space for other columns


      var maxAvailableWidth = 100 - totalNewWidths - (numColumns - index - 1) * parseFloat(minColWidth);

      if (parseFloat(newWidth) > maxAvailableWidth) {
        newWidth = maxAvailableWidth.toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);
      }

      totalNewWidths += parseFloat(newWidth);
      (0, _resize.updateColumnWidth)(column, parseFloat(newWidth));
    }); // persist new grid size so upcoming calls to get column widths are calculated correctly

    columnGroup.dataStore.update(newGridSize, "gridSize"); // apply leftover columns if the new grid size did not distribute evenly into existing columns

    if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
      var column;

      for (var _iterator = columnGroup.getChildren()(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        if (_isArray) {
          if (_i >= _iterator.length) break;
          column = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          column = _i.value;
        }

        if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
          (0, _resize.updateColumnWidth)(column, parseFloat(resizeUtils.getColumnWidth(column).toString()) + parseFloat(minColWidth));
        } else {
          break;
        }
      }
    }
  }

  var GridSizeError =
  /*#__PURE__*/
  function (_Error) {
    _inheritsLoose(GridSizeError, _Error);

    function GridSizeError(m) {
      var _this;

      _this = _Error.call(this, m) || this;
      Object.setPrototypeOf(_this, GridSizeError.prototype);
      return _this;
    }

    return GridSizeError;
  }(Error);

  return {
    getDefaultGridSize: getDefaultGridSize,
    getMaxGridSize: getMaxGridSize,
    resizeGrid: resizeGrid,
    GridSizeError: GridSizeError
  };
});
//# sourceMappingURL=grid-size.js.map
