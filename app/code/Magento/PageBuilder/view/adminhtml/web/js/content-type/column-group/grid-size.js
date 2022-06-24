/*eslint-disable */
/* jscs:disable */

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
    if (newGridSize === columnGroup.preview.getResizeUtils().getInitialGridSize()) {
      return;
    }

    validateNewGridSize(columnGroup, newGridSize);
    columnGroup.getChildren()().forEach(function (columnLine, index) {
      // if we have more columns than the new grid size allows, remove empty columns till the correct size
      console.log(columnLine.getChildren()().length);

      if (newGridSize < columnLine.getChildren()().length) {
        removeEmptyColumnsToFit(columnLine, newGridSize);
      }
    }); // update column widths

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


    var doThrowException = false;
    columnGroup.getChildren()().forEach(function (columnLine, index) {
      var numEmptyColumns = 0;
      var numCols = columnLine.getChildren()().length;
      var currentGridSize = columnLine.preview.getResizeUtils().getInitialGridSize();

      if (newGridSize < currentGridSize && numCols > newGridSize) {
        columnLine.getChildren()().forEach(function (column) {
          if (column.getChildren()().length === 0) {
            numEmptyColumns++;
          }
        });

        if (newGridSize < numCols - numEmptyColumns) {
          doThrowException = true;
        }
      }
    });

    if (doThrowException) {
      throw new Error((0, _translate)("Grid size cannot be smaller than the current total amount of columns, minus any empty columns."));
    }
  }
  /**
   * Remove empty columns so we can accommodate the new grid size
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   */


  function removeEmptyColumnsToFit(columnLine, newGridSize) {
    var columns = columnLine.getChildren()();
    var numColumns = columns.length;
    var i;

    for (i = numColumns - 1; i >= 0; i--) {
      var column = columns[i];

      if (newGridSize < numColumns && column.getChildren()().length === 0) {
        columnLine.removeChild(column);
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
      columnGroup.dataStore.unset("initial_grid_size");
      return;
    }

    var columnGroupResizeUtil = columnGroup.preview.getResizeUtils();
    var existingGridSize = columnGroupResizeUtil.getInitialGridSize();
    var minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);
    columnGroup.getChildren()().forEach(function (columnLine, columnLineIndex) {
      var totalNewWidths = 0;
      var remainingWidth = 0;
      var numColumns = columnLine.getChildren()().length;
      var resizeUtils = columnLine.preview.getResizeUtils();
      columnLine.getChildren()().forEach(function (column, index) {
        var existingWidth = resizeUtils.getColumnWidth(column);
        var fractionColumnWidth = Math.round(existingWidth / (100 / existingGridSize));
        /**
         * Determine if the grid & column are directly compatible with the new defined grid size, this will
         * directly convert fractions to their equivalent of the new grid size.
         *
         * For instance changing a 12 column grid with 2 x 6 / 12 columns to a 6 grid is fully compatible.
         *
         * Check the existing grid size and new grid size are divisible, verify the amount of columns will fit
         * in the new grid size and finally check the calculation to convert the existing column width results
         * in a positive integer.
         */

        if ((existingGridSize > newGridSize && existingGridSize % newGridSize === 0 || existingGridSize < newGridSize && newGridSize % existingGridSize === 0) && newGridSize % numColumns === 0 && newGridSize / existingGridSize * fractionColumnWidth % 1 === 0) {
          // We don't need to modify the columns width as it's compatible, we will however increment the
          // width counter as some other columns may not be compatible.
          totalNewWidths += existingWidth;
        } else {
          var newWidth = (100 * Math.floor(existingWidth / 100 * newGridSize) / newGridSize).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0); // make sure the column is at least one grid size wide

          if (parseFloat(newWidth) < parseFloat(minColWidth)) {
            newWidth = minColWidth;
          } // make sure we leave enough space for other columns


          var widthTaken = totalNewWidths + (numColumns - index - 1) * parseFloat(minColWidth);
          var maxAvailableWidth = 100 - totalNewWidths;

          if (parseFloat(newWidth) > maxAvailableWidth) {
            var gridWidth = Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0;
            newWidth = maxAvailableWidth.toFixed(gridWidth);
          } // Calculate any width lost from the column, if a 5 / 12 is becoming a 2 / 6 then it's lost 1 / 12


          remainingWidth += existingWidth - parseFloat(newWidth);
          /**
           * Determine if we have enough remaining width, and apply it to the current column, this results in
           * a subsequent column always receiving any additional width from the previous column
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
      });
    });
    columnGroup.dataStore.set("grid_size", newGridSize);
    columnGroup.dataStore.unset("initial_grid_size");
    columnGroup.getChildren()().forEach(function (columnLine, index) {
      var resizeUtils = columnLine.preview.getResizeUtils();

      if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
        applyLeftoverColumnsInColumnLine(columnLine, newGridSize);
      }
    });
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

    for (var _iterator = _createForOfIteratorHelperLoose(columnGroup.getChildren()()), _step; !(_step = _iterator()).done;) {
      column = _step.value;

      if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
        (0, _resize.updateColumnWidth)(column, parseFloat(resizeUtils.getColumnWidth(column).toString()) + parseFloat(minColWidth));
      } else {
        break;
      }
    }
  }
  /**
   * Make sure the full grid size is distributed across the columns
   *
   * @param {ContentTypeCollectionInterface<Preview>} columnGroup
   * @param {number} newGridSize
   */


  function applyLeftoverColumnsInColumnLine(columnLine, newGridSize) {
    var resizeUtils = columnLine.preview.getResizeUtils();
    var minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);
    var column;

    for (var _iterator2 = _createForOfIteratorHelperLoose(columnLine.getChildren()()), _step2; !(_step2 = _iterator2()).done;) {
      column = _step2.value;

      if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
        (0, _resize.updateColumnWidth)(column, parseFloat(resizeUtils.getColumnWidth(column).toString()) + parseFloat(minColWidth));
      } else {
        break;
      }
    }
  }

  var GridSizeError = /*#__PURE__*/function (_Error) {
    "use strict";

    _inheritsLoose(GridSizeError, _Error);

    function GridSizeError(m) {
      var _this;

      _this = _Error.call(this, m) || this;
      Object.setPrototypeOf(_assertThisInitialized(_this), GridSizeError.prototype);
      return _this;
    }

    return GridSizeError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  return {
    getDefaultGridSize: getDefaultGridSize,
    getMaxGridSize: getMaxGridSize,
    resizeGrid: resizeGrid,
    GridSizeError: GridSizeError
  };
});
//# sourceMappingURL=grid-size.js.map