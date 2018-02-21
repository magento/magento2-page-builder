/*eslint-disable */
define(["jquery", "knockout", "underscore", "../../config", "../../stage/panel/group/block", "./block", "./column-group/dragdrop", "./column-group/registry", "./column-group/resizing"], function (_jquery, _knockout, _underscore, _config, _block, _block2, _dragdrop, _registry, _resizing) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ColumnGroup =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(ColumnGroup, _PreviewBlock);

    /**
     * @param {ColumnGroup} parent
     * @param {object} config
     */
    function ColumnGroup(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.parent = void 0;
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
      _this.resizeLastColumnInPair = void 0;
      _this.resizeHistory = {
        left: [],
        right: []
      };
      _this.dropOverElement = void 0;
      _this.dropPositions = [];
      _this.dropPosition = void 0;
      _this.movePosition = void 0;
      _this.parent = parent;
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
      this.initMouseMove(this.groupElement); // Handle the mouse leaving the window

      (0, _jquery)("body").mouseleave(this.endAllInteractions.bind(this));
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
     * Register a resize handle within a child column
     *
     * @param {Column} column
     * @param {JQuery<HTMLElement>} handle
     */


    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this2 = this;

      handle.off("mousedown");
      handle.on("mousedown", function (event) {
        event.preventDefault();

        _this2.resizing(true);

        _this2.resizeColumnInstance = column;
        _this2.resizeColumnWidths = (0, _resizing.determineColumnWidths)(_this2.resizeColumnInstance, _this2.groupElement);
        _this2.resizeMaxGhostWidth = (0, _resizing.determineMaxGhostWidth)(_this2.resizeColumnWidths); // Set a flag of the columns which are currently being resized

        _this2.setColumnsAsResizing(column, (0, _resizing.getAdjacentColumn)(column, "+1")); // Force the cursor to resizing


        (0, _jquery)("body").css("cursor", "col-resize"); // Reset the resize history

        _this2.resizeHistory = {
          left: [],
          right: []
        };
        _this2.resizeLastPosition = null;
        _this2.resizeMouseDown = true;
      });
    };
    /**
     * Bind draggable instances to the child columns
     */


    _proto.bindDraggable = function bindDraggable(column) {
      var _this3 = this;

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
          (0, _registry.setDragColumn)(_knockout.dataFor((0, _jquery)(event.target)[0]));
          _this3.dropPositions = (0, _dragdrop.calculateDropPositions)(_this3.parent);
        },
        stop: function stop() {
          var draggedColumn = (0, _registry.getDragColumn)();

          if (_this3.movePosition && draggedColumn) {
            // Check if we're moving within the same group, even though this function will
            // only ever run on the group that bound the draggable event
            if (draggedColumn.parent === _this3.parent) {
              _this3.parent.onColumnSort(draggedColumn, _this3.movePosition.insertIndex);

              _this3.movePosition = null;
            }
          }

          (0, _registry.removeDragColumn)();

          _this3.dropPlaceholder.removeClass("left right");

          _this3.movePlaceholder.removeClass("active");
        }
      });
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
      this.parent.children().forEach(function (column) {
        column.resizing(false);
      });
    };
    /**
     * End all current interactions
     */


    _proto.endAllInteractions = function endAllInteractions() {
      this.resizing(false);
      this.resizeMouseDown = null;
      this.resizeLeftLastColumnShrunk = this.resizeRightLastColumnShrunk = null;
      this.dropPositions = [];
      this.unsetResizingColumns(); // Change the cursor back

      (0, _jquery)("body").css("cursor", "");
      this.dropPlaceholder.removeClass("left right");
      this.movePlaceholder.removeClass("active");
      this.resizeGhost.removeClass("active");
    };
    /**
     * Init the resizing events on the group
     *
     * @param {JQuery<HTMLElement>} group
     */


    _proto.initMouseMove = function initMouseMove(group) {
      var _this4 = this;

      group.mousemove(function (event) {
        _this4.onResizingMouseMove(event, group);

        _this4.onDraggingMouseMove(event, group);

        _this4.onDroppingMouseMove(event, group);
      }).mouseleave(function () {
        _this4.movePlaceholder.css("left", "").removeClass("active");
      }); // As the mouse might be released outside of the group, attach to the body

      (0, _jquery)("body").mouseup(function () {
        _this4.endAllInteractions();
      });
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


    _proto.onResizingMouseMove = function onResizingMouseMove(event, group) {
      var _this5 = this;

      var newColumnWidth;

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

        var _determineAdjustedCol = (0, _resizing.determineAdjustedColumn)(group, currentPos, this.resizeColumnInstance, this.resizeHistory);

        _adjustedColumn = _determineAdjustedCol[0];
        _modifyColumnInPair = _determineAdjustedCol[1];
        usedHistory = _determineAdjustedCol[2];
        // Calculate the ghost width based on mouse position and bounds of allowed sizes
        var ghostWidth = (0, _resizing.calculateGhostWidth)(group, currentPos, this.resizeColumnInstance, _modifyColumnInPair, this.resizeMaxGhostWidth);
        this.resizeGhost.width(ghostWidth - 15 + "px").addClass("active");

        if (_adjustedColumn && this.resizeColumnWidths) {
          newColumnWidth = this.resizeColumnWidths.find(function (val) {
            return (0, _resizing.comparator)(currentPos, val.position, 35) && val.forColumn === _modifyColumnInPair;
          });

          if (newColumnWidth) {
            var mainColumn = this.resizeColumnInstance; // If we're using the left data set, we're actually resizing the right column of the group

            if (_modifyColumnInPair === "right") {
              mainColumn = (0, _resizing.getAdjacentColumn)(this.resizeColumnInstance, "+1");
            } // Ensure we aren't resizing multiple times, also validate the last resize isn't the same as the
            // one being performed now. This occurs as we re-calculate the column positions on resize, we have
            // to use the comparator as the calculation may result in slightly different numbers due to rounding


            if ((0, _resizing.getColumnWidth)(mainColumn) !== newColumnWidth.width && !(0, _resizing.comparator)(this.resizeLastPosition, newColumnWidth.position, 10)) {
              // If our previous action was to resize the right column in pair, and we're now dragging back
              // to the right, but have matched a column for the left we need to fix the columns being
              // affected
              if (usedHistory && this.resizeLastColumnInPair === "right" && direction === "right" && newColumnWidth.forColumn === "left") {
                var originalMainColumn = mainColumn;
                mainColumn = _adjustedColumn;
                _adjustedColumn = (0, _resizing.getAdjacentColumn)(originalMainColumn, "+1");
              }

              this.recordResizeHistory(usedHistory, direction, _adjustedColumn, _modifyColumnInPair);
              this.resizeLastPosition = newColumnWidth.position;
              this.resizeLastColumnInPair = _modifyColumnInPair;
              this.parent.onColumnResize(mainColumn, newColumnWidth.width, _adjustedColumn); // Wait for the render cycle to finish from the above resize before re-calculating

              _underscore.defer(function () {
                // If we do a resize, re-calculate the column widths
                _this5.resizeColumnWidths = (0, _resizing.determineColumnWidths)(_this5.resizeColumnInstance, _this5.groupElement);
                _this5.resizeMaxGhostWidth = (0, _resizing.determineMaxGhostWidth)(_this5.resizeColumnWidths);
              });
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


    _proto.onDraggingMouseMove = function onDraggingMouseMove(event, group) {
      var dragColumn = (0, _registry.getDragColumn)();

      if (dragColumn) {
        // If the drop positions haven't been calculated for this group do so now
        if (this.dropPositions.length === 0) {
          this.dropPositions = (0, _dragdrop.calculateDropPositions)(this.parent);
        }

        var columnInstance = dragColumn;
        var currentX = event.pageX - (0, _jquery)(group).offset().left; // Are we within the same column group or have we ended up over another?

        if (columnInstance.parent === this.parent) {
          var currentColumn = dragColumn.element;
          var currentColumnRight = currentColumn.position().left + currentColumn.width();
          var lastColInGroup = this.parent.children()[this.parent.children().length - 1].element;
          var insertLastPos = lastColInGroup.position().left + lastColInGroup.width() / 2;
          this.movePosition = this.dropPositions.find(function (position) {
            // Only ever look for the left placement, except the last item where we look on the right
            var placement = currentX >= insertLastPos ? "right" : "left"; // There is 200px area over each column borders

            return (0, _resizing.comparator)(currentX, position[placement], 100) && !(0, _resizing.comparator)(currentX, currentColumnRight, 100) && position.affectedColumn !== columnInstance && // Check affected column isn't the current column
            position.placement === placement; // Verify the position, we only check left on sorting
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
            var classToRemove = this.movePosition.placement === "left" ? "right" : "left";
            this.movePlaceholder.removeClass("active");
            this.dropPlaceholder.removeClass(classToRemove).css({
              left: this.movePosition.placement === "left" ? this.movePosition.left : "",
              right: this.movePosition.placement === "right" ? (0, _jquery)(group).width() - this.movePosition.right : "",
              width: (0, _jquery)(group).width() / (0, _resizing.getMaxColumns)() + "px"
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


    _proto.onDroppingMouseMove = function onDroppingMouseMove(event, group) {
      if (this.dropOverElement) {
        var currentX = event.pageX - (0, _jquery)(group).offset().left;
        this.dropPosition = this.dropPositions.find(function (position) {
          return currentX > position.left && currentX < position.right && position.canShrink;
        });

        if (this.dropPosition) {
          this.dropPlaceholder.removeClass("left right").css({
            left: this.dropPosition.placement === "left" ? this.dropPosition.left : "",
            right: this.dropPosition.placement === "right" ? (0, _jquery)(group).width() - this.dropPosition.right : "",
            width: (0, _jquery)(group).width() / (0, _resizing.getMaxColumns)() + "px"
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
      var _this6 = this;

      var currentDraggedBlock;
      group.droppable({
        activate: function activate(event) {
          currentDraggedBlock = _knockout.dataFor(event.currentTarget);
        },
        deactivate: function deactivate() {
          _this6.dropOverElement = null;

          _this6.dropPlaceholder.removeClass("left right");
        },
        drop: function drop(event, ui) {
          if (_this6.dropOverElement && _this6.dropPosition) {
            _this6.parent.onNewColumnDrop(event, ui, _this6.dropPosition);

            _this6.dropOverElement = null;
          }

          var column = (0, _registry.getDragColumn)();

          if (_this6.movePosition && column && column.parent !== _this6.parent) {
            _this6.parent.onExistingColumnDrop(event, _this6.movePosition);
          }

          _this6.dropPositions = [];

          _this6.dropPlaceholder.removeClass("left right");
        },
        greedy: true,
        out: function out() {
          _this6.dropOverElement = null;

          _this6.dropPlaceholder.removeClass("left right");
        },
        over: function over() {
          // Always calculate drop positions when an element is dragged over
          _this6.dropPositions = (0, _dragdrop.calculateDropPositions)(_this6.parent); // Is the element currently being dragged a column?

          if (currentDraggedBlock instanceof _block.Block && currentDraggedBlock.getConfig() === _config.getContentType("column")) {
            _this6.dropOverElement = true;
          }
        }
      });
    };

    return ColumnGroup;
  }(_block2);

  return ColumnGroup;
});
//# sourceMappingURL=column-group.js.map
