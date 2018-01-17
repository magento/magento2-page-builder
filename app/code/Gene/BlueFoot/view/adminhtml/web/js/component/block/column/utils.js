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
    return getAcceptedColumnWidth(parseFloat(100 / getMaxColumns()).toFixed(Math.round(100 / getMaxColumns()) !== 100 / getMaxColumns() ? 8 : 0));
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

      if (width > percentage - 0.1 && width < percentage + 0.1) {
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
    return parseFloat(column.stage.store.get(column.id).width);
  }
  /**
   * Update the width of a column
   *
   * @param {Column} column
   * @param {number} width
   */


  function updateColumnWidth(column, width) {
    column.stage.store.updateKey(column.id, parseFloat(width) + '%', 'width');
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
      width: parseFloat(width) + '%'
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
    updateColumnWidth: updateColumnWidth,
    createColumn: createColumn
  };
});
//# sourceMappingURL=utils.js.map
