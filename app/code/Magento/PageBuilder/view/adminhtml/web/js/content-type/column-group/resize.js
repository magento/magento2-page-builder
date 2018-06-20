/*eslint-disable */
define(["Magento_PageBuilder/js/utils/array"], function (_array) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ResizeUtils =
  /*#__PURE__*/
  function () {
    function ResizeUtils(columnGroup) {
      this.columnGroup = void 0;
      this.columnGroup = columnGroup;
    }
    /**
     * Get the grid size for this columnGroup
     *
     * @returns {number}
     */


    var _proto = ResizeUtils.prototype;

    _proto.getGridSize = function getGridSize() {
      return parseInt(this.columnGroup.dataStore.getKey("gridSize").toString(), 10);
    };
    /**
     * Get the smallest column width possible
     *
     * @returns {number}
     */


    _proto.getSmallestColumnWidth = function getSmallestColumnWidth() {
      var gridSize = this.getGridSize();
      return this.getAcceptedColumnWidth(parseFloat((100 / gridSize).toString()).toFixed(Math.round(100 / gridSize) !== 100 / gridSize ? 8 : 0));
    };
    /**
     * Get an accepted column width to resolve rounding issues, e.g. turn 49.995% into 50%
     *
     * @param width
     * @returns {number}
     */


    _proto.getAcceptedColumnWidth = function getAcceptedColumnWidth(width) {
      var gridSize = this.getGridSize();
      var newWidth = 0;

      for (var i = gridSize; i > 0; i--) {
        var percentage = parseFloat((100 / gridSize * i).toFixed(Math.round(100 / gridSize * i) !== 100 / gridSize * i ? 8 : 0)); // Allow for rounding issues

        if (parseFloat(width) > percentage - 0.1 && parseFloat(width) < percentage + 0.1) {
          newWidth = percentage;
          break;
        }
      }

      return newWidth;
    };
    /**
     * Return the width of the column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @returns {number}
     */


    _proto.getColumnWidth = function getColumnWidth(column) {
      return this.getAcceptedColumnWidth(column.dataStore.get().width.toString());
    };
    /**
     * Retrieve the index of the column within it's group
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @returns {number}
     */


    _proto.getColumnIndexInGroup = function getColumnIndexInGroup(column) {
      return column.parent.children().indexOf(column);
    };
    /**
     * Retrieve the adjacent column based on a direction of +1 or -1
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {"+1" | "-1"} direction
     * @returns {ContentTypeCollectionInterface<ColumnPreview>}
     */


    _proto.getAdjacentColumn = function getAdjacentColumn(column, direction) {
      var currentIndex = this.getColumnIndexInGroup(column);

      if (typeof column.parent.children()[currentIndex + parseInt(direction, 10)] !== "undefined") {
        return column.parent.children()[currentIndex + parseInt(direction, 10)];
      }

      return null;
    };
    /**
     * Get the total width of all columns in the group
     *
     * @returns {number}
     */


    _proto.getColumnsWidth = function getColumnsWidth() {
      var _this = this;

      return this.getAcceptedColumnWidth(this.columnGroup.children().map(function (column) {
        return _this.getColumnWidth(column);
      }).reduce(function (widthA, widthB) {
        return widthA + (widthB ? widthB : 0);
      }).toString());
    };
    /**
     * Determine the pixel position of every column that can be created within the group
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {GroupPositionCache} groupPosition
     * @returns {ColumnWidth[]}
     */


    _proto.determineColumnWidths = function determineColumnWidths(column, groupPosition) {
      var gridSize = this.getGridSize();
      var singleColumnWidth = groupPosition.outerWidth / gridSize;
      var adjacentColumn = this.getAdjacentColumn(column, "+1");
      var columnWidths = [];
      var columnLeft = column.preview.element.offset().left - parseInt(column.preview.element.css("margin-left"), 10);
      var adjacentRightPosition = adjacentColumn.preview.element.offset().left + adjacentColumn.preview.element.outerWidth(true); // Determine the maximum size (in pixels) that this column can be dragged to

      var columnsToRight = column.parent.children().length - (this.getColumnIndexInGroup(column) + 1);
      var leftMaxWidthFromChildren = groupPosition.left + groupPosition.outerWidth - columnsToRight * singleColumnWidth + 10;
      var rightMaxWidthFromChildren = groupPosition.left + (column.parent.children().length - columnsToRight) * singleColumnWidth - 10; // Due to rounding we add a threshold of 10
      // Iterate through the amount of columns generating the position for both left & right interactions

      for (var i = gridSize; i > 0; i--) {
        var position = Math.round(columnLeft + singleColumnWidth * i);

        if (position > Math.round(leftMaxWidthFromChildren)) {
          continue;
        }

        columnWidths.push({
          forColumn: "left",
          // These positions are for the left column in the pair
          name: i + "/" + gridSize,
          position: position,
          width: this.getRoundedColumnWidth(100 / gridSize * i)
        });
      }

      for (var _i = 1; _i < gridSize; _i++) {
        var _position = Math.floor(adjacentRightPosition - _i * singleColumnWidth);

        if (_position < Math.floor(rightMaxWidthFromChildren)) {
          continue;
        } // The right interaction is only used when we're crushing a column that isn't adjacent


        columnWidths.push({
          forColumn: "right",
          // These positions are for the left column in the pair
          name: _i + "/" + gridSize,
          position: _position,
          width: this.getRoundedColumnWidth(100 / gridSize * _i)
        });
      }

      return columnWidths;
    };
    /**
     * Determine the max ghost width based on the calculated columns
     *
     * @param {ColumnWidth[]} columnWidths
     * @returns {MaxGhostWidth}
     */


    _proto.determineMaxGhostWidth = function determineMaxGhostWidth(columnWidths) {
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
    };
    /**
     * Find a column which can be shrunk for the current resize action
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {"left" | "right"} direction
     * @returns {ContentTypeCollectionInterface<ColumnPreview>}
     */


    _proto.findShrinkableColumnForResize = function findShrinkableColumnForResize(column, direction) {
      var _this2 = this;

      var currentIndex = this.getColumnIndexInGroup(column);
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
        return _this2.getColumnWidth(groupColumn) > _this2.getSmallestColumnWidth();
      });
    };
    /**
     * Find a shrinkable column outwards from the current column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @returns {ContentTypeCollectionInterface<ColumnPreview>}
     */


    _proto.findShrinkableColumn = function findShrinkableColumn(column) {
      var _this3 = this;

      return (0, _array.outwardSearch)(column.parent.children(), this.getColumnIndexInGroup(column), function (neighbourColumn) {
        return _this3.getColumnWidth(neighbourColumn) > _this3.getSmallestColumnWidth();
      });
    };
    /**
     * Return the column width to 8 decimal places if it's not a whole number
     *
     * @param {number} width
     * @returns {string}
     */


    _proto.getRoundedColumnWidth = function getRoundedColumnWidth(width) {
      return Number(width.toFixed(Math.round(width) !== width ? 8 : 0));
    };
    /**
     * Calculate the ghost size for the resizing action
     *
     * @param {GroupPositionCache} groupPosition
     * @param {number} currentPos
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {string} modifyColumnInPair
     * @param {MaxGhostWidth} maxGhostWidth
     * @returns {number}
     */


    _proto.calculateGhostWidth = function calculateGhostWidth(groupPosition, currentPos, column, modifyColumnInPair, maxGhostWidth) {
      var ghostWidth = currentPos - groupPosition.left;

      switch (modifyColumnInPair) {
        case "left":
          var singleColumnWidth = column.preview.element.position().left + groupPosition.outerWidth / this.getGridSize(); // Don't allow the ghost widths be less than the smallest column

          if (ghostWidth <= singleColumnWidth) {
            ghostWidth = singleColumnWidth;
          }

          if (currentPos >= maxGhostWidth.left) {
            ghostWidth = maxGhostWidth.left - groupPosition.left;
          }

          break;

        case "right":
          if (currentPos <= maxGhostWidth.right) {
            ghostWidth = maxGhostWidth.right - groupPosition.left;
          }

          break;
      }

      return ghostWidth;
    };
    /**
     * Determine which column in the group should be adjusted for the current resize action
     *
     * @param {number} currentPos
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {ResizeHistory} history
     * @returns {[ContentTypeCollectionInterface<ColumnPreview>, string, string]}
     */


    _proto.determineAdjustedColumn = function determineAdjustedColumn(currentPos, column, history) {
      var modifyColumnInPair = "left";
      var usedHistory;
      var resizeColumnLeft = column.preview.element.offset().left - parseInt(column.preview.element.css("margin-left"), 10);
      var resizeColumnWidth = column.preview.element.outerWidth(true);
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
          adjustedColumn = this.findShrinkableColumnForResize(column, "right");
        }
      } else {
        if (this.getColumnWidth(column) <= this.getSmallestColumnWidth()) {
          adjustedColumn = this.findShrinkableColumnForResize(column, "left");

          if (adjustedColumn) {
            modifyColumnInPair = "right";
          }
        } else if (history.right.length > 0) {
          usedHistory = "right";
          adjustedColumn = history.right.reverse()[0].adjustedColumn;
          modifyColumnInPair = history.right.reverse()[0].modifyColumnInPair;
        } else {
          // If we're shrinking our column we can just increase the adjacent column
          adjustedColumn = this.getAdjacentColumn(column, "+1");
        }
      }

      return [adjustedColumn, modifyColumnInPair, usedHistory];
    };
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


    _proto.comparator = function comparator(num1, num2, threshold) {
      return num1 > num2 - threshold / 2 && num1 < num2 + threshold / 2;
    };
    /**
     * Resize a column to a specific width
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} width
     * @param {ContentTypeCollectionInterface<ColumnPreview>} shrinkableColumn
     */


    _proto.resizeColumn = function resizeColumn(column, width, shrinkableColumn) {
      var current = this.getColumnWidth(column);
      var difference = (parseFloat(width.toString()) - current).toFixed(8); // Don't run the update if we've already modified the column

      if (current === parseFloat(width.toString()) || parseFloat(width.toString()) < this.getSmallestColumnWidth()) {
        return;
      } // Also shrink the closest shrinkable column


      var allowedToShrink = true;

      if (difference && shrinkableColumn) {
        var currentShrinkable = this.getColumnWidth(shrinkableColumn);
        var shrinkableSize = this.getAcceptedColumnWidth((currentShrinkable + -difference).toString()); // Ensure the column we're crushing is not becoming the same size, and it's not less than the smallest width

        if (currentShrinkable === parseFloat(shrinkableSize.toString()) || parseFloat(shrinkableSize.toString()) < this.getSmallestColumnWidth()) {
          allowedToShrink = false;
        } else {
          this.updateColumnWidth(shrinkableColumn, shrinkableSize);
        }
      }

      if (allowedToShrink) {
        this.updateColumnWidth(column, width);
      }
    };
    /**
     * Update the width of a column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} width
     */


    _proto.updateColumnWidth = function updateColumnWidth(column, width) {
      column.dataStore.update(parseFloat(width.toString()) + "%", "width");
    };

    return ResizeUtils;
  }();

  return ResizeUtils;
});
//# sourceMappingURL=resize.js.map
