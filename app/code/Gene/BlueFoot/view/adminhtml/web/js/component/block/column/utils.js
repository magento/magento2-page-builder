define(["../../config", "../factory"], function (_config, _factory) {
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

    if (typeof column.parent.children()[currentIndex + parseInt(direction)] !== 'undefined') {
      return column.parent.children()[currentIndex + parseInt(direction)];
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
    column.stage.store.updateKey(column.id, parseFloat(width.toString()) + '%', 'width');
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
      var left = column.element.position().left,
          width = column.element.outerWidth(),
          canShrink = getColumnWidth(column) > getSmallestColumnWidth();
      dropPositions.push({
        left: left,
        right: left + width / 2,
        insertIndex: index,
        placement: 'left',
        affectedColumn: column,
        canShrink: canShrink
      }, {
        left: left + width / 2,
        right: left + width,
        insertIndex: index + 1,
        placement: 'right',
        affectedColumn: column,
        canShrink: canShrink
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
    return width.toFixed(Math.round(width) !== width ? 8 : 0);
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
   * @returns {any[]}
   */


  function determineColumnWidths(column, group) {
    var columnWidth = group.width() / getMaxColumns(),
        groupLeftPos = column.element.offset().left;
    var columnWidths = [];

    for (var i = getMaxColumns(); i > 0; i--) {
      columnWidths.push({
        position: Math.round(groupLeftPos + columnWidth * i),
        name: i + '/' + getMaxColumns(),
        width: getRoundedColumnWidth(100 / getMaxColumns() * i)
      });
    }

    return columnWidths;
  }
  /**
   * Resize a column to a specific width
   *
   * @param {Column} column
   * @param {number} width
   */


  function resizeColumn(column, width) {
    var current = getColumnWidth(column),
        difference = (parseFloat(width.toString()) - current).toFixed(8); // Don't run the update if we've already modified the column

    if (current === parseFloat(width.toString())) {
      return;
    }

    updateColumnWidth(column, width);

    if (difference) {
      resizeAdjacentColumn(column, difference);
    }
  }
  /**
   * Resize the adjacent column to the current
   *
   * @param {Column} column
   * @param {number} difference
   */


  function resizeAdjacentColumn(column, difference) {
    var columnChildren = column.parent.children(),
        columnIndex = columnChildren.indexOf(column);

    if (typeof columnChildren[columnIndex + 1] !== 'undefined') {
      var adjacentColumn = columnChildren[columnIndex + 1],
          currentAdjacent = getColumnWidth(adjacentColumn);
      var newWidth = currentAdjacent + -difference;
      updateColumnWidth(adjacentColumn, getAcceptedColumnWidth(newWidth.toString()));
    }
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
    return (0, _factory)(_config.getContentTypeConfig('column'), parent, parent.stage, {
      width: parseFloat(width.toString()) + '%'
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
    createColumn: createColumn
  };
});
//# sourceMappingURL=utils.js.map
