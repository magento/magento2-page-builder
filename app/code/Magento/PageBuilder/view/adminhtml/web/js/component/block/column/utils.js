/*eslint-disable */
define(["../../../utils/array", "../../config", "../factory"], function (_array, _config, _factory) {
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
    return parseFloat(column.stage.store.get(column.id).width.toString());
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
   * Update the width of a column
   *
   * @param {Column} column
   * @param {number} width
   */


  function updateColumnWidth(column, width) {
    column.stage.store.updateKey(column.id, parseFloat(width.toString()) + "%", "width");
  }
  /**
   * Calculate the drop positions of a column group
   *
   * @param {ColumnGroup} group
   * @returns {any[]}
   */


  function calculateDropPositions(group) {
    var dropPositions = [];
    group.children().forEach(function (column, index) {
      var left = column.element.position().left;
      var width = column.element.outerWidth();
      var canShrink = getColumnWidth(column) > getSmallestColumnWidth();
      dropPositions.push({
        affectedColumn: column,
        canShrink: canShrink,
        insertIndex: index,
        left: left,
        placement: "left",
        right: left + width / 2
      }, {
        affectedColumn: column,
        canShrink: canShrink,
        insertIndex: index + 1,
        left: left + width / 2,
        placement: "right",
        right: left + width
      });
    });
    return dropPositions;
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
    var singleColumnWidth = group.width() / getMaxColumns();
    var adjacentColumn = getAdjacentColumn(column, "+1");
    var columnWidths = [];
    var groupLeft = group.offset().left;
    var columnLeft = column.element.offset().left;
    var adjacentRightPosition = groupLeft + adjacentColumn.element.offset().left + adjacentColumn.element.outerWidth(); // Iterate through the amount of columns generating the position for both left & right interactions

    for (var i = getMaxColumns(); i > 0; i--) {
      columnWidths.push({
        forColumn: "left",
        // These positions are for the left column in the pair
        name: i + "/" + getMaxColumns(),
        position: Math.round(columnLeft + singleColumnWidth * i),
        width: getRoundedColumnWidth(100 / getMaxColumns() * i)
      });
    }

    var currentWidth = Math.round(getColumnWidth(adjacentColumn) / getSmallestColumnWidth());

    for (var _i = 1; _i < getMaxColumns(); _i++) {
      // The right interaction is only used when we're crushing a column that isn't adjacent
      columnWidths.push({
        forColumn: "right",
        // These positions are for the left column in the pair
        name: _i + "/" + getMaxColumns(),
        position: Math.round(adjacentRightPosition - (_i + 1) * singleColumnWidth - singleColumnWidth),
        width: getRoundedColumnWidth(100 / getMaxColumns() * _i)
      });
    }

    return columnWidths;
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

    if (current === parseFloat(width.toString())) {
      return;
    }

    updateColumnWidth(column, width); // Also shrink the closest shrinkable column

    if (difference && shrinkableColumn) {
      var currentShrinkable = getColumnWidth(shrinkableColumn);
      updateColumnWidth(shrinkableColumn, getAcceptedColumnWidth((currentShrinkable + -difference).toString()));
    }
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
   * Create a column and add it to it's parent
   *
   * @param {ColumnGroup} parent
   * @param {number} width
   * @param {number} index
   * @returns {Promise<void>}
   */


  function createColumn(parent, width, index) {
    return (0, _factory)(_config.getContentTypeConfig("column"), parent, parent.stage, {
      width: parseFloat(width.toString()) + "%"
    }).then(function (column) {
      parent.addChild(column, index);
      return column;
    });
  }

  return {
    getMaxColumns: getMaxColumns,
    getSmallestColumnWidth: getSmallestColumnWidth,
    getAcceptedColumnWidth: getAcceptedColumnWidth,
    getColumnWidth: getColumnWidth,
    getColumnIndexInGroup: getColumnIndexInGroup,
    getAdjacentColumn: getAdjacentColumn,
    updateColumnWidth: updateColumnWidth,
    calculateDropPositions: calculateDropPositions,
    getRoundedColumnWidth: getRoundedColumnWidth,
    getColumnsWidth: getColumnsWidth,
    determineColumnWidths: determineColumnWidths,
    resizeColumn: resizeColumn,
    findShrinkableColumnForResize: findShrinkableColumnForResize,
    findShrinkableColumn: findShrinkableColumn,
    createColumn: createColumn
  };
});
//# sourceMappingURL=utils.js.map
