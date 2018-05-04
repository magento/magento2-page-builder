/*eslint-disable */
define(["Magento_PageBuilder/js/utils/array"], function (_array) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Get the maximum columns allowed
   *
   * @returns {number}
   */
  function getMaxColumns() {
    return 6;
  }
  /**
   * Get the smallest column width possible
   *
   * @returns {number}
   */


  function getSmallestColumnWidth() {
    return getAcceptedColumnWidth(parseFloat((100 / getMaxColumns()).toString()).toFixed(Math.round(100 / getMaxColumns()) !== 100 / getMaxColumns() ? 8 : 0));
  }
  /**
   * Get an accepted column width to resolve rounding issues, e.g. turn 49.995% into 50%
   *
   * @param width
   * @returns {number}
   */


  function getAcceptedColumnWidth(width) {
    var newWidth = 0;

    for (var i = getMaxColumns(); i > 0; i--) {
      var percentage = parseFloat((100 / getMaxColumns() * i).toFixed(Math.round(100 / getMaxColumns() * i) !== 100 / getMaxColumns() * i ? 8 : 0)); // Allow for rounding issues

      if (parseFloat(width) > percentage - 0.1 && parseFloat(width) < percentage + 0.1) {
        newWidth = percentage;
        break;
      }
    }

    return newWidth;
  }
  /**
   * Return the width of the column
   *
   * @param {Column} column
   * @returns {number}
   */


  function getColumnWidth(column) {
    return getAcceptedColumnWidth(column.store.get(column.id).width.toString());
  }
  /**
   * Retrieve the index of the column within it's group
   *
   * @param {Column} column
   * @returns {number}
   */


  function getColumnIndexInGroup(column) {
    return column.parent.children().indexOf(column);
  }
  /**
   * Retrieve the adjacent column based on a direction of +1 or -1
   *
   * @param {Column} column
   * @param {"+1" | "-1"} direction
   * @returns {any}
   */


  function getAdjacentColumn(column, direction) {
    var currentIndex = getColumnIndexInGroup(column);

    if (typeof column.parent.children()[currentIndex + parseInt(direction, 10)] !== "undefined") {
      return column.parent.children()[currentIndex + parseInt(direction, 10)];
    }

    return null;
  }
  /**
   * Get the total width of all columns in the group
   *
   * @param {ColumnGroup} group
   * @returns {number}
   */


  function getColumnsWidth(group) {
    return group.children().map(function (column) {
      return getColumnWidth(column);
    }).reduce(function (widthA, widthB) {
      return widthA + (widthB ? widthB : 0);
    });
  }
  /**
   * Determine the pixel position of every column that can be created within the group
   *
   * @param {Column} column
   * @param {JQuery} group
   * @returns {ColumnWidth[]}
   */


  function determineColumnWidths(column, group) {
    var singleColumnWidth = group.outerWidth() / getMaxColumns();
    var adjacentColumn = getAdjacentColumn(column, "+1");
    var columnWidths = [];
    var columnLeft = column.element.offset().left - parseInt(column.element.css("margin-left"), 10);
    var adjacentRightPosition = adjacentColumn.element.offset().left + adjacentColumn.element.outerWidth(true); // Determine the maximum size (in pixels) that this column can be dragged to

    var columnsToRight = column.parent.children().length - (getColumnIndexInGroup(column) + 1);
    var leftMaxWidthFromChildren = group.offset().left + group.outerWidth() - columnsToRight * singleColumnWidth + 10;
    var rightMaxWidthFromChildren = group.offset().left + (column.parent.children().length - columnsToRight) * singleColumnWidth - 10; // Due to rounding we add a threshold of 10
    // Iterate through the amount of columns generating the position for both left & right interactions

    for (var i = getMaxColumns(); i > 0; i--) {
      var position = Math.round(columnLeft + singleColumnWidth * i);

      if (position > Math.round(leftMaxWidthFromChildren)) {
        continue;
      }

      columnWidths.push({
        forColumn: "left",
        // These positions are for the left column in the pair
        name: i + "/" + getMaxColumns(),
        position: position,
        width: getRoundedColumnWidth(100 / getMaxColumns() * i)
      });
    }

    for (var _i = 1; _i < getMaxColumns(); _i++) {
      var _position = Math.floor(adjacentRightPosition - _i * singleColumnWidth);

      if (_position < Math.floor(rightMaxWidthFromChildren)) {
        continue;
      } // The right interaction is only used when we're crushing a column that isn't adjacent


      columnWidths.push({
        forColumn: "right",
        // These positions are for the left column in the pair
        name: _i + "/" + getMaxColumns(),
        position: _position,
        width: getRoundedColumnWidth(100 / getMaxColumns() * _i)
      });
    }

    return columnWidths;
  }
  /**
   * Determine the max ghost width based on the calculated columns
   *
   * @param {ColumnWidth[]} columnWidths
   * @returns {MaxGhostWidth}
   */


  function determineMaxGhostWidth(columnWidths) {
    var leftColumns = columnWidths.filter(function (width) {
      return width.forColumn === "left";
    });
    var rightColumns = columnWidths.filter(function (width) {
      return width.forColumn === "right";
    });
    return {
      left: leftColumns[0].position,
      right: rightColumns[rightColumns.length - 1].position
    };
  }
  /**
   * Find a column which can be shrunk for the current resize action
   *
   * @param {Column} column
   * @param {"left" | "right"} direction
   * @returns {Column}
   */


  function findShrinkableColumnForResize(column, direction) {
    var currentIndex = getColumnIndexInGroup(column);
    var parentChildren = column.parent.children();
    var searchArray;

    switch (direction) {
      case "right":
        searchArray = parentChildren.slice(currentIndex + 1);
        break;

      case "left":
        searchArray = parentChildren.slice(0).reverse().slice(parentChildren.length - currentIndex);
        break;
    }

    return searchArray.find(function (groupColumn) {
      return getColumnWidth(groupColumn) > getSmallestColumnWidth();
    });
  }
  /**
   * Find a shrinkable column outwards from the current column
   *
   * @param {Column} column
   * @returns {Column}
   */


  function findShrinkableColumn(column) {
    return (0, _array.outwardSearch)(column.parent.children(), getColumnIndexInGroup(column), function (neighbourColumn) {
      return getColumnWidth(neighbourColumn) > getSmallestColumnWidth();
    });
  }
  /**
   * Return the column width to 8 decimal places if it's not a whole number
   *
   * @param {number} width
   * @returns {string}
   */


  function getRoundedColumnWidth(width) {
    return Number(width.toFixed(Math.round(width) !== width ? 8 : 0));
  }
  /**
   * Calculate the ghost size for the resizing action
   *
   * @param {JQuery<HTMLElement>} group
   * @param {number} currentPos
   * @param {Column} column
   * @param {string} modifyColumnInPair
   * @param {MaxGhostWidth} maxGhostWidth
   * @returns {number}
   */


  function calculateGhostWidth(group, currentPos, column, modifyColumnInPair, maxGhostWidth) {
    var ghostWidth = currentPos - group.offset().left;

    switch (modifyColumnInPair) {
      case "left":
        var singleColumnWidth = column.element.position().left + group.outerWidth() / getMaxColumns(); // Don't allow the ghost widths be less than the smallest column

        if (ghostWidth <= singleColumnWidth) {
          ghostWidth = singleColumnWidth;
        }

        if (currentPos >= maxGhostWidth.left) {
          ghostWidth = maxGhostWidth.left - group.offset().left;
        }

        break;

      case "right":
        if (currentPos <= maxGhostWidth.right) {
          ghostWidth = maxGhostWidth.right - group.offset().left;
        }

        break;
    }

    return ghostWidth;
  }
  /**
   * Determine which column in the group should be adjusted for the current resize action
   *
   * @param {JQuery<HTMLElement>} group
   * @param {number} currentPos
   * @param {Column} column
   * @param {ResizeHistory} history
   * @returns {[Column , string , string]}
   */


  function determineAdjustedColumn(group, currentPos, column, history) {
    var modifyColumnInPair = "left";
    var usedHistory;
    var resizeColumnLeft = column.element.offset().left - parseInt(column.element.css("margin-left"), 10);
    var resizeColumnWidth = column.element.outerWidth(true);
    var resizeHandlePosition = resizeColumnLeft + resizeColumnWidth;
    var adjustedColumn;

    if (currentPos >= resizeHandlePosition) {
      // Get the history for the opposite direction of resizing
      if (history.left.length > 0) {
        usedHistory = "left";
        adjustedColumn = history.left.reverse()[0].adjustedColumn;
        modifyColumnInPair = history.left.reverse()[0].modifyColumnInPair;
      } else {
        // If we're increasing the width of our column we need to locate a column that can shrink to the
        // right
        adjustedColumn = findShrinkableColumnForResize(column, "right");
      }
    } else {
      if (getColumnWidth(column) <= getSmallestColumnWidth()) {
        adjustedColumn = findShrinkableColumnForResize(column, "left");

        if (adjustedColumn) {
          modifyColumnInPair = "right";
        }
      } else if (history.right.length > 0) {
        usedHistory = "right";
        adjustedColumn = history.right.reverse()[0].adjustedColumn;
        modifyColumnInPair = history.right.reverse()[0].modifyColumnInPair;
      } else {
        // If we're shrinking our column we can just increase the adjacent column
        adjustedColumn = getAdjacentColumn(column, "+1");
      }
    }

    return [adjustedColumn, modifyColumnInPair, usedHistory];
  }
  /**
   * Compare if two numbers are within a certain threshold of each other
   *
   * comparator(10,11,2) => true
   * comparator(1.1,1.11,0.5) => true
   *
   * @param {number} num1
   * @param {number} num2
   * @param {number} threshold
   * @returns {boolean}
   */


  function comparator(num1, num2, threshold) {
    return num1 > num2 - threshold / 2 && num1 < num2 + threshold / 2;
  }
  /**
   * Resize a column to a specific width
   *
   * @param {Column} column
   * @param {number} width
   * @param {Column} shrinkableColumn
   */


  function resizeColumn(column, width, shrinkableColumn) {
    var current = getColumnWidth(column);
    var difference = (parseFloat(width.toString()) - current).toFixed(8); // Don't run the update if we've already modified the column

    if (current === parseFloat(width.toString()) || parseFloat(width.toString()) < getSmallestColumnWidth()) {
      return;
    } // Also shrink the closest shrinkable column


    var allowedToShrink = true;

    if (difference && shrinkableColumn) {
      var currentShrinkable = getColumnWidth(shrinkableColumn);
      var shrinkableSize = getAcceptedColumnWidth((currentShrinkable + -difference).toString()); // Ensure the column we're crushing is not becoming the same size, and it's not less than the smallest width

      if (currentShrinkable === parseFloat(shrinkableSize.toString()) || parseFloat(shrinkableSize.toString()) < getSmallestColumnWidth()) {
        allowedToShrink = false;
      } else {
        updateColumnWidth(shrinkableColumn, shrinkableSize);
      }
    }

    if (allowedToShrink) {
      updateColumnWidth(column, width);
    }
  }
  /**
   * Update the width of a column
   *
   * @param {Column} column
   * @param {number} width
   */


  function updateColumnWidth(column, width) {
    column.store.updateKey(column.id, parseFloat(width.toString()) + "%", "width");
  }

  return {
    getMaxColumns: getMaxColumns,
    getSmallestColumnWidth: getSmallestColumnWidth,
    getAcceptedColumnWidth: getAcceptedColumnWidth,
    getColumnWidth: getColumnWidth,
    getColumnIndexInGroup: getColumnIndexInGroup,
    getAdjacentColumn: getAdjacentColumn,
    getColumnsWidth: getColumnsWidth,
    determineColumnWidths: determineColumnWidths,
    determineMaxGhostWidth: determineMaxGhostWidth,
    findShrinkableColumnForResize: findShrinkableColumnForResize,
    findShrinkableColumn: findShrinkableColumn,
    getRoundedColumnWidth: getRoundedColumnWidth,
    calculateGhostWidth: calculateGhostWidth,
    determineAdjustedColumn: determineAdjustedColumn,
    comparator: comparator,
    resizeColumn: resizeColumn,
    updateColumnWidth: updateColumnWidth
  };
});
//# sourceMappingURL=resizing.js.map
