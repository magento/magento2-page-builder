define(["./block", "jquery", "knockout", "underscore", "./column/utils", "../../utils/array"], function (_block, _jquery, _knockout, _underscore, _utils, _array) {
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
      this.initMouseMove(this.groupElement); // We have to re-bind the draggable library to any new children that appear inside the group

      this.children.subscribe(_underscore.debounce(function () {
        return _this2.bindDraggable();
      }, 50));
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
     * Bind draggable instances to the child columns
     *
     * @param {JQuery} group
     */


    _proto.bindDraggable = function bindDraggable() {
      var _this3 = this;

      var internalColumns = this.children().map(function (column) {
        return column.element;
      });
      (0, _jquery)(internalColumns).draggable({
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
          // Use the globla state as columns can be dragged between groups
          _this3.stage.store.update('pageBuilderDragColumn', {
            element: (0, _jquery)(event.target),
            instance: _knockout.dataFor((0, _jquery)(event.target)[0])
          });

          _this3.dropPositions = (0, _utils.calculateDropPositions)(_this3);
        },
        stop: function stop(event) {
          var column = _this3.stage.store.get('pageBuilderDragColumn');

          if (_this3.movePosition && column) {
            // Check if we're moving within the same group, even though this function will only ever run on the
            // group that bound the draggable event
            if (column.instance.parent === _this3) {
              var currentIndex = (0, _utils.getColumnIndexInGroup)(column.instance);
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

          _this3.stage.store.remove('pageBuilderDragColumn');

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

      group.mousemove(function (event) {
        _this4.handleResizingMouseMove(event, group);

        _this4.handleDraggingMouseMove(event, group);

        _this4.handleDroppingMouseMove(event, group);
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
     * @param event
     * @param group
     */


    _proto.handleResizingMouseMove = function handleResizingMouseMove(event, group) {
      var currentPos, currentCol;

      if (this.resizeMouseDown) {
        event.preventDefault();
        currentPos = event.pageX; // Update the ghosts width and position to give a visual indication of the dragging

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
          currentCol = this.resizeColumnWidths.find(function (val) {
            return currentPos > val.position - 15 && currentPos < val.position + 15;
          });

          if (currentCol) {
            (0, _utils.resizeColumn)(this.resizeColumnInstance, currentCol.width);
          }
        }
      }
    };
    /**
     * Handle a column being dragged around the group
     *
     * @param event
     * @param group
     */


    _proto.handleDraggingMouseMove = function handleDraggingMouseMove(event, group) {
      var dragColumn = this.stage.store.get('pageBuilderDragColumn');

      if (dragColumn.element && dragColumn.instance) {
        // If the drop positions haven't been calculated for this group do so now
        if (this.dropPositions.length === 0) {
          this.dropPositions = (0, _utils.calculateDropPositions)(this);
        }

        var columnInstance = dragColumn.instance,
            currentX = event.pageX - (0, _jquery)(group).offset().left; // Are we within the same column group or have we ended up over another?

        if (columnInstance.parent === this) {
          var currentColumn = dragColumn.element,
              lastColInGroup = this.children()[this.children().length - 1].element,
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
     * @param event
     * @param group
     */


    _proto.handleDroppingMouseMove = function handleDroppingMouseMove(event, group) {
      if (this.dropOverElement) {
        var currentX = event.pageX - (0, _jquery)(group).offset().left;
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
     * Register a resize handle within a child column, this is called from the column itself
     *
     * @param {Column} column
     * @param {JQuery} handle
     */


    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this5 = this;

      handle.mousedown(function (event) {
        event.preventDefault();

        _this5.resizing(true);

        _this5.resizeColumnInstance = column;
        _this5.resizeColumnElement = column.element;
        _this5.resizeColumnWidths = (0, _utils.determineColumnWidths)(column, _this5.groupElement);
        _this5.resizeColumnLeft = _this5.resizeColumnElement.offset().left;
        _this5.resizeNextColumn = (0, _utils.getAdjacentColumn)(column, '+1');
        _this5.resizeMaxGhostWidth = null;
        _this5.resizeMouseDown = true;
      });
    };
    /**
     * Init the droppable functionality for new columns
     *
     * @param {Element} group
     */


    _proto.initDroppable = function initDroppable(group) {
      var _this6 = this;

      var currentDraggedBlock;
      group.droppable({
        greedy: true,
        activate: function activate(event) {
          currentDraggedBlock = _knockout.dataFor(event.currentTarget);
        },
        over: function over(event) {
          // Always calculate drop positions when an element is dragged over
          _this6.dropPositions = (0, _utils.calculateDropPositions)(_this6); // Is the element being dragged a column group?

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
        drop: function drop(event, ui) {
          _this6.handleNewColumnDrop(event, ui);

          _this6.handleExistingColumnDrop(event);

          _this6.dropPositions = [];

          _this6.dropPlaceholder.removeClass('left right');
        }
      });
    };
    /**
     * Handle a new column being dropped into the group
     *
     * @param event
     * @param ui
     */


    _proto.handleNewColumnDrop = function handleNewColumnDrop(event, ui) {
      var _this7 = this;

      if (this.dropOverElement && this.dropPosition) {
        this.dropOverElement = false;
        event.preventDefault();
        event.stopImmediatePropagation(); // Remove any dropped items from the DOM

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
     * @param {Event} event
     */


    _proto.handleExistingColumnDrop = function handleExistingColumnDrop(event) {
      var column = this.stage.store.get('pageBuilderDragColumn');
      var modifyOldNeighbour; // This should only run when we're dragging between groups

      if (this.movePosition && column.element && column.instance && column.instance.parent !== this) {
        event.preventDefault();
        event.stopImmediatePropagation(); // Determine which old neighbour we should modify

        var oldWidth = (0, _utils.getColumnWidth)(column.instance); // Retrieve the adjacent column either +1 or -1

        if ((0, _utils.getAdjacentColumn)(column.instance, '+1')) {
          modifyOldNeighbour = (0, _utils.getAdjacentColumn)(column.instance, '+1');
        } else if ((0, _utils.getAdjacentColumn)(column.instance, '-1')) {
          modifyOldNeighbour = (0, _utils.getAdjacentColumn)(column.instance, '-1');
        } // Set the column to it's smallest column width


        (0, _utils.updateColumnWidth)(column.instance, (0, _utils.getSmallestColumnWidth)());
        column.instance.parent.removeChild(column.instance);
        this.emit('blockInstanceDropped', {
          blockInstance: column.instance,
          index: this.movePosition.insertIndex
        }); // Modify the old neighbour

        if (modifyOldNeighbour) {
          var oldNeighbourWidth = (0, _utils.getAcceptedColumnWidth)(oldWidth + (0, _utils.getColumnWidth)(modifyOldNeighbour));
          (0, _utils.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
        } // Modify the columns new neighbour


        var newNeighbourWidth = (0, _utils.getAcceptedColumnWidth)((0, _utils.getColumnWidth)(this.movePosition.affectedColumn) - (0, _utils.getSmallestColumnWidth)()); // Reduce the affected columns width by the smallest column width

        (0, _utils.updateColumnWidth)(this.movePosition.affectedColumn, newNeighbourWidth);
      }
    };
    /**
     * Spread any empty space across the other columns
     *
     * @param {Event} event
     * @param params
     */


    _proto.spreadWidth = function spreadWidth(event, params) {
      if (this.children().length === 0) {
        this.parent.removeChild(this);
        return;
      }

      var availableWidth = 100 - (0, _utils.getColumnsWidth)(this),
          formattedAvailableWidth = (0, _utils.getRoundedColumnWidth)(availableWidth),
          totalChildColumns = this.children().length;
      var allowedColumnWidths = [],
          spreadAcross = 1,
          spreadAmount;

      for (var i = (0, _utils.getMaxColumns)(); i > 0; i--) {
        allowedColumnWidths.push((0, _utils.getRoundedColumnWidth)(100 / 6 * i));
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
          (0, _utils.updateColumnWidth)(columnToModify, (0, _utils.getColumnWidth)(columnToModify) + spreadAmount);
        }
      }
    };

    return ColumnGroup;
  }(_block);

  return ColumnGroup;
});
//# sourceMappingURL=column-group.js.map
