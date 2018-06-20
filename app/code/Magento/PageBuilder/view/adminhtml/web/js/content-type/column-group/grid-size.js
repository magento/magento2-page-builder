/*eslint-disable */
define(["Magento_PageBuilder/js/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

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
   * Assume we have previously validated that the new grid size is attainable for the current configuration.
   *
   * Rules for resizing the grid:
   *  - The grid size can always be increased up to the configured maximum value. (Assume this validation is done
   *    on entry)
   *  - The grid size can be reduced only if the number of non-empty columns is less than or equal to the new size.
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
      throw RangeError("The maximum grid size supported is " + getMaxGridSize() + ".");
    } // Validate that the operation will be successful


    if (newGridSize < currentGridSize && numColumns > newGridSize) {
      var numEmptyColumns = 0;
      columnGroup.getChildren()().forEach(function (column) {
        if (column.getChildren().length === 0) {
          numEmptyColumns++;
        }
      });

      if (numEmptyColumns >= currentGridSize - newGridSize) {
        throw RangeError("Grid size cannot be smaller than the current total amount of columns, minus any " + "empty columns.");
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
      resizeUtils.updateColumnWidth(column, parseFloat(newWidth));
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
          resizeUtils.updateColumnWidth(column, parseFloat(resizeUtils.getColumnWidth(column).toString()) + parseFloat(minColWidth));
        } else {
          break;
        }
      }
    }
  }

  return {
    getDefaultGridSize: getDefaultGridSize,
    getMaxGridSize: getMaxGridSize,
    resizeGrid: resizeGrid
  };
});
//# sourceMappingURL=grid-size.js.map
