/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "uiRegistry", "underscore", "../../utils/array", "./block", "./column/utils"], function (_jquery, _knockout, _translate, _uiRegistry, _underscore, _array, _block, _utils) {
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
      _this.resizeMaxGhostWidth = void 0;
      _this.resizeMouseDown = void 0;
      _this.resizeLeftLastColumnShrunk = void 0;
      _this.resizeRightLastColumnShrunk = void 0;
      _this.resizeLastPosition = void 0;
      _this.resizeHistory = {
        left: [],
        right: []
      };
      _this.dropOverElement = void 0;
      _this.dropPositions = [];
      _this.dropPosition = void 0;
      _this.movePosition = void 0;
      _this.debounceBindDraggable = _underscore.debounce(function () {
        return _this.bindDraggable();
      }, 150);

      _this.on("blockReady", _this.addDefaultColumns.bind(_this));

      _this.on("blockRemoved", _this.spreadWidth.bind(_this));

      _this.children.subscribe(_underscore.debounce(_this.removeIfEmpty.bind(_this), 50));

      return _this;
    }
    /**
     * Init the droppable & resizing interactions
     *
     * @param group
     */


    var _proto = ColumnGroup.prototype;

    _proto.bindInteractions = function bindInteractions(group) {
      this.groupElement = (0, _jquery)(group);
      this.initDroppable(this.groupElement);
      this.initMouseMove(this.groupElement); // We have to re-bind the draggable library to any new children that appear inside the group

      this.children.subscribe(this.debounceBindDraggable.bind(this));
      this.debounceBindDraggable();
    };
    /**
     * Init the drop placeholder
     *
     * @param element
     */


    _proto.bindDropPlaceholder = function bindDropPlaceholder(element) {
      this.dropPlaceholder = (0, _jquery)(element);
    };
    /**
     * Init the move placeholder
     *
     * @param {Element} element
     */


    _proto.bindMovePlaceholder = function bindMovePlaceholder(element) {
      this.movePlaceholder = (0, _jquery)(element);
    };
    /**
     * Retrieve the ghost element from the template
     *
     * @param {Element} ghost
     */


    _proto.bindGhost = function bindGhost(ghost) {
      this.resizeGhost = (0, _jquery)(ghost);
    };
    /**
     * Register a resize handle within a child column, this is called from the column itself
     *
     * @param {Column} column
     * @param {JQuery<HTMLElement>} handle
     */


    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this2 = this;

      handle.mousedown(function (event) {
        event.preventDefault();

        _this2.resizing(true);

        _this2.resizeColumnInstance = column;
        _this2.resizeColumnWidths = (0, _utils.determineColumnWidths)(_this2.resizeColumnInstance, _this2.groupElement); // Set a flag of the columns which are currently being resized

        _this2.setColumnsAsResizing(column, (0, _utils.getAdjacentColumn)(column, "+1")); // Force the cursor to resizing


        (0, _jquery)("body").css("cursor", "col-resize"); // Reset the resize history

        _this2.resizeHistory = {
          left: [],
          right: []
        };
        _this2.resizeLastPosition = null;
        _this2.resizeMaxGhostWidth = null;
        _this2.resizeMouseDown = true;
      });
    };
    /**
     * Duplicate a child of the current instance
     *
     * @param {Column} child
     * @param {boolean} autoAppend
     * @returns {Structural}
     */


    _proto.duplicateChild = function duplicateChild(child, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var duplicate; // Attempt to split the current column into parts

      var splitTimes = Math.round((0, _utils.getColumnWidth)(child) / (0, _utils.getSmallestColumnWidth)());

      if (splitTimes > 1) {
        duplicate = _Block.prototype.duplicateChild.call(this, child, autoAppend);
        var originalWidth = 0;
        var duplicateWidth = 0;

        for (var i = 0; i <= splitTimes; i++) {
          if (splitTimes > 0) {
            originalWidth += (0, _utils.getSmallestColumnWidth)();
            --splitTimes;
          }

          if (splitTimes > 0) {
            duplicateWidth += (0, _utils.getSmallestColumnWidth)();
            --splitTimes;
          }
        }

        (0, _utils.updateColumnWidth)(child, (0, _utils.getAcceptedColumnWidth)(originalWidth.toString()));
        (0, _utils.updateColumnWidth)(duplicate, (0, _utils.getAcceptedColumnWidth)(duplicateWidth.toString()));
        return duplicate;
      } else {
        // Conduct an outward search on the children to locate a suitable shrinkable column
        var shrinkableColumn = (0, _utils.findShrinkableColumn)(child);

        if (shrinkableColumn) {
          duplicate = _Block.prototype.duplicateChild.call(this, child, autoAppend);
          (0, _utils.updateColumnWidth)(shrinkableColumn, (0, _utils.getAcceptedColumnWidth)(((0, _utils.getColumnWidth)(shrinkableColumn) - (0, _utils.getSmallestColumnWidth)()).toString()));
          (0, _utils.updateColumnWidth)(duplicate, (0, _utils.getSmallestColumnWidth)());
        }
      } // If we aren't able to duplicate inform the user why


      if (!duplicate) {
        this.stage.parent.alertDialog({
          content: (0, _translate)("There is no free space within the column group to perform this action."),
          title: (0, _translate)("Unable to duplicate column")
        });
      }
    };
    /**
     * Set columns in the group as resizing
     *
     * @param {Column} columns
     */


    _proto.setColumnsAsResizing = function setColumnsAsResizing() {
      for (var _len = arguments.length, columns = new Array(_len), _key = 0; _key < _len; _key++) {
        columns[_key] = arguments[_key];
      }

      columns.forEach(function (column) {
        column.resizing(true);
      });
    };
    /**
     * Unset resizing flag on all child columns
     */


    _proto.unsetResizingColumns = function unsetResizingColumns() {
      this.children().forEach(function (column) {
        column.resizing(false);
      });
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
     * Bind draggable instances to the child columns
     */


    _proto.bindDraggable = function bindDraggable() {
      var _this3 = this;

      this.children().forEach(function (column) {
        column.element.draggable({
          appendTo: "body",
          containment: "body",
          handle: ".move-column",
          revertDuration: 250,
          helper: function helper() {
            var helper = (0, _jquery)(this).clone();
            helper.css({
              opacity: 0.5,
              pointerEvents: "none",
              width: (0, _jquery)(this).width() + "px",
              zIndex: 100
            });
            return helper;
          },
          start: function start(event) {
            // Use the global state as columns can be dragged between groups
            _uiRegistry.set("pageBuilderDragColumn", {
              element: (0, _jquery)(event.target),
              instance: _knockout.dataFor((0, _jquery)(event.target)[0])
            }); // Set a flag to inform the UI sortable functionality not to run


            _uiRegistry.set("pageBuilderBlockSortable", true);

            _this3.dropPositions = (0, _utils.calculateDropPositions)(_this3);
          },
          stop: function stop() {
            var draggedColumn = _uiRegistry.get("pageBuilderDragColumn");

            if (_this3.movePosition && draggedColumn) {
              // Check if we're moving within the same group, even though this function will
              // only ever run on the group that bound the draggable event
              if (draggedColumn.instance.parent === _this3) {
                var currentIndex = (0, _utils.getColumnIndexInGroup)(draggedColumn.instance);
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

            _uiRegistry.remove("pageBuilderDragColumn");

            _underscore.delay(function () {
              _uiRegistry.remove("pageBuilderBlockSortable");
            }, 150);

            _this3.dropPlaceholder.removeClass("left right");

            _this3.movePlaceholder.removeClass("active");
          }
        });
      });
    };
    /**
     * Init the resizing events on the group
     *
     * @param {JQuery<HTMLElement>} group
     */


    _proto.initMouseMove = function initMouseMove(group) {
      var _this4 = this;

      group.mousemove(function (event) {
        _this4.handleResizingMouseMove(event, group);

        _this4.handleDraggingMouseMove(event, group);

        _this4.handleDroppingMouseMove(event, group);
      }).mouseleave(function () {
        _this4.movePlaceholder.css("left", "").removeClass("active");
      }).mouseup(function () {
        _this4.resizing(false);

        _this4.resizeMouseDown = null;
        _this4.resizeLeftLastColumnShrunk = _this4.resizeRightLastColumnShrunk = null;
        _this4.dropPositions = [];

        _this4.unsetResizingColumns(); // Change the cursor back


        (0, _jquery)("body").css("cursor", "");

        _this4.dropPlaceholder.removeClass("left right");

        _this4.movePlaceholder.removeClass("active");

        _this4.resizeGhost.removeClass("active");
      });
    };
    /**
     * Determine which column should be adjusted in this resizing action
     *
     * @param {JQuery<HTMLElement>} group
     * @param {number} currentPos
     * @param {Column} column
     * @param {ResizeHistory} history
     * @returns {[Column , string , string]}
     */


    _proto.determineAdjustedColumn = function determineAdjustedColumn(group, currentPos, column, history) {
      var modifyColumnInPair = "left";
      var usedHistory;
      var resizeColumnLeft = column.element.offset().left;
      var resizeColumnWidth = column.element.outerWidth();
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
          adjustedColumn = (0, _utils.findShrinkableColumnForResize)(column, "right");
        }
      } else {
        if (history.right.length > 0) {
          usedHistory = "right";
          adjustedColumn = history.right.reverse()[0].adjustedColumn;
          modifyColumnInPair = history.right.reverse()[0].modifyColumnInPair;
        } else {
          // Detect if we're increasing the side of the right column, and we've hit the smallest limit on the
          // current element
          if ((0, _utils.getColumnWidth)(column) <= (0, _utils.getSmallestColumnWidth)()) {
            modifyColumnInPair = "right";
            adjustedColumn = (0, _utils.findShrinkableColumnForResize)(column, "left");
          } else {
            // If we're shrinking our column we can just increase the adjacent column
            adjustedColumn = (0, _utils.getAdjacentColumn)(column, "+1");
          }
        }
      }

      return [adjustedColumn, modifyColumnInPair, usedHistory];
    };
    /**
     * Calculate the size of the resize ghost
     *
     * @param {JQuery<HTMLElement>} group
     * @param {number} currentPos
     * @param {Column} column
     * @param {Column} adjustedColumn
     * @param {string} modifyColumnInPair
     * @param {number} maxGhostWidth
     * @returns {[number , number]}
     */


    _proto.calculateResizeGhostWidth = function calculateResizeGhostWidth(group, currentPos, column, adjustedColumn, modifyColumnInPair, maxGhostWidth) {
      var resizeColumnLeft = column.element.offset().left;
      var resizeColumnWidth = column.element.outerWidth(); // Update the ghosts width and position to give a visual indication of the dragging

      var ghostWidth = currentPos - group.offset().left;

      if (ghostWidth <= group.width() / (0, _utils.getMaxColumns)()) {
        ghostWidth = group.width() / (0, _utils.getMaxColumns)();
      }

      if (modifyColumnInPair === "right") {
        // Ensure the handler cannot be dragged further than supported
        ghostWidth = currentPos - group.offset().left;
        var smallestGhostWidth = ((0, _utils.getColumnIndexInGroup)(column) + 1) * (group.width() / (0, _utils.getMaxColumns)());

        if (currentPos - group.offset().left < smallestGhostWidth) {
          ghostWidth = smallestGhostWidth;
        }
      }

      if (!adjustedColumn && ghostWidth > resizeColumnWidth || maxGhostWidth) {
        ghostWidth = maxGhostWidth ? maxGhostWidth : resizeColumnWidth + column.element.position().left;

        if (!maxGhostWidth) {
          maxGhostWidth = resizeColumnWidth + column.element.position().left;
        }
      } // Reset the max ghost width when the user moves back from the edge


      if (resizeColumnWidth + resizeColumnLeft < currentPos) {
        maxGhostWidth = null;
      }

      return [ghostWidth, maxGhostWidth];
    };
    /**
     * Record the resizing history for this action
     *
     * @param {string} usedHistory
     * @param {string} direction
     * @param {Column} adjustedColumn
     * @param {string} modifyColumnInPair
     */


    _proto.recordResizeHistory = function recordResizeHistory(usedHistory, direction, adjustedColumn, modifyColumnInPair) {
      if (usedHistory) {
        this.resizeHistory[usedHistory].pop();
      }

      this.resizeHistory[direction].push({
        adjustedColumn: adjustedColumn,
        modifyColumnInPair: modifyColumnInPair
      });
    };
    /**
     * Handle the resizing on mouse move, we always resize a pair of columns at once
     *
     * @param {JQuery.Event} event
     * @param {JQuery<HTMLElement>} group
     */


    _proto.handleResizingMouseMove = function handleResizingMouseMove(event, group) {
      var currentCol;

      if (this.resizeMouseDown) {
        event.preventDefault();
        var currentPos = event.pageX;
        var resizeColumnLeft = this.resizeColumnInstance.element.offset().left;
        var resizeColumnWidth = this.resizeColumnInstance.element.outerWidth();
        var resizeHandlePosition = resizeColumnLeft + resizeColumnWidth;
        var direction = currentPos >= resizeHandlePosition ? "right" : "left";

        var _adjustedColumn;

        var _modifyColumnInPair; // We need to know if we're modifying the left or right column in the pair


        var usedHistory; // Was the adjusted column pulled from history?
        // Determine which column in the group should be adjusted for this action

        var _determineAdjustedCol = this.determineAdjustedColumn(group, currentPos, this.resizeColumnInstance, this.resizeHistory);

        _adjustedColumn = _determineAdjustedCol[0];
        _modifyColumnInPair = _determineAdjustedCol[1];
        usedHistory = _determineAdjustedCol[2];

        // Calculate the ghost width based on mouse position and bounds of allowed sizes
        var _calculateResizeGhost = this.calculateResizeGhostWidth(group, currentPos, this.resizeColumnInstance, _adjustedColumn, _modifyColumnInPair, this.resizeMaxGhostWidth),
            ghostWidth = _calculateResizeGhost[0],
            maxGhostWidth = _calculateResizeGhost[1];

        this.resizeMaxGhostWidth = maxGhostWidth;
        this.resizeGhost.width(ghostWidth - 15 + "px").addClass("active");

        if (_adjustedColumn && !maxGhostWidth && this.resizeColumnWidths) {
          currentCol = this.resizeColumnWidths.find(function (val) {
            return currentPos > val.position - 25 && currentPos < val.position + 25 && val.forColumn === _modifyColumnInPair;
          });

          if (currentCol) {
            var mainColumn = this.resizeColumnInstance; // If we're using the left data set, we're actually resizing the right column of the group

            if (_modifyColumnInPair === "right") {
              mainColumn = (0, _utils.getAdjacentColumn)(this.resizeColumnInstance, "+1");
            } // Ensure we aren't resizing multiple times, also validate the last resize isn't the same as the
            // one being performed now. This occurs as we re-calculate the column positions on resize


            if ((0, _utils.getColumnWidth)(mainColumn) !== currentCol.width && this.resizeLastPosition !== currentCol.position) {
              this.recordResizeHistory(usedHistory, direction, _adjustedColumn, _modifyColumnInPair);
              this.resizeLastPosition = currentCol.position;
              (0, _utils.resizeColumn)(mainColumn, currentCol.width, _adjustedColumn); // If we do a resize, re-calculate the column widths

              this.resizeColumnWidths = (0, _utils.determineColumnWidths)(this.resizeColumnInstance, this.groupElement);
            }
          }
        }
      }
    };
    /**
     * Handle a column being dragged around the group
     *
     * @param {JQuery.Event} event
     * @param {JQuery<HTMLElement>} group
     */


    _proto.handleDraggingMouseMove = function handleDraggingMouseMove(event, group) {
      var dragColumn = _uiRegistry.get("pageBuilderDragColumn");

      if (dragColumn) {
        // If the drop positions haven't been calculated for this group do so now
        if (this.dropPositions.length === 0) {
          this.dropPositions = (0, _utils.calculateDropPositions)(this);
        }

        var columnInstance = dragColumn.instance;
        var currentX = event.pageX - (0, _jquery)(group).offset().left; // Are we within the same column group or have we ended up over another?

        if (columnInstance.parent === this) {
          var currentColumn = dragColumn.element;
          var currentColumnRight = currentColumn.position().left + currentColumn.width();
          var lastColInGroup = this.children()[this.children().length - 1].element;
          var insertLastPos = lastColInGroup.position().left + lastColInGroup.width() / 2;
          this.movePosition = this.dropPositions.find(function (position) {
            // Only ever look for the left placement, except the last item where we look on the right
            var placement = currentX >= insertLastPos ? "right" : "left"; // There is 200px area over each column borders

            return currentX > position[placement] - 100 && currentX < position[placement] + 100 && // Verify we're not dropping next to the current columns right position
            !(currentX > currentColumnRight - 100 && currentX < currentColumnRight + 100) && position.affectedColumn !== columnInstance && // Check affected column isn't the current column
            position.placement === placement // Verify the position, we only check left on sorting
            ;
          });

          if (this.movePosition) {
            this.dropPlaceholder.removeClass("left right");
            this.movePlaceholder.css({
              left: this.movePosition.placement === "left" ? this.movePosition.left : "",
              right: this.movePosition.placement === "right" ? (0, _jquery)(group).outerWidth() - this.movePosition.right - 5 : ""
            }).addClass("active");
          } else {
            this.movePlaceholder.removeClass("active");
          }
        } else {
          // If we're moving to another column group we utilise the existing drop placeholder
          this.movePosition = this.dropPositions.find(function (position) {
            return currentX > position.left && currentX < position.right && position.canShrink;
          });

          if (this.movePosition) {
            this.movePlaceholder.removeClass("active");
            this.dropPlaceholder.removeClass("left right").css({
              left: this.movePosition.placement === "left" ? this.movePosition.left : "",
              right: this.movePosition.placement === "right" ? (0, _jquery)(group).width() - this.movePosition.right : "",
              width: (0, _jquery)(group).width() / (0, _utils.getMaxColumns)() + "px"
            }).addClass(this.movePosition.placement);
          } else {
            this.dropPlaceholder.removeClass("left right");
          }
        }
      }
    };
    /**
     * Handle mouse move events on when dropping elements
     *
     * @param {JQuery.Event} event
     * @param {JQuery<HTMLElement>} group
     */


    _proto.handleDroppingMouseMove = function handleDroppingMouseMove(event, group) {
      if (this.dropOverElement) {
        var currentX = event.pageX - (0, _jquery)(group).offset().left;
        this.dropPosition = this.dropPositions.find(function (position) {
          return currentX > position.left && currentX < position.right && position.canShrink;
        });

        if (this.dropPosition) {
          this.dropPlaceholder.removeClass("left right").css({
            left: this.dropPosition.placement === "left" ? this.dropPosition.left : "",
            right: this.dropPosition.placement === "right" ? (0, _jquery)(group).width() - this.dropPosition.right : "",
            width: (0, _jquery)(group).width() / (0, _utils.getMaxColumns)() + "px"
          }).addClass(this.dropPosition.placement);
        }
      }
    };
    /**
     * Init the droppable functionality for new columns
     *
     * @param {JQuery<HTMLElement>} group
     */


    _proto.initDroppable = function initDroppable(group) {
      var _this5 = this;

      var currentDraggedBlock;
      group.droppable({
        activate: function activate(event) {
          currentDraggedBlock = _knockout.dataFor(event.currentTarget);
        },
        deactivate: function deactivate() {
          _this5.dropOverElement = null;

          _this5.dropPlaceholder.removeClass("left right"); // Delay the removal of the flag so other systems have time to execute


          _underscore.delay(function () {
            _uiRegistry.remove("pageBuilderBlockSortable");
          }, 50);
        },
        drop: function drop(event, ui) {
          _this5.handleNewColumnDrop(event, ui);

          _this5.handleExistingColumnDrop(event);

          _this5.dropPositions = [];

          _this5.dropPlaceholder.removeClass("left right");
        },
        greedy: true,
        out: function out() {
          _this5.dropOverElement = null;

          _this5.dropPlaceholder.removeClass("left right"); // Delay the removal of the flag so other systems have time to execute


          _underscore.delay(function () {
            _uiRegistry.remove("pageBuilderBlockSortable");
          }, 50);
        },
        over: function over() {
          // Always calculate drop positions when an element is dragged over
          _this5.dropPositions = (0, _utils.calculateDropPositions)(_this5); // Is the element being dragged a column group?

          if (currentDraggedBlock.config.name === _this5.config.name) {
            _this5.dropOverElement = true;

            _uiRegistry.set("pageBuilderBlockSortable", true);
          }
        }
      });
    };
    /**
     * Handle a new column being dropped into the group
     *
     * @param {Event} event
     * @param {JQueryUI.DroppableEventUIParam} ui
     */


    _proto.handleNewColumnDrop = function handleNewColumnDrop(event, ui) {
      var _this6 = this;

      if (this.dropOverElement && this.dropPosition) {
        this.dropOverElement = null;
        event.preventDefault();
        event.stopImmediatePropagation(); // Remove any dropped items from the DOM

        if (ui.draggable) {
          ui.draggable.remove();
        } // Create our new column


        (0, _utils.createColumn)(this, (0, _utils.getSmallestColumnWidth)(), this.dropPosition.insertIndex).then(function () {
          var newWidth = (0, _utils.getAcceptedColumnWidth)(((0, _utils.getColumnWidth)(_this6.dropPosition.affectedColumn) - (0, _utils.getSmallestColumnWidth)()).toString()); // Reduce the affected columns width by the smallest column width

          (0, _utils.updateColumnWidth)(_this6.dropPosition.affectedColumn, newWidth);
        });
      }
    };
    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param {Event} event
     */


    _proto.handleExistingColumnDrop = function handleExistingColumnDrop(event) {
      var column = _uiRegistry.get("pageBuilderDragColumn");

      var modifyOldNeighbour; // This should only run when we're dragging between groups

      if (this.movePosition && column && column.instance && column.instance.parent !== this) {
        event.preventDefault();
        event.stopImmediatePropagation(); // Determine which old neighbour we should modify

        var oldWidth = (0, _utils.getColumnWidth)(column.instance); // Retrieve the adjacent column either +1 or -1

        if ((0, _utils.getAdjacentColumn)(column.instance, "+1")) {
          modifyOldNeighbour = (0, _utils.getAdjacentColumn)(column.instance, "+1");
        } else if ((0, _utils.getAdjacentColumn)(column.instance, "-1")) {
          modifyOldNeighbour = (0, _utils.getAdjacentColumn)(column.instance, "-1");
        } // Set the column to it's smallest column width


        (0, _utils.updateColumnWidth)(column.instance, (0, _utils.getSmallestColumnWidth)());
        column.instance.parent.removeChild(column.instance);
        this.emit("blockInstanceDropped", {
          blockInstance: column.instance,
          index: this.movePosition.insertIndex
        }); // Modify the old neighbour

        if (modifyOldNeighbour) {
          var oldNeighbourWidth = (0, _utils.getAcceptedColumnWidth)((oldWidth + (0, _utils.getColumnWidth)(modifyOldNeighbour)).toString());
          (0, _utils.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
        } // Modify the columns new neighbour


        var newNeighbourWidth = (0, _utils.getAcceptedColumnWidth)(((0, _utils.getColumnWidth)(this.movePosition.affectedColumn) - (0, _utils.getSmallestColumnWidth)()).toString()); // Reduce the affected columns width by the smallest column width

        (0, _utils.updateColumnWidth)(this.movePosition.affectedColumn, newNeighbourWidth);
      }
    };
    /**
     * Spread any empty space across the other columns
     *
     * @param {Event} event
     * @param {BlockRemovedParams} params
     */


    _proto.spreadWidth = function spreadWidth(event, params) {
      if (this.children().length === 0) {
        return;
      }

      var availableWidth = 100 - (0, _utils.getColumnsWidth)(this);
      var formattedAvailableWidth = (0, _utils.getRoundedColumnWidth)(availableWidth);
      var totalChildColumns = this.children().length;
      var allowedColumnWidths = [];
      var spreadAcross = 1;
      var spreadAmount;

      for (var i = (0, _utils.getMaxColumns)(); i > 0; i--) {
        allowedColumnWidths.push((0, _utils.getRoundedColumnWidth)(100 / 6 * i));
      } // Determine how we can spread the empty space across the columns


      traverseChildren: for (var _i = totalChildColumns; _i > 0; _i--) {
        var potentialWidth = formattedAvailableWidth / _i;

        for (var _i2 = 0; _i2 < allowedColumnWidths.length; _i2++) {
          var width = allowedColumnWidths[_i2];

          if (Math.floor(potentialWidth) === Math.floor(width)) {
            spreadAcross = _i;
            spreadAmount = formattedAvailableWidth / _i;
            break traverseChildren;
          }
        }
      } // Let's spread the width across the columns


      for (var _i3 = 1; _i3 <= spreadAcross; _i3++) {
        var columnToModify = void 0; // As the original column has been removed from the array, check the new index for a column

        if (params.index <= this.children().length && typeof this.children()[params.index] !== "undefined") {
          columnToModify = this.children()[params.index];
        }

        if (!columnToModify && params.index - _i3 >= 0 && typeof this.children()[params.index - _i3] !== "undefined") {
          columnToModify = this.children()[params.index - _i3];
        }

        if (columnToModify) {
          (0, _utils.updateColumnWidth)(columnToModify, (0, _utils.getColumnWidth)(columnToModify) + spreadAmount);
        }
      }
    };
    /**
     * Remove self if we contain no children
     */


    _proto.removeIfEmpty = function removeIfEmpty() {
      if (this.children().length === 0) {
        this.parent.removeChild(this);
        return;
      }
    };

    return ColumnGroup;
  }(_block);

  return ColumnGroup;
});
//# sourceMappingURL=column-group.js.map
