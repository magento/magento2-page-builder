define(["./block", "jquery", "knockout", "./column/utils"], function (_block, _jquery, _knockout, _utils) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ColumnGroup =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ColumnGroup, _Block);

    function ColumnGroup(parent, stage, config, formData, appearance) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData, appearance) || this;
      _this.resizing = _knockout.observable(false);
      _this.dropPlaceholder = void 0;
      _this.resizeGhost = void 0;
      _this.resizeGroup = void 0;
      _this.resizeColumnInstance = void 0;
      _this.resizeColumnWidths = [];
      _this.resizeColumnElement = void 0;
      _this.resizeColumnLeft = void 0;
      _this.resizeNextColumn = void 0;
      _this.resizeMaxGhostWidth = void 0;
      _this.resizeMouseDown = false;

      _this.on('blockReady', _this.addDefaultColumns.bind(_this));

      _this.on('blockRemoved', _this.spreadWidth.bind(_this));

      return _this;
    }
    /**
     * Init the droppable & resizing interactions
     *
     * @param element
     */


    var _proto = ColumnGroup.prototype;

    _proto.initInteractions = function initInteractions(element) {
      this.initDroppable(element);
      this.initResizing(element);
    };
    /**
     * Retrieve the ghost element from the template
     *
     * @param {Element} element
     */


    _proto.initGhost = function initGhost(element) {
      this.resizeGhost = (0, _jquery)(element);
    };
    /**
     * Init the resizing events on the group
     * 
     * @param {Element} group
     */


    _proto.initResizing = function initResizing(group) {
      var _this2 = this;

      var currentPos, currentCol;
      this.resizeGroup = group = (0, _jquery)(group);
      group.mousemove(function (e) {
        if (_this2.resizeMouseDown) {
          e.preventDefault();
          currentPos = e.pageX; // Update the ghosts width and position to give a visual indication of the dragging

          var ghostWidth = currentPos - _this2.resizeColumnLeft;

          if (ghostWidth <= group.width() / (0, _utils.getMaxColumns)()) {
            ghostWidth = group.width() / (0, _utils.getMaxColumns)();
          }

          if (ghostWidth >= group.width() - _this2.resizeColumnElement.position().left) {
            ghostWidth = group.width() - _this2.resizeColumnElement.position().left;
          } // Make sure the user can't crush the adjacent column smaller than 1/6


          var adjacentWidth = (0, _utils.getColumnWidth)(_this2.resizeNextColumn);

          if (adjacentWidth === (0, _utils.getSmallestColumnWidth)() && ghostWidth > _this2.resizeColumnElement.width() || _this2.maxGhostWidth) {
            ghostWidth = _this2.maxGhostWidth ? _this2.maxGhostWidth : _this2.resizeColumnElement.width();

            if (!_this2.maxGhostWidth) {
              _this2.maxGhostWidth = _this2.resizeColumnElement.width();
            }
          } // Reset the max ghost width when the user moves back from the edge


          if (currentPos - _this2.resizeColumnLeft < _this2.resizeColumnElement.width()) {
            _this2.maxGhostWidth = null;
          } // We take the border width of the width to ensure it's under the mouse exactly


          _this2.resizeGhost.width(ghostWidth - 2 + 'px').css('left', _this2.resizeColumnElement.position().left + 'px');

          if (!_this2.maxGhostWidth) {
            currentCol = _.find(_this2.resizeColumnWidths, function (val) {
              if (currentPos > val.position - 15 && currentPos < val.position + 15) {
                return val;
              }
            });

            if (currentCol) {
              _this2.resizeColumn(_this2.resizeColumnInstance, currentCol.width);
            }
          }
        }
      }).mouseup(function () {
        _this2.resizing(false);

        _this2.resizeMouseDown = false;
      });
    };
    /**
     * Resize a column to a specific width
     *
     * @param {Column} column
     * @param {number} width
     */


    _proto.resizeColumn = function resizeColumn(column, width) {
      var current = (0, _utils.getColumnWidth)(column),
          difference = (parseFloat(width) - current).toFixed(8); // Don't run the update if we've already modified the column

      if (current === parseFloat(width)) {
        return;
      }

      this.stage.store.updateKey(column.id, width + '%', 'width');

      if (difference) {
        this.resizeAdjacentColumn(column, difference);
      }
    };
    /**
     * Resize the adjacent column to the current
     *
     * @param {Column} column
     * @param {number} difference
     */


    _proto.resizeAdjacentColumn = function resizeAdjacentColumn(column, difference) {
      var columnIndex = this.children().indexOf(column);

      if (typeof this.children()[columnIndex + 1] !== 'undefined') {
        var adjacentColumn = this.children()[columnIndex + 1],
            currentAdjacent = (0, _utils.getColumnWidth)(adjacentColumn);
        var newWidth = parseFloat(currentAdjacent) + -difference;
        this.stage.store.updateKey(adjacentColumn.id, (0, _utils.getAcceptedColumnWidth)(newWidth) + '%', 'width');
      }
    };
    /**
     * Register a resize handle within a child column
     *
     * @param {Column} column
     * @param {JQuery} handle
     */


    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this3 = this;

      (0, _jquery)(handle).mousedown(function (e) {
        e.preventDefault();

        _this3.resizing(true);

        _this3.resizeColumnInstance = column;
        _this3.resizeColumnElement = handle.parents('.bluefoot-column');
        _this3.resizeColumnWidths = _this3.determineColumnWidths(_this3.resizeColumnElement, _this3.resizeGroup);
        _this3.resizeColumnLeft = _this3.resizeColumnElement.offset().left;

        var currentIndex = _this3.children().indexOf(column);

        if (typeof _this3.children()[currentIndex + 1] !== 'undefined') {
          _this3.resizeNextColumn = _this3.children()[currentIndex + 1];
        }

        _this3.maxGhostWidth = null;
        _this3.resizeMouseDown = true;
      });
    };
    /**
     * Determine the pixel position of every column that can be created within the group
     *
     * @param {JQuery} column
     * @param {JQuery} group
     * @returns {any[]}
     */


    _proto.determineColumnWidths = function determineColumnWidths(column, group) {
      var columnWidth = group.width() / (0, _utils.getMaxColumns)(),
          groupLeftPos = column.offset().left;
      var columnWidths = [],
          columnLeftPos;

      for (var i = (0, _utils.getMaxColumns)(); i > 0; i--) {
        columnWidths.push({
          position: Math.round(groupLeftPos + columnWidth * i),
          name: i + '/' + (0, _utils.getMaxColumns)(),
          width: (100 / (0, _utils.getMaxColumns)() * i).toFixed(Math.round(100 / (0, _utils.getMaxColumns)() * i) !== 100 / (0, _utils.getMaxColumns)() * i ? 8 : 0)
        });
      }

      return columnWidths;
    };
    /**
     * Add the default columns to the group on creation
     */


    _proto.addDefaultColumns = function addDefaultColumns() {
      if (this.children().length === 0) {
        (0, _utils.createColumn)(this, 50);
        (0, _utils.createColumn)(this, 50);
      }
    };
    /**
     * Init the drop placeholder
     *
     * @param element
     */


    _proto.initDropPlaceholder = function initDropPlaceholder(element) {
      this.dropPlaceholder = (0, _jquery)(element);
    };
    /**
     * Init the droppable functionality for new columns
     *
     * @param element
     */


    _proto.initDroppable = function initDroppable(element) {
      var _this4 = this;

      var currentDraggedBlock,
          dropPositions,
          parentX = (0, _jquery)(element).offset().left,
          overlayWidth = (0, _jquery)(element).width() / 6,
          overElement = false,
          dropPosition,
          parentSortable = (0, _jquery)(element).parents('.ui-sortable')[0];
      (0, _jquery)(element).droppable({
        greedy: true,
        activate: function activate(event) {
          currentDraggedBlock = _knockout.dataFor(event.currentTarget);
        },
        over: function over(event) {
          // Is the element being dragged a column group?
          if (currentDraggedBlock.config.name === _this4.config.name) {
            overElement = true;
            dropPositions = _this4.calculateDropPositions(element);
            console.log(dropPositions);
          }
        },
        deactivate: function deactivate() {
          overElement = false;

          _this4.dropPlaceholder.removeClass('left right');
        },
        out: function out() {
          overElement = false;

          _this4.dropPlaceholder.removeClass('left right');
        },
        drop: function drop(e) {
          if (overElement && dropPosition) {
            overElement = false;
            e.preventDefault();
            e.stopImmediatePropagation(); // Create our new column

            (0, _utils.createColumn)(_this4, (0, _utils.getSmallestColumnWidth)(), dropPosition.insertIndex).then(function () {
              var newWidth = (0, _utils.getAcceptedColumnWidth)((0, _utils.getColumnWidth)(dropPosition.affectedColumn) - (0, _utils.getSmallestColumnWidth)()); // Reduce the affected columns width by the smallest column width

              _this4.stage.store.updateKey(dropPosition.affectedColumn.id, newWidth + '%', 'width');
            });
          }

          _this4.dropPlaceholder.removeClass('left right');
        }
      }).mousemove(function (e) {
        if (overElement) {
          var currentX = e.pageX - parentX;
          dropPosition = dropPositions.find(function (position) {
            if (currentX > position.left && currentX < position.right) {
              return position;
            }
          });

          if (dropPosition) {
            _this4.dropPlaceholder.removeClass('left right').css({
              width: overlayWidth + 'px',
              left: dropPosition.placement === 'left' ? dropPosition.left : '',
              right: dropPosition.placement === 'right' ? (0, _jquery)(element).width() - dropPosition.right : ''
            }).addClass(dropPosition.placement);
          }
        }
      });
    };
    /**
     * Calculate the various drop positions that columns can be added within
     *
     * @param element
     * @returns {any[]}
     */


    _proto.calculateDropPositions = function calculateDropPositions(element) {
      var dropPositions = [];
      (0, _jquery)(element).find('>*').each(function (index, column) {
        var columnData = _knockout.dataFor(column);

        if ((0, _utils.getColumnWidth)(columnData) > (0, _utils.getSmallestColumnWidth)()) {
          var left = (0, _jquery)(column).position().left,
              width = (0, _jquery)(column).width();
          dropPositions.push({
            left: left,
            right: left + width / 2,
            insertIndex: index,
            placement: 'left',
            affectedColumn: columnData
          });
          dropPositions.push({
            left: left + width / 2,
            right: left + width,
            insertIndex: index + 1,
            placement: 'right',
            affectedColumn: columnData
          });
        }
      });
      return dropPositions;
    };
    /**
     * Spread any empty space across the other columns
     *
     * @param event
     * @param params
     */


    _proto.spreadWidth = function spreadWidth(event, params) {
      if (this.children().length === 0) {
        this.parent.removeChild(this);
        return;
      }

      var availableWidth = 100 - this.getColumnsWidth(),
          formattedAvailableWidth = parseFloat(availableWidth).toFixed(Math.round(availableWidth) !== availableWidth ? 8 : 0),
          totalChildColumns = this.children().length;
      var allowedColumnWidths = [],
          spreadAcross = 1,
          spreadAmount;

      for (var i = (0, _utils.getMaxColumns)(); i > 0; i--) {
        allowedColumnWidths.push(parseFloat((100 / 6 * i).toFixed(Math.round(100 / 6 * i) !== 100 / 6 * i ? 8 : 0)));
      } // Determine how we can spread the empty space across the columns


      traverseChildren: for (var _i = totalChildColumns; _i > 0; _i--) {
        var potentialWidth = formattedAvailableWidth / _i;

        for (var _i2 = 0; _i2 < allowedColumnWidths.length; _i2++) {
          var width = allowedColumnWidths[_i2];

          if (Math.floor(potentialWidth) == Math.floor(width)) {
            spreadAcross = _i;
            spreadAmount = formattedAvailableWidth / _i;
            break traverseChildren;
          }
        }
      } // Let's spread the width across the columns


      for (var _i3 = 1; _i3 <= spreadAcross; _i3++) {
        // Let's look left
        var columnToModify = void 0; // As the original column has been removed from the array, check the new index for a column

        if (params.index <= this.children().length && typeof this.children()[params.index] !== 'undefined') {
          columnToModify = this.children()[params.index];
        } // As far as I can tell this statement will never run, however leaving it in as it might when more columns are present


        if (!columnToModify && params.index + _i3 <= this.children().length && typeof this.children()[params.index + _i3] !== 'undefined') {
          columnToModify = this.children()[params.index + _i3];
        }

        if (!columnToModify && params.index - _i3 >= 0 && typeof this.children()[params.index - _i3] !== 'undefined') {
          columnToModify = this.children()[params.index - _i3];
        }

        if (columnToModify) {
          var currentWidth = (0, _utils.getColumnWidth)(columnToModify);
          this.stage.store.updateKey(columnToModify.id, currentWidth + spreadAmount + '%', 'width');
        }
      }
    };
    /**
     * Retrieve the total width of all columns in the group
     *
     * @returns {any}
     */


    _proto.getColumnsWidth = function getColumnsWidth() {
      return this.children().map(function (column) {
        return (0, _utils.getColumnWidth)(column);
      }).reduce(function (widthA, widthB) {
        return widthA + (widthB ? widthB : 0);
      });
    };

    return ColumnGroup;
  }(_block);

  return ColumnGroup;
});
//# sourceMappingURL=column-group.js.map
