define(["./block", "jquery", "knockout", "underscore", "uiRegistry", "./column/utils", "../../utils/array"], function (_block, _jquery, _knockout, _underscore, _uiRegistry, _utils, _array) {
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
      _this.movePlaceholder = void 0;
      _this.groupElement = void 0;
      _this.resizeGhost = void 0;
      _this.resizeColumnInstance = void 0;
      _this.resizeColumnWidths = [];
      _this.resizeColumnElement = void 0;
      _this.resizeColumnLeft = void 0;
      _this.resizeNextColumn = void 0;
      _this.resizeMaxGhostWidth = void 0;
      _this.resizeMouseDown = false;
      _this.dropOverElement = void 0;
      _this.dropPositions = [];
      _this.dropPosition = void 0;
      _this.movePosition = void 0;

      _this.on('blockReady', _this.addDefaultColumns.bind(_this));

      _this.on('blockRemoved', _this.spreadWidth.bind(_this));

      return _this;
    }
    /**
     * Init the droppable & resizing interactions
     *
     * @param group
     */


    var _proto = ColumnGroup.prototype;

    _proto.initInteractions = function initInteractions(group) {
      var _this2 = this;

      this.groupElement = (0, _jquery)(group);
      this.initDroppable(this.groupElement);
      this.initMouseMove(this.groupElement);
      this.children.subscribe(_underscore.debounce(function () {
        return _this2.bindDraggable(_this2.groupElement);
      }, 50));
    };
    /**
     * Bind draggable instances to the child columns
     *
     * @param {JQuery} group
     */


    _proto.bindDraggable = function bindDraggable(group) {
      var _this3 = this;

      var internalColumns = group.find('>.bluefoot-column');
      internalColumns.draggable({
        handle: '.move-column',
        appendTo: "body",
        revertDuration: 250,
        helper: function helper() {
          var helper = (0, _jquery)(this).clone();
          helper.css({
            'zIndex': 100001,
            'pointerEvents': 'none',
            'opacity': 0.5,
            'width': (0, _jquery)(this).width() + 'px'
          });
          return helper;
        },
        start: function start(event) {
          // Use the global registry as columns can be dragged between groups
          _uiRegistry.set('pageBuilderDragColumn', {
            element: jQuery(event.target),
            instance: _knockout.dataFor(jQuery(event.target)[0])
          });

          _this3.dropPositions = _this3.calculateDropPositions(group);
        },
        stop: function stop(event) {
          var column = _uiRegistry.get('pageBuilderDragColumn');

          if (_this3.movePosition && column) {
            // Check if we're moving within the same group, even though this function will only ever run on the
            // group that bound the draggable event
            if (column.instance.parent === _this3) {
              var currentIndex = _this3.children().indexOf(column.instance);

              var newIndex = _this3.movePosition.insertIndex;

              if (currentIndex !== newIndex) {
                if (currentIndex < newIndex) {
                  // As we're moving an array item the keys all reduce by 1
                  --newIndex;
                }

                (0, _array.moveArrayItem)(_this3.children, currentIndex, newIndex);
              }

              _this3.movePosition = null;
            }
          }

          _uiRegistry.remove('pageBuilderDragColumn');

          _this3.dropPlaceholder.removeClass('left right');

          _this3.movePlaceholder.removeClass('active');
        }
      });
    };
    /**
     * Retrieve the ghost element from the template
     *
     * @param {Element} ghost
     */


    _proto.initGhost = function initGhost(ghost) {
      this.resizeGhost = (0, _jquery)(ghost);
    };
    /**
     * Init the resizing events on the group
     *
     * @param {Element} group
     */


    _proto.initMouseMove = function initMouseMove(group) {
      var _this4 = this;

      group.mousemove(function (e) {
        _this4.handleResizingMouseMove(e, group);

        _this4.handleDraggingMouseMove(e, group);

        _this4.handleDroppingMouseMove(e, group);
      }).mouseout(function () {
        _this4.movePlaceholder.removeClass('active');
      }).mouseup(function () {
        _this4.resizing(false);

        _this4.resizeMouseDown = false;
        _this4.dropPositions = [];

        _this4.dropPlaceholder.removeClass('left right');

        _this4.movePlaceholder.removeClass('active');
      });
    };
    /**
     * Handle the resizing on mouse move
     *
     * @param e
     * @param group
     */


    _proto.handleResizingMouseMove = function handleResizingMouseMove(e, group) {
      var currentPos, currentCol;

      if (this.resizeMouseDown) {
        e.preventDefault();
        currentPos = e.pageX; // Update the ghosts width and position to give a visual indication of the dragging

        var ghostWidth = currentPos - this.resizeColumnLeft;

        if (ghostWidth <= group.width() / (0, _utils.getMaxColumns)()) {
          ghostWidth = group.width() / (0, _utils.getMaxColumns)();
        }

        if (ghostWidth >= group.width() - this.resizeColumnElement.position().left) {
          ghostWidth = group.width() - this.resizeColumnElement.position().left;
        } // Make sure the user can't crush the adjacent column smaller than 1/6


        var adjacentWidth = (0, _utils.getColumnWidth)(this.resizeNextColumn);

        if (adjacentWidth === (0, _utils.getSmallestColumnWidth)() && ghostWidth > this.resizeColumnElement.width() || this.resizeMaxGhostWidth) {
          ghostWidth = this.resizeMaxGhostWidth ? this.resizeMaxGhostWidth : this.resizeColumnElement.width();

          if (!this.resizeMaxGhostWidth) {
            this.resizeMaxGhostWidth = this.resizeColumnElement.width();
          }
        } // Reset the max ghost width when the user moves back from the edge


        if (currentPos - this.resizeColumnLeft < this.resizeColumnElement.width()) {
          this.resizeMaxGhostWidth = null;
        } // We take the border width of the width to ensure it's under the mouse exactly


        this.resizeGhost.width(ghostWidth - 2 + 'px').css('left', this.resizeColumnElement.position().left + 'px');

        if (!this.resizeMaxGhostWidth) {
          currentCol = _underscore.find(this.resizeColumnWidths, function (val) {
            if (currentPos > val.position - 15 && currentPos < val.position + 15) {
              return val;
            }
          });

          if (currentCol) {
            this.resizeColumn(this.resizeColumnInstance, currentCol.width);
          }
        }
      }
    };
    /**
     * Handle a column being dragged around the group
     *
     * @param e
     * @param group
     */


    _proto.handleDraggingMouseMove = function handleDraggingMouseMove(e, group) {
      if (_uiRegistry.get('pageBuilderDragColumn')) {
        // If the drop positions haven't been calculated for this group do so now
        if (this.dropPositions.length === 0) {
          this.dropPositions = this.calculateDropPositions(group);
        }

        var columnInstance = _uiRegistry.get('pageBuilderDragColumn').instance,
            currentX = e.pageX - (0, _jquery)(group).offset().left; // Are we within the same column group or have we ended up over another?


        if (columnInstance.parent === this) {
          var currentColumn = _uiRegistry.get('pageBuilderDragColumn').element,
              lastColInGroup = (0, _jquery)(group).find('.bluefoot-column:last-child'),
              insertLastPos = lastColInGroup.position().left + lastColInGroup.width() / 2; // @todo don't show placeholder next to current column


          this.movePosition = this.dropPositions.find(function (position, index) {
            // Only ever look for the left placement, except the last item where we look on the right
            var placement = currentX >= insertLastPos ? 'right' : 'left'; // There is 200px area over each column borders @todo calculate this

            if (currentX > position[placement] - 100 && currentX < position[placement] + 100 && position.affectedColumn !== columnInstance && // Verify the affected column isn't the current column
            position.placement === placement // Verify the position, we only check left on sorting
            ) {
                return position;
              }
          });

          if (this.movePosition) {
            this.dropPlaceholder.removeClass('left right');
            this.movePlaceholder.css({
              left: this.movePosition.placement === 'left' ? this.movePosition.left : '',
              // @todo investigate why we need to -5
              right: this.movePosition.placement === 'right' ? (0, _jquery)(group).outerWidth() - this.movePosition.right - 5 : ''
            }).addClass('active');
          } else {
            this.movePlaceholder.removeClass('active');
          }
        } else {
          this.movePosition = this.dropPositions.find(function (position) {
            if (currentX > position.left && currentX < position.right && position.canShrink) {
              return position;
            }
          });

          if (this.movePosition) {
            this.movePlaceholder.removeClass('active');
            this.dropPlaceholder.removeClass('left right').css({
              width: (0, _jquery)(group).width() / (0, _utils.getMaxColumns)() + 'px',
              left: this.movePosition.placement === 'left' ? this.movePosition.left : '',
              right: this.movePosition.placement === 'right' ? (0, _jquery)(group).width() - this.movePosition.right : ''
            }).addClass(this.movePosition.placement);
          } else {
            this.dropPlaceholder.removeClass('left right');
          }
        }
      }
    };
    /**
     * Handle mouse move events on when dropping elements
     *
     * @param e
     * @param group
     */


    _proto.handleDroppingMouseMove = function handleDroppingMouseMove(e, group) {
      if (this.dropOverElement) {
        var currentX = e.pageX - (0, _jquery)(group).offset().left;
        this.dropPosition = this.dropPositions.find(function (position) {
          if (currentX > position.left && currentX < position.right && position.canShrink) {
            return position;
          }
        });

        if (this.dropPosition) {
          this.dropPlaceholder.removeClass('left right').css({
            width: (0, _jquery)(group).width() / (0, _utils.getMaxColumns)() + 'px',
            left: this.dropPosition.placement === 'left' ? this.dropPosition.left : '',
            right: this.dropPosition.placement === 'right' ? (0, _jquery)(group).width() - this.dropPosition.right : ''
          }).addClass(this.dropPosition.placement);
        }
      }
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

      (0, _utils.updateColumnWidth)(column, width);

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
        var newWidth = currentAdjacent + -difference;
        (0, _utils.updateColumnWidth)(adjacentColumn, (0, _utils.getAcceptedColumnWidth)(newWidth));
      }
    };
    /**
     * Register a resize handle within a child column, this is called from the column itself
     *
     * @param {Column} column
     * @param {JQuery} handle
     */


    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this5 = this;

      (0, _jquery)(handle).mousedown(function (e) {
        e.preventDefault();

        _this5.resizing(true);

        _this5.resizeColumnInstance = column;
        _this5.resizeColumnElement = handle.parents('.bluefoot-column');
        _this5.resizeColumnWidths = _this5.determineColumnWidths(_this5.resizeColumnElement, _this5.groupElement);
        _this5.resizeColumnLeft = _this5.resizeColumnElement.offset().left;

        var currentIndex = _this5.children().indexOf(column);

        if (typeof _this5.children()[currentIndex + 1] !== 'undefined') {
          _this5.resizeNextColumn = _this5.children()[currentIndex + 1];
        }

        _this5.resizeMaxGhostWidth = null;
        _this5.resizeMouseDown = true;
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
     * Init the move placeholder
     *
     * @param {Element} element
     */


    _proto.initMovePlaceholder = function initMovePlaceholder(element) {
      this.movePlaceholder = (0, _jquery)(element);
    };
    /**
     * Init the droppable functionality for new columns
     *
     * @param element
     */


    _proto.initDroppable = function initDroppable(element) {
      var _this6 = this;

      var currentDraggedBlock;
      (0, _jquery)(element).droppable({
        greedy: true,
        activate: function activate(event) {
          currentDraggedBlock = _knockout.dataFor(event.currentTarget);
        },
        over: function over(event) {
          // Always calculate drop positions when an element is dragged over
          _this6.dropPositions = _this6.calculateDropPositions(element); // Is the element being dragged a column group?

          if (currentDraggedBlock.config.name === _this6.config.name) {
            _this6.dropOverElement = true;
          }
        },
        deactivate: function deactivate() {
          _this6.dropOverElement = false;

          _this6.dropPlaceholder.removeClass('left right');
        },
        out: function out() {
          _this6.dropOverElement = false;

          _this6.dropPlaceholder.removeClass('left right');
        },
        drop: function drop(e, ui) {
          _this6.handleNewColumnDrop(e, ui);

          _this6.handleExistingColumnDrop(e, ui);

          _this6.dropPositions = [];

          _this6.dropPlaceholder.removeClass('left right');
        }
      });
    };
    /**
     * Handle a new column being dropped into the group
     *
     * @param e
     * @param ui
     */


    _proto.handleNewColumnDrop = function handleNewColumnDrop(e, ui) {
      var _this7 = this;

      if (this.dropOverElement && this.dropPosition) {
        this.dropOverElement = false;
        e.preventDefault();
        e.stopImmediatePropagation(); // Remove any dropped items from the DOM

        if (ui.draggable) {
          ui.draggable.remove();
        } // Create our new column


        (0, _utils.createColumn)(this, (0, _utils.getSmallestColumnWidth)(), this.dropPosition.insertIndex).then(function () {
          var newWidth = (0, _utils.getAcceptedColumnWidth)((0, _utils.getColumnWidth)(_this7.dropPosition.affectedColumn) - (0, _utils.getSmallestColumnWidth)()); // Reduce the affected columns width by the smallest column width

          (0, _utils.updateColumnWidth)(_this7.dropPosition.affectedColumn, newWidth);
        });
      }
    };
    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param e
     * @param ui
     */


    _proto.handleExistingColumnDrop = function handleExistingColumnDrop(e, ui) {
      var column = _uiRegistry.get('pageBuilderDragColumn');

      var modifyOldNeighbour; // This should only run when we're dragging between groups

      if (this.movePosition && column && column.instance.parent !== this) {
        e.preventDefault();
        e.stopImmediatePropagation(); // Determine which old neighbour we should modify

        var currentParentChildren = column.instance.parent.children(),
            oldIndex = currentParentChildren.indexOf(column.instance),
            oldWidth = (0, _utils.getColumnWidth)(column.instance);
        console.log(this.stage.store.get(column.instance.id));

        if (typeof currentParentChildren[oldIndex + 1] !== 'undefined') {
          modifyOldNeighbour = currentParentChildren[oldIndex + 1];
        } else if (typeof currentParentChildren[oldIndex - 1] !== 'undefined') {
          modifyOldNeighbour = currentParentChildren[oldIndex - 1];
        } // Set the column to it's smallest column width


        (0, _utils.updateColumnWidth)(column.instance, (0, _utils.getSmallestColumnWidth)());
        column.instance.parent.removeChild(column.instance);
        this.emit('blockInstanceDropped', {
          blockInstance: column.instance,
          index: this.movePosition.insertIndex
        }); // Modify the old neighour

        if (modifyOldNeighbour) {
          var oldNeighbourWidth = (0, _utils.getAcceptedColumnWidth)(oldWidth + (0, _utils.getColumnWidth)(modifyOldNeighbour));
          console.log('old width', oldWidth, modifyOldNeighbour, (0, _utils.getColumnWidth)(modifyOldNeighbour));
          (0, _utils.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
        } // Modify the columns new neighbour


        var newNeighbourWidth = (0, _utils.getAcceptedColumnWidth)((0, _utils.getColumnWidth)(this.movePosition.affectedColumn) - (0, _utils.getSmallestColumnWidth)());
        console.log('new friend width', newNeighbourWidth); // Reduce the affected columns width by the smallest column width

        (0, _utils.updateColumnWidth)(this.movePosition.affectedColumn, newNeighbourWidth);
      }
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

        var left = (0, _jquery)(column).position().left,
            width = (0, _jquery)(column).outerWidth();
        dropPositions.push({
          left: left,
          right: left + width / 2,
          insertIndex: index,
          placement: 'left',
          affectedColumn: columnData,
          canShrink: (0, _utils.getColumnWidth)(columnData) > (0, _utils.getSmallestColumnWidth)()
        });
        dropPositions.push({
          left: left + width / 2,
          right: left + width,
          insertIndex: index + 1,
          placement: 'right',
          affectedColumn: columnData,
          canShrink: (0, _utils.getColumnWidth)(columnData) > (0, _utils.getSmallestColumnWidth)()
        });
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
          (0, _utils.updateColumnWidth)(columnToModify, currentWidth + spreadAmount);
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
