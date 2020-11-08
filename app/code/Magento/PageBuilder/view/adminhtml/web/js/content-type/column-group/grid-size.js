/*eslint-disable */
/* jscs:disable */

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

define(["mage/translate", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/column/resize"], function (_translate, _config, _resize) {
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
   *
   * Rules for resizing the grid:
   *  - The grid size can be increased up to the configured maximum value.
   *  - The grid size can be decreased only if the number of non-empty columns is less than or equal to the new size.
   *  - If the new grid size is less than the number of columns currently in the grid, empty columns will be deleted
   *    to accommodate the new size.
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   * @param {Map<number, number[]>} gridSizeHistory
   */


  function resizeGrid(columnGroup, newGridSize, gridSizeHistory) {
    if (newGridSize === columnGroup.preview.getResizeUtils().getGridSize()) {
      return;
    }

    validateNewGridSize(columnGroup, newGridSize); // if we have more columns than the new grid size allows, remove empty columns until we are at the correct size

    if (newGridSize < columnGroup.getChildren()().length) {
      removeEmptyColumnsToFit(columnGroup, newGridSize);
    }

    columnGroup.preview.gridSize(newGridSize); // update column widths

    redistributeColumnWidths(columnGroup, newGridSize, gridSizeHistory);
  }
  /**
   * Validate that the new grid size is within the configured limits and can be achieved.
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   */


  function validateNewGridSize(columnGroup, newGridSize) {
    // Validate against the max grid size
    if (newGridSize > getMaxGridSize()) {
      throw new GridSizeError((0, _translate)("The maximum grid size supported is " + getMaxGridSize() + "."));
    } else if (newGridSize < 2) {
      throw new GridSizeError((0, _translate)("The minimum grid size supported is 2."));
    } // Validate that the operation will be successful


    var numCols = columnGroup.getChildren()().length;
    var currentGridSize = columnGroup.preview.getResizeUtils().getGridSize();

    if (newGridSize < currentGridSize && numCols > newGridSize) {
      var numEmptyColumns = 0;
      columnGroup.getChildren()().forEach(function (column) {
        if (column.getChildren()().length === 0) {
          numEmptyColumns++;
        }
      });

      if (newGridSize < numCols - numEmptyColumns) {
        throw new GridSizeError((0, _translate)("Grid size cannot be smaller than the current total amount of columns, minus any empty columns."));
      }
    }
  }
  /**
   * Remove empty columns so we can accommodate the new grid size
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   */


  function removeEmptyColumnsToFit(columnGroup, newGridSize) {
    var columns = columnGroup.getChildren()();
    var numColumns = columns.length;
    var i;

    for (i = numColumns - 1; i >= 0; i--) {
      var column = columns[i];

      if (newGridSize < numColumns && column.getChildren()().length === 0) {
        columnGroup.removeChild(column);
        numColumns--;
      }
    }
  }
  /**
   * Adjust columns widths across the new grid size, making sure each column is at least one grid size in width
   * and the entire grid size is distributed.
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   * @param {Map<number, number[]>} gridSizeHistory
   */


  function redistributeColumnWidths(columnGroup, newGridSize, gridSizeHistory) {
    // apply known column widths if we have resized before
    if (gridSizeHistory.has(newGridSize) && gridSizeHistory.get(newGridSize).length === columnGroup.getChildren()().length) {
      var columnWidths = gridSizeHistory.get(newGridSize);
      columnGroup.getChildren()().forEach(function (column, index) {
        (0, _resize.updateColumnWidth)(column, columnWidths[index]);
      });
      columnGroup.dataStore.set("grid_size", newGridSize);
      return;
    }

    var resizeUtils = columnGroup.preview.getResizeUtils();
    var existingGridSize = resizeUtils.getGridSize();
    var minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);
    var totalNewWidths = 0;
    var numColumns = columnGroup.getChildren()().length;
    var remainingWidth = 0;
    columnGroup.getChildren()().forEach(function (column, index) {
      var existingWidth = resizeUtils.getColumnWidth(column);
      var fractionColumnWidth = Math.round(existingWidth / (100 / existingGridSize));
      /**
       * Determine if the grid & column are directly compatible with the new defined grid size, this will directly
       * convert fractions to their equivalent of the new grid size.
       *
       * For instance changing a 12 column grid with 2 x 6 / 12 columns to a 6 grid is fully compatible.
       *
       * Check the existing grid size and new grid size are divisible, verify the amount of columns will fit
       * in the new grid size and finally check the calculation to convert the existing column width results in a
       * positive integer.
       */

      if ((existingGridSize > newGridSize && existingGridSize % newGridSize === 0 || existingGridSize < newGridSize && newGridSize % existingGridSize === 0) && newGridSize % numColumns === 0 && newGridSize / existingGridSize * fractionColumnWidth % 1 === 0) {
        // We don't need to modify the columns width as it's directly compatible, we will however increment the
        // width counter as some other columns may not be compatible.
        totalNewWidths += existingWidth;
      } else {
        var newWidth = (100 * Math.floor(existingWidth / 100 * newGridSize) / newGridSize).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0); // make sure the column is at least one grid size wide

        if (parseFloat(newWidth) < parseFloat(minColWidth)) {
          newWidth = minColWidth;
        } // make sure we leave enough space for other columns


        var maxAvailableWidth = 100 - totalNewWidths - (numColumns - index - 1) * parseFloat(minColWidth);

        if (parseFloat(newWidth) > maxAvailableWidth) {
          newWidth = maxAvailableWidth.toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);
        } // Calculate any width lost from the column, if a 5 / 12 is becoming a 2 / 6 then it's lost 1 / 12


        remainingWidth += existingWidth - parseFloat(newWidth);
        /**
         * Determine if we have enough remaining width, and apply it to the current column, this results in a
         * subsequent column always receiving any additional width from the previous column
         */

        if (resizeUtils.getSmallestColumnWidth(newGridSize) === resizeUtils.getAcceptedColumnWidth(remainingWidth.toString(), newGridSize)) {
          var widthWithRemaining = resizeUtils.getAcceptedColumnWidth((parseFloat(newWidth) + remainingWidth).toString(), newGridSize);

          if (widthWithRemaining > 0) {
            newWidth = widthWithRemaining.toFixed(Math.round(100 / widthWithRemaining) !== 100 / widthWithRemaining ? 8 : 0);
            remainingWidth = 0;
          }
        }

        totalNewWidths += parseFloat(newWidth);
        (0, _resize.updateColumnWidth)(column, parseFloat(newWidth));
      }

      column.preview.updateDisplayLabel();
    }); // persist new grid size so upcoming calls to get column widths are calculated correctly

    columnGroup.dataStore.set("grid_size", newGridSize); // apply leftover columns if the new grid size did not distribute evenly into existing columns

    if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
      applyLeftoverColumns(columnGroup, newGridSize);
    }
  }
  /**
   * Make sure the full grid size is distributed across the columns
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   */


  function applyLeftoverColumns(columnGroup, newGridSize) {
    var resizeUtils = columnGroup.preview.getResizeUtils();
    var minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);
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

  var GridSizeError =
  /*#__PURE__*/
  function (_Error) {
    "use strict";

    _inheritsLoose(GridSizeError, _Error);

    function GridSizeError(m) {
      var _this;

      _this = _Error.call(this, m) || this;
      Object.setPrototypeOf(_assertThisInitialized(_this), GridSizeError.prototype);
      return _this;
    }

    return GridSizeError;
  }(_wrapNativeSuper(Error));

  return {
    getDefaultGridSize: getDefaultGridSize,
    getMaxGridSize: getMaxGridSize,
    resizeGrid: resizeGrid,
    GridSizeError: GridSizeError
  };
});
//# sourceMappingURL=grid-size.js.map