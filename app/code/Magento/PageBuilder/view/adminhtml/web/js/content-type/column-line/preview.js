/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["jquery", "knockout", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type/column-group/factory", "Magento_PageBuilder/js/content-type/column-group/registry", "Magento_PageBuilder/js/drag-drop/move-content-type", "Magento_PageBuilder/js/drag-drop/registry", "Magento_PageBuilder/js/drag-drop/sortable", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/utils/create-stylesheet", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/column-group/grid-size", "Magento_PageBuilder/js/content-type/column/resize", "Magento_PageBuilder/js/content-type/preview-collection", "Magento_PageBuilder/js/content-type/column-line/drag-and-drop"], function (_jquery, _knockout, _contentTypeFactory, _factory, _registry, _moveContentType, _registry2, _sortable, _events, _createStylesheet, _underscore, _config, _gridSize, _resize, _previewCollection, _dragAndDrop) {
  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview = /*#__PURE__*/function (_previewCollection2) {
    "use strict";

    _inheritsLoose(Preview, _previewCollection2);

    /**
     *
     * @param {ContentTypeCollection} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(contentType, config, observableUpdater) {
      var _this;

      _this = _previewCollection2.call(this, contentType, config, observableUpdater) || this;
      _this.resizing = _knockout.observable(false);
      _this.gridSizeArray = _knockout.observableArray([]);
      _this.dropPositions = [];
      _this.resizeHistory = {
        left: [],
        right: []
      };
      _this.interactionLevel = 0;
      _this.lineDropperHeight = 50;
      _this.resizeUtils = new _resize(_this.contentType.parentContentType, _this.contentType);

      _events.on("contentType:removeAfter", function (args) {
        if (args.parentContentType && args.parentContentType.id === _this.contentType.id) {
          _underscore.defer(function () {
            _this.spreadWidth(args.index);
          });
        }
      }); // Listen for resizing events from child columns


      _events.on("column:resizeHandleBindAfter", function (args) {
        // Does the events content type match the previews column group?
        if (args.columnLine.id === _this.contentType.id) {
          _this.registerResizeHandle(args.column, args.handle);
        }
      });

      _events.on("column:initializeAfter", function (args) {
        // Does the events parent match the previews column group?
        if (args.columnGroup.id === _this.contentType.id) {
          _this.bindDraggable(args.column);
        }
      });

      var parentPreview = _this.contentType.parentContentType.preview;

      _this.gridSizeArray(parentPreview.gridSizeArray());

      parentPreview.gridSizeArray.subscribe(function (gridSize) {
        _this.gridSizeArray(gridSize);
      });

      _this.contentType.children.subscribe(_underscore.debounce(_this.removeIfEmpty.bind(_assertThisInitialized(_this)), 50));

      return _this;
    }
    /**
     * Bind events
     */


    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _previewCollection2.prototype.bindEvents.call(this);

      if (_config.getContentTypeConfig("column")) {
        _events.on("column-line:dropAfter", function (args) {
          if (args.id === _this2.contentType.id) {
            _this2.createColumns();
          }
        });
      }

      _events.on("column:initializeAfter", function (args) {
        // Does the events parent match the previews column group?
        if (args.columnLine.id === _this2.contentType.id) {
          _this2.bindDraggable(args.column);
        }
      });
    }
    /**
     * Init the droppable & resizing interactions
     *
     * @param line
     */
    ;

    _proto.bindInteractions = function bindInteractions(line) {
      this.element = (0, _jquery)(line);
      this.initDroppable(this.element);
      this.initMouseMove(this.element); // Handle the mouse leaving the window
      //  $("body").mouseleave(this.endAllInteractions.bind(this));
    }
    /**
     * Init the drop placeholder
     *
     * @param {Element} element
     */
    ;

    _proto.bindDropPlaceholder = function bindDropPlaceholder(element) {
      this.dropPlaceholder = (0, _jquery)(element);
    }
    /**
     * Init the drop placeholder
     *
     * @param {Element} element
     */
    ;

    _proto.bindColumnLineBottomDropPlaceholder = function bindColumnLineBottomDropPlaceholder(element) {
      this.columnLineBottomDropPlaceholder = (0, _jquery)(element);
    }
    /**
     * Init the drop placeholder
     *
     * @param {Element} element
     */
    ;

    _proto.bindColumnLineDropPlaceholder = function bindColumnLineDropPlaceholder(element) {
      this.columnLineDropPlaceholder = (0, _jquery)(element);
    }
    /**
     * Init the move placeholder
     *
     * @param {Element} element
     */
    ;

    _proto.bindMovePlaceholder = function bindMovePlaceholder(element) {
      this.movePlaceholder = (0, _jquery)(element);
    }
    /**
     * Retrieve the ghost element from the template
     *
     * @param {Element} ghost
     */
    ;

    _proto.bindGhost = function bindGhost(ghost) {
      this.resizeGhost = (0, _jquery)(ghost);
    }
    /**
     * Retrieve the resize utils
     *
     * @returns {Resize}
     */
    ;

    _proto.getResizeUtils = function getResizeUtils() {
      return this.resizeUtils;
    }
    /**
     * Bind draggable instances to the child columns
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     */
    ;

    _proto.bindDraggable = function bindDraggable(column) {
      var _this3 = this;

      column.preview.element.draggable({
        appendTo: "body",
        containment: "body",
        cursor: "-webkit-grabbing",
        handle: ".move-column",
        revertDuration: 250,
        helper: function helper() {
          var helper = (0, _jquery)(this).clone();
          helper.css({
            height: (0, _jquery)(this).outerHeight() + "px",
            minHeight: 0,
            opacity: 0.5,
            pointerEvents: "none",
            width: (0, _jquery)(this).outerWidth() + "px",
            zIndex: 5000
          });
          return helper;
        },
        start: function start(event) {
          var columnInstance = _knockout.dataFor((0, _jquery)(event.target)[0]); // Use the global state as columns can be dragged between groups


          (0, _registry.setDragColumn)(columnInstance.contentType);
          _this3.dropPositions = (0, _dragAndDrop.calculateDropPositions)(_this3.contentType);
          _this3.startDragEvent = event;

          _events.trigger("column:dragStart", {
            column: columnInstance,
            stageId: _this3.contentType.stageId
          });

          _events.trigger("stage:interactionStart", {
            stageId: _this3.contentType.stageId
          });
        },
        stop: function stop() {
          var draggedColumn = (0, _registry.getDragColumn)();

          if (_this3.movePosition && draggedColumn) {
            // Check if we're moving within the same group, even though this function will
            // only ever run on the group that bound the draggable event
            if (draggedColumn.parentContentType === _this3.contentType) {
              _this3.onColumnSort(draggedColumn, _this3.movePosition.insertIndex);

              _this3.movePosition = null; // todo see from column group
            }
          }

          (0, _registry.removeDragColumn)();

          _this3.dropPlaceholder.removeClass("left right");

          _this3.movePlaceholder.removeClass("active");

          _this3.movePosition = null;
          _this3.startDragEvent = null;

          _events.trigger("column:dragStop", {
            column: draggedColumn,
            stageId: _this3.contentType.stageId
          });

          _events.trigger("stage:interactionStop", {
            stageId: _this3.contentType.stageId
          });
        }
      });
    }
    /**
     * Handle a column being sorted into a new position in the column line
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} newIndex
     */
    ;

    _proto.onColumnSort = function onColumnSort(column, newIndex) {
      var currentIndex = (0, _resize.getColumnIndexInLine)(column);

      if (currentIndex !== newIndex) {
        if (currentIndex < newIndex) {
          // As we're moving an array item the keys all reduce by 1
          --newIndex;
        } // Move the content type


        (0, _moveContentType.moveContentType)(column, newIndex);
      }
    }
    /**
     * Handle a new column being dropped into the group
     *
     * @param {DropPosition} dropPosition
     */
    ;

    _proto.onNewColumnDrop = function onNewColumnDrop(dropPosition) {
      var _this4 = this;

      // Create our new column
      (0, _factory.createColumn)(this.contentType, this.resizeUtils.getSmallestColumnWidth(), dropPosition.insertIndex).then(function () {
        var newWidth = _this4.resizeUtils.getAcceptedColumnWidth((_this4.resizeUtils.getColumnWidth(dropPosition.affectedColumn) - _this4.resizeUtils.getSmallestColumnWidth()).toString()); // Reduce the affected columns width by the smallest column width


        (0, _resize.updateColumnWidth)(dropPosition.affectedColumn, newWidth);
      });
    }
    /**
     * Handle an existing column being dropped into a different column line
     *
     * @param {DropPosition} movePosition
     */
    ;

    _proto.onExistingColumnDrop = function onExistingColumnDrop(movePosition) {
      var _this5 = this;

      var column = (0, _registry.getDragColumn)();
      var sourceLinePreview = column.parentContentType.preview;
      var modifyOldNeighbour; // Determine which old neighbour we should modify

      var oldWidth = sourceLinePreview.getResizeUtils().getColumnWidth(column);
      var direction = "+1"; // Retrieve the adjacent column either +1 or -1

      if ((0, _resize.getAdjacentColumn)(column, "+1")) {
        modifyOldNeighbour = (0, _resize.getAdjacentColumn)(column, "+1");
      } else if ((0, _resize.getAdjacentColumn)(column, "-1")) {
        direction = "-1";
        modifyOldNeighbour = (0, _resize.getAdjacentColumn)(column, "-1");
      } // Modify the old neighbour


      var oldNeighbourWidth = 100;

      if (modifyOldNeighbour) {
        oldNeighbourWidth = sourceLinePreview.getResizeUtils().getAcceptedColumnWidth((oldWidth + sourceLinePreview.getResizeUtils().getColumnWidth(modifyOldNeighbour)).toString());
      } // Move the content type


      if (this.columnLineDropPlaceholder.hasClass("active")) {
        // if new column line placeholders are visible, add new column line and move column there
        (0, _factory.createColumnLine)(this.contentType.parentContentType, this.resizeUtils.getSmallestColumnWidth(), this.getNewColumnLineIndex()).then(function (columnLine) {
          (0, _moveContentType.moveContentType)(column, 0, columnLine);
          (0, _resize.updateColumnWidth)(column, 100);

          if (modifyOldNeighbour) {
            (0, _resize.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
          }

          _this5.fireMountEvent(_this5.contentType, column);
        });
      } else if (this.columnLineBottomDropPlaceholder.hasClass("active")) {
        // if new column line placeholders are visible, add new column line and move column there
        (0, _factory.createColumnLine)(this.contentType.parentContentType, this.resizeUtils.getSmallestColumnWidth(), this.getNewColumnLineIndex()).then(function (columnLine) {
          (0, _moveContentType.moveContentType)(column, 0, columnLine);
          (0, _resize.updateColumnWidth)(column, 100);

          if (modifyOldNeighbour) {
            (0, _resize.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
          }

          _this5.fireMountEvent(_this5.contentType, column);
        });
      } else {
        (0, _moveContentType.moveContentType)(column, movePosition.insertIndex, this.contentType);

        if (modifyOldNeighbour) {
          (0, _resize.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
        }

        var newNeighbourWidth = this.resizeUtils.getAcceptedColumnWidth((this.resizeUtils.getColumnWidth(movePosition.affectedColumn) - oldWidth).toString());
        var newNeighbour = movePosition.affectedColumn;
        var totalWidthAdjusted = 0;
        (0, _resize.updateColumnWidth)(column, oldWidth);

        while (true) {
          // take width from all neighbours in one direction till the entire width is obtained
          if (newNeighbourWidth <= 0) {
            newNeighbourWidth = this.resizeUtils.getSmallestColumnWidth();
            var originalWidthOfNeighbour = this.resizeUtils.getColumnWidth(newNeighbour);
            (0, _resize.updateColumnWidth)(newNeighbour, newNeighbourWidth);
            totalWidthAdjusted += originalWidthOfNeighbour - newNeighbourWidth;
          } else {
            (0, _resize.updateColumnWidth)(newNeighbour, newNeighbourWidth);
            break;
          }

          if (direction === "+1") {
            newNeighbour = (0, _resize.getAdjacentColumn)(newNeighbour, "+1");
          } else {
            newNeighbour = (0, _resize.getAdjacentColumn)(newNeighbour, "-1");
          }

          if (!newNeighbour) {
            (0, _resize.updateColumnWidth)(column, totalWidthAdjusted);
            break;
          }

          var neighbourExistingWidth = this.resizeUtils.getColumnWidth(newNeighbour);
          newNeighbourWidth = neighbourExistingWidth - (oldWidth - totalWidthAdjusted);

          if (newNeighbourWidth < 0.001) {
            newNeighbourWidth = 0;
          }
        }

        var totalWidth = 0;
        this.contentType.children().forEach(function (columnChild) {
          totalWidth += _this5.resizeUtils.getColumnWidth(columnChild);
        });

        if (totalWidth > 100) {
          // take extra width from newly moved column
          (0, _resize.updateColumnWidth)(column, this.resizeUtils.getColumnWidth(column) - (totalWidth - 100));
        }
      }
    }
    /**
     * Init the resizing events on the group
     *
     * @param {JQuery} line
     */
    ;

    _proto.initMouseMove = function initMouseMove(line) {
      var _this6 = this;

      var intersects = false;
      (0, _jquery)(document).on("mousemove touchmove", function (event) {
        if (line.parents(_sortable.hiddenClass).length > 0) {
          return;
        }

        var linePosition = _this6.getLinePosition(line); // If we're handling a touch event we need to pass through the page X & Y


        if (event.type === "touchmove") {
          event.pageX = event.originalEvent.pageX;
          event.pageY = event.originalEvent.pageY;
        }

        if (_this6.eventIntersectsLine(event, linePosition)) {
          intersects = true; // @todo re-instate onResizingMouseMove

          _this6.onResizingMouseMove(event, line, linePosition);

          _this6.onDraggingMouseMove(event, line, linePosition);

          _this6.onDroppingMouseMove(event, line, linePosition);
        } else {
          intersects = false;
          _this6.linePositionCache = null;
          _this6.dropPosition = null;

          _this6.dropPlaceholder.removeClass("left right");

          _this6.columnLineDropPlaceholder.removeClass("active");

          _this6.columnLineBottomDropPlaceholder.removeClass("active");

          _this6.columnLineBottomDropPlaceholder.hide();

          _this6.columnLineDropPlaceholder.hide(); // @todo combine active and show/hide functionality for columnLineDropPlaceholder
          //  this.movePlaceholder.css("left", "").removeClass("active");

        }
      }).on("mouseup touchend", function () {
        if (intersects) {
          _this6.handleMouseUp();
        }

        intersects = false;
        _this6.dropPosition = null;

        _this6.endAllInteractions();

        _underscore.defer(function () {
          // Re-enable any disabled sortable areas
          line.find(".ui-sortable").each(function () {
            if ((0, _jquery)(this).data("ui-sortable")) {
              (0, _jquery)(this).sortable("option", "disabled", false);
            }
          });
        });
      });
    }
    /**
     * End all current interactions
     */
    ;

    _proto.endAllInteractions = function endAllInteractions() {
      if (this.resizing() === true) {
        for (; this.interactionLevel > 0; this.interactionLevel--) {
          _events.trigger("stage:interactionStop", {
            stageId: this.contentType.stageId
          });
        }
      }

      this.linePositionCache = null;
      this.dropPosition = null;
      this.dropPlaceholder.removeClass("left right");
      this.columnLineDropPlaceholder.removeClass("active");
      this.columnLineBottomDropPlaceholder.removeClass("active");
      this.columnLineBottomDropPlaceholder.hide();
      this.columnLineDropPlaceholder.hide();
      this.resizing(false);
      this.resizeMouseDown = null;
      this.resizeLeftLastColumnShrunk = this.resizeRightLastColumnShrunk = null;
      this.dropPositions = [];
      this.unsetResizingColumns(); // Change the cursor back

      (0, _jquery)("body").css("cursor", "");
      this.movePlaceholder.css("left", "").removeClass("active");
      this.resizeGhost.removeClass("active"); // Reset the line positions cache

      this.linePositionCache = null;
    }
    /**
     * Handle the mouse up action, either adding a new column or moving an existing
     */
    ;

    _proto.handleMouseUp = function handleMouseUp() {
      var self = this;
      var dragColumn = (0, _registry.getDragColumn)();

      if ((this.columnLineDropPlaceholder.hasClass("active") || this.columnLineBottomDropPlaceholder.hasClass("active")) && !dragColumn) {
        (0, _factory.createColumnLine)(this.contentType.parentContentType, this.resizeUtils.getSmallestColumnWidth(), this.getNewColumnLineIndex()).then(function (columnLine) {
          _events.trigger(columnLine.config.name + ":dropAfter", {
            id: columnLine.id,
            columnLine: columnLine
          });
        });
        return;
      }

      if (this.dropOverElement && this.dropPosition) {
        this.onNewColumnDrop(this.dropPosition);
        this.dropOverElement = null; // Re-enable the parent disabled sortable instance

        _underscore.defer(function () {
          (0, _jquery)(".element-children.ui-sortable-disabled").each(function () {
            (0, _jquery)(this).sortable("option", "disabled", false);
          });
        });
      }

      var column = (0, _registry.getDragColumn)();

      if (this.isColumnBeingMovedToAnotherColumnLine()) {
        this.onExistingColumnDrop(this.movePosition);
      }
    }
    /**
     * Does the current event intersect with the line?
     *
     * @param {JQueryEventObject} event
     * @param {LinePositionCache} groupPosition
     * @returns {boolean}
     */
    ;

    _proto.eventIntersectsLine = function eventIntersectsLine(event, groupPosition) {
      return event.pageY > groupPosition.top && event.pageY < groupPosition.top + groupPosition.outerHeight && event.pageX > groupPosition.left && event.pageX < groupPosition.left + groupPosition.outerWidth;
    }
    /**
     * Handle a column being dragged around the group
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} line
     * @param {LinePositionCache} linePosition
     */
    ;

    _proto.onDraggingMouseMove = function onDraggingMouseMove(event, line, linePosition) {
      var dragColumn = (0, _registry.getDragColumn)();

      if (dragColumn) {
        // If the drop positions haven't been calculated for this line do so now
        if (this.dropPositions.length === 0) {
          this.dropPositions = (0, _dragAndDrop.calculateDropPositions)(this.contentType);
        }

        var columnInstance = dragColumn;
        var currentX = event.pageX - linePosition.left; // Are we within the same column line or have we ended up over another?

        if (columnInstance.parentContentType === this.contentType && this.startDragEvent) {
          var dragDirection = event.pageX <= this.startDragEvent.pageX ? "left" : "right";
          var adjacentLeftColumn = (0, _resize.getAdjacentColumn)(dragColumn, "-1"); // Determine the current move position based on the cursors position and direction of drag

          this.movePosition = this.dropPositions.find(function (position) {
            return currentX > position.left && currentX < position.right && position.placement === dragDirection && position.affectedColumn !== dragColumn;
          }); // Differences in the element & event positions cause a right movement to activate on the left column

          if (this.movePosition && dragDirection === "right" && this.movePosition.affectedColumn === adjacentLeftColumn) {
            this.movePosition = null;
          }

          if (this.movePosition && !this.isNewLinePlaceDropPlaceholderVisible(event, linePosition) && !this.isNewLineBottomPlaceDropPlaceholderVisible(event, linePosition)) {
            this.dropPlaceholder.removeClass("left right");
            this.movePlaceholder.css({
              left: this.movePosition.placement === "left" ? this.movePosition.left : "",
              right: this.movePosition.placement === "right" ? linePosition.width - this.movePosition.right : "",
              width: dragColumn.preview.element.outerWidth() + "px"
            }).addClass("active");
          } else {
            this.movePlaceholder.removeClass("active");
          }
        } else {
          // If we're moving to another column line we utilise the existing drop placeholder
          this.movePosition = this.dropPositions.find(function (position) {
            return currentX > position.left && currentX <= position.right && position.canShrink;
          });

          if (this.movePosition && !this.isNewLinePlaceDropPlaceholderVisible(event, linePosition)) {
            var classToRemove = this.movePosition.placement === "left" ? "right" : "left";
            this.movePlaceholder.removeClass("active");
            this.dropPlaceholder.removeClass(classToRemove).css({
              left: this.movePosition.placement === "left" ? this.movePosition.left : "",
              right: this.movePosition.placement === "right" ? linePosition.width - this.movePosition.right : "",
              width: linePosition.width / this.resizeUtils.getGridSize() + "px"
            }).addClass(this.movePosition.placement);
          } else {
            this.dropPlaceholder.removeClass("left right");
          }
        }
      }
    }
    /**
     * Handle the resizing on mouse move, we always resize a pair of columns at once
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} group
     * @param {GroupPositionCache} groupPosition
     */
    ;

    _proto.onResizingMouseMove = function onResizingMouseMove(event, group, groupPosition) {
      var _this7 = this;

      var newColumnWidth;

      if (this.resizeMouseDown) {
        event.preventDefault();
        var currentPos = event.pageX;
        var resizeColumnLeft = this.resizeColumnInstance.preview.element.offset().left;
        var resizeColumnWidth = this.resizeColumnInstance.preview.element.outerWidth();
        var resizeHandlePosition = resizeColumnLeft + resizeColumnWidth;
        var direction = currentPos >= resizeHandlePosition ? "right" : "left";
        var adjustedColumn;
        var modifyColumnInPair; // We need to know if we're modifying the left or right column in the pair

        var usedHistory; // Was the adjusted column pulled from history?
        // Determine which column in the group should be adjusted for this action

        var _this$resizeUtils$det = this.resizeUtils.determineAdjustedColumn(currentPos, this.resizeColumnInstance, this.resizeHistory);

        adjustedColumn = _this$resizeUtils$det[0];
        modifyColumnInPair = _this$resizeUtils$det[1];
        usedHistory = _this$resizeUtils$det[2];
        // Calculate the ghost width based on mouse position and bounds of allowed sizes
        var ghostWidth = this.resizeUtils.calculateGhostWidth(groupPosition, currentPos, this.resizeColumnInstance, modifyColumnInPair, this.resizeMaxGhostWidth);
        this.resizeGhost.width(ghostWidth - 15 + "px").addClass("active");

        if (adjustedColumn && this.resizeColumnWidths) {
          newColumnWidth = this.resizeColumnWidths.find(function (val) {
            return (0, _resize.comparator)(currentPos, val.position, 35) && val.forColumn === modifyColumnInPair;
          });

          if (newColumnWidth) {
            var mainColumn = this.resizeColumnInstance; // If we're using the left data set, we're actually resizing the right column of the group

            if (modifyColumnInPair === "right") {
              mainColumn = (0, _resize.getAdjacentColumn)(this.resizeColumnInstance, "+1");
            } // Ensure we aren't resizing multiple times, also validate the last resize isn't the same as the
            // one being performed now. This occurs as we re-calculate the column positions on resize, we have
            // to use the comparator as the calculation may result in slightly different numbers due to rounding


            if (this.resizeUtils.getColumnWidth(mainColumn) !== newColumnWidth.width && !(0, _resize.comparator)(this.resizeLastPosition, newColumnWidth.position, 10)) {
              // If our previous action was to resize the right column in pair, and we're now dragging back
              // to the right, but have matched a column for the left we need to fix the columns being
              // affected
              if (usedHistory && this.resizeLastColumnInPair === "right" && direction === "right" && newColumnWidth.forColumn === "left") {
                var originalMainColumn = mainColumn;
                mainColumn = adjustedColumn;
                adjustedColumn = (0, _resize.getAdjacentColumn)(originalMainColumn, "+1");
              }

              this.recordResizeHistory(usedHistory, direction, adjustedColumn, modifyColumnInPair);
              this.resizeLastPosition = newColumnWidth.position;
              this.resizeLastColumnInPair = modifyColumnInPair; // Ensure the adjusted column is marked as resizing to animate correctly

              this.setColumnsAsResizing(mainColumn, adjustedColumn);
              this.onColumnResize(mainColumn, newColumnWidth.width, adjustedColumn); // Wait for the render cycle to finish from the above resize before re-calculating

              _underscore.defer(function () {
                // If we do a resize, re-calculate the column widths
                _this7.resizeColumnWidths = _this7.resizeUtils.determineColumnWidths(_this7.resizeColumnInstance, groupPosition);
                _this7.resizeMaxGhostWidth = (0, _resize.determineMaxGhostWidth)(_this7.resizeColumnWidths);
              });
            }
          }
        }
      }
    }
    /**
     * Unset resizing flag on all child columns
     */
    ;

    _proto.unsetResizingColumns = function unsetResizingColumns() {
      this.contentType.children().forEach(function (column) {
        column.preview.resizing(false);

        if (column.preview.element) {
          column.preview.element.css({
            transition: ""
          });
        }
      });
    }
    /**
     *
     * @param event
     * @param linePosition
     * @private
     */
    ;

    _proto.isNewLinePlaceDropPlaceholderVisible = function isNewLinePlaceDropPlaceholderVisible(event, linePosition) {
      var siblings = this.contentType.parentContentType.children();
      var id = this.contentType.id;
      var index = 0;
      siblings.forEach(function (columnLine) {
        if (columnLine.id === id) {
          return false;
        }

        index++;
      });
      var draggedColumn = (0, _registry.getDragColumn)(); // show column line drop placeholder only for top column line in a group

      return (this.dropOverElement || draggedColumn) && event.pageY > linePosition.top + 15 && event.pageY < linePosition.top + 15 + this.lineDropperHeight;
    }
    /**
     *
     * @param event
     * @param linePosition
     * @private
     */
    ;

    _proto.isNewLineBottomPlaceDropPlaceholderVisible = function isNewLineBottomPlaceDropPlaceholderVisible(event, linePosition) {
      var draggedColumn = (0, _registry.getDragColumn)();
      return (this.dropOverElement || draggedColumn) && event.pageY < linePosition.top + 15 + this.element.outerHeight() && event.pageY > linePosition.top + 15 + this.element.outerHeight() - this.lineDropperHeight;
    }
    /**
     *
     * @param event
     * @param linePosition
     * @private
     */
    ;

    _proto.isNewColumnDropPlaceholderVisible = function isNewColumnDropPlaceholderVisible(event, linePosition) {
      var draggedColumn = (0, _registry.getDragColumn)();
      return (this.dropOverElement || draggedColumn) && event.pageY > linePosition.top + 15 + this.lineDropperHeight && event.pageY < linePosition.top + 15 + linePosition.outerHeight - this.lineDropperHeight;
    }
    /**
     * Handle mouse move events on when dropping elements
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} line
     * @param {LinePositionCache} linePosition
     */
    ;

    _proto.onDroppingMouseMove = function onDroppingMouseMove(event, line, linePosition) {
      var elementChildrenParent = line.parents(".element-children"); // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly

      if (this.isNewLinePlaceDropPlaceholderVisible(event, linePosition)) {
        this.dropPosition = null;
        this.dropPlaceholder.removeClass("left right");
        this.columnLineDropPlaceholder.addClass("active");
        this.columnLineDropPlaceholder.show();
        return this.handleLineDropMouseMove(event, line, linePosition);
      } else if (this.isNewLineBottomPlaceDropPlaceholderVisible(event, linePosition)) {
        this.dropPosition = null;
        this.dropPlaceholder.removeClass("left right");
        this.columnLineBottomDropPlaceholder.addClass("active");
        this.columnLineBottomDropPlaceholder.show();
        return this.handleLineDropMouseMove(event, line, linePosition);
      } else if (this.dropOverElement) {
        this.columnLineDropPlaceholder.hide();
        this.columnLineBottomDropPlaceholder.hide();
        this.columnLineBottomDropPlaceholder.removeClass("active");
        this.columnLineDropPlaceholder.removeClass("active");
      }

      if (this.isNewColumnDropPlaceholderVisible(event, linePosition)) {
        this.columnLineDropPlaceholder.hide();
        this.columnLineDropPlaceholder.removeClass("active");
        this.columnLineBottomDropPlaceholder.hide();
        this.columnLineBottomDropPlaceholder.removeClass("active");
        return this.handleColumnDropMouseMove(event, line, linePosition);
      }
    }
    /**
     *
     * @param event
     * @param line
     * @param linePosition
     * @private
     */
    ;

    _proto.handleLineDropMouseMove = function handleLineDropMouseMove(event, line, linePosition) {
      var elementChildrenParent = line.parents(".element-children"); // Disable the column line sortable instance
      // Disable the column group sortable instance

      if (elementChildrenParent.data("ui-sortable")) {
        elementChildrenParent.sortable("option", "disabled", true);
      }
    }
    /**
     *
     * @param event
     * @param line
     * @param linePosition
     * @private
     */
    ;

    _proto.handleColumnDropMouseMove = function handleColumnDropMouseMove(event, line, linePosition) {
      var elementChildrenParent = line.parents(".element-children"); // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly

      if (this.dropOverElement && event.pageY > linePosition.top + 50 && event.pageY < linePosition.top + linePosition.outerHeight - 50) {
        // Disable the column line sortable instance
        if (elementChildrenParent.data("ui-sortable")) {
          elementChildrenParent.sortable("option", "disabled", true);
        }

        var currentX = event.pageX - linePosition.left;
        this.dropPosition = this.dropPositions.find(function (position) {
          return currentX > position.left && currentX <= position.right && position.canShrink;
        });

        if (this.dropPosition) {
          this.dropPlaceholder.removeClass("left right").css({
            left: this.dropPosition.placement === "left" ? this.dropPosition.left : "",
            right: this.dropPosition.placement === "right" ? linePosition.width - this.dropPosition.right : "",
            width: linePosition.width / this.resizeUtils.getGridSize() + "px"
          }).addClass(this.dropPosition.placement);
        }
      } else if (this.dropOverElement) {
        // Re-enable the column group sortable instance
        if (elementChildrenParent.data("ui-sortable")) {
          elementChildrenParent.sortable("option", "disabled", false);
        }

        this.dropPosition = null;
        this.dropPlaceholder.removeClass("left right");
      }
    }
    /**
     * Cache the groups positions
     *
     * @param {JQuery} line
     * @returns {}
     */
    ;

    _proto.getLinePosition = function getLinePosition(line) {
      if (!this.linePositionCache) {
        this.linePositionCache = {
          top: line.offset().top,
          left: line.offset().left,
          width: line.width(),
          height: line.height(),
          outerWidth: line.outerWidth(),
          outerHeight: line.outerHeight()
        };
      }

      return this.linePositionCache;
    }
    /**
     * Init the droppable functionality for new columns
     *
     * @param {JQuery} line
     */
    ;

    _proto.initDroppable = function initDroppable(line) {
      var self = this;
      var headStyles;
      line.droppable({
        deactivate: function deactivate() {
          self.dropOverElement = null;
          self.dropPlaceholder.removeClass("left right");

          _underscore.defer(function () {
            // Re-enable the column group sortable instance & all children sortable instances
            line.parents(".element-children").each(function () {
              if ((0, _jquery)(this).data("ui-sortable")) {
                (0, _jquery)(this).sortable("option", "disabled", false);
              }
            });
          });
        },
        activate: function activate() {
          if ((0, _registry2.getDraggedContentTypeConfig)() === _config.getContentTypeConfig("column-group")) {
            var _ref;

            line.find(".ui-sortable").each(function () {
              if ((0, _jquery)(this).data("ui-sortable")) {
                (0, _jquery)(this).sortable("option", "disabled", true);
              }
            });
            var classes = [".pagebuilder-content-type.pagebuilder-column .pagebuilder-drop-indicator", ".pagebuilder-content-type.pagebuilder-column .empty-container .content-type-container:before"]; // Ensure we don't display any drop indicators inside the column

            headStyles = (0, _createStylesheet.createStyleSheet)((_ref = {}, _ref[classes.join(", ")] = {
              display: "none!important"
            }, _ref));
            document.head.appendChild(headStyles);
          } else if (headStyles) {
            headStyles.remove();
            headStyles = null;
          }
        },
        drop: function drop() {
          self.dropPositions = [];
          self.dropPlaceholder.removeClass("left right");
        },
        out: function out() {
          self.dropOverElement = null;
          self.dropPlaceholder.removeClass("left right");
        },
        over: function over() {
          // Is the element currently being dragged a column group?
          if ((0, _registry2.getDraggedContentTypeConfig)() === _config.getContentTypeConfig("column-group") || (0, _registry2.getDraggedContentTypeConfig)() === _config.getContentTypeConfig("column")) {
            // Always calculate drop positions when an element is dragged over
            var ownContentType = self.contentType;
            self.dropPositions = (0, _dragAndDrop.calculateDropPositions)(ownContentType);
            self.dropOverElement = true;
          } else {
            self.dropOverElement = null;
          }
        }
      });
    }
    /**
     * Spread any empty space across the other columns when a column is removed
     *
     * @param {number} removedIndex
     */
    ;

    _proto.spreadWidth = function spreadWidth(removedIndex) {
      if (this.contentType.children().length === 0) {
        return;
      }

      var availableWidth = 100 - this.resizeUtils.getColumnsWidth();
      var formattedAvailableWidth = (0, _resize.getRoundedColumnWidth)(availableWidth);
      var totalChildColumns = this.contentType.children().length;
      var allowedColumnWidths = [];
      var spreadAcross = 1;
      var spreadAmount;

      for (var i = this.resizeUtils.getGridSize(); i > 0; i--) {
        allowedColumnWidths.push((0, _resize.getRoundedColumnWidth)(100 / this.resizeUtils.getGridSize() * i));
      } // Determine how we can spread the empty space across the columns


      for (var _i = totalChildColumns; _i > 0; _i--) {
        var potentialWidth = Math.floor(formattedAvailableWidth / _i);

        for (var _iterator = _createForOfIteratorHelperLoose(allowedColumnWidths), _step; !(_step = _iterator()).done;) {
          var width = _step.value;

          if (potentialWidth === Math.floor(width)) {
            spreadAcross = _i;
            spreadAmount = formattedAvailableWidth / _i;
            break;
          }
        }

        if (spreadAmount) {
          break;
        }
      } // Let's spread the width across the columns


      for (var _i2 = 1; _i2 <= spreadAcross; _i2++) {
        var columnToModify = void 0; // As the original column has been removed from the array, check the new index for a column

        if (removedIndex <= this.contentType.children().length && typeof this.contentType.children()[removedIndex] !== "undefined") {
          columnToModify = this.contentType.children()[removedIndex];
        }

        if (!columnToModify && removedIndex - _i2 >= 0 && typeof this.contentType.children()[removedIndex - _i2] !== "undefined") {
          columnToModify = this.contentType.children()[removedIndex - _i2];
        }

        if (columnToModify) {
          (0, _resize.updateColumnWidth)(columnToModify, this.resizeUtils.getColumnWidth(columnToModify) + spreadAmount);
        }
      }
    }
    /**
     * Register a resize handle within a child column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {JQuery} handle
     */
    ;

    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this8 = this;

      handle.off("mousedown touchstart");
      handle.on("mousedown touchstart", function (event) {
        event.preventDefault();

        var groupPosition = _this8.getLinePosition(_this8.element);

        _this8.resizing(true); // @ts-ignore


        _this8.resizeColumnInstance = column;
        _this8.resizeColumnWidths = _this8.resizeUtils.determineColumnWidths(_this8.resizeColumnInstance, groupPosition);
        _this8.resizeMaxGhostWidth = (0, _resize.determineMaxGhostWidth)(_this8.resizeColumnWidths); // Force the cursor to resizing

        (0, _jquery)("body").css("cursor", "col-resize"); // Reset the resize history

        _this8.resizeHistory = {
          left: [],
          right: []
        };
        _this8.resizeLastPosition = null;
        _this8.resizeMouseDown = true;
        ++_this8.interactionLevel;

        _events.trigger("stage:interactionStart", {
          stageId: _this8.contentType.stageId
        });
      });
    }
    /**
     * Add Columns to the current Column Line
     *
     * @returns {Promise<ContentTypeCollectionInterface>}
     */
    ;

    _proto.createColumns = function createColumns() {
      var _this9 = this;

      var defaultGridSize = (0, _gridSize.getDefaultGridSize)();
      var col1Width = (Math.ceil(defaultGridSize / 2) * 100 / defaultGridSize).toFixed(Math.round(100 / defaultGridSize) !== 100 / defaultGridSize ? 8 : 0);
      Promise.all([(0, _contentTypeFactory)(_config.getContentTypeConfig("column"), this.contentType, this.contentType.stageId, {
        width: col1Width + "%"
      }), (0, _contentTypeFactory)(_config.getContentTypeConfig("column"), this.contentType, this.contentType.stageId, {
        width: 100 - parseFloat(col1Width) + "%"
      })]).then(function (columns) {
        _this9.contentType.addChild(columns[0], 0);

        _this9.contentType.addChild(columns[1], 1);

        _this9.fireMountEvent(_this9.contentType, columns[0], columns[1]);
      });
    }
    /**
     * Record the resizing history for this action
     *
     * @param {string} usedHistory
     * @param {string} direction
     * @param {ContentTypeCollectionInterface<ColumnPreview>} adjustedColumn
     * @param {string} modifyColumnInPair
     */
    ;

    _proto.recordResizeHistory = function recordResizeHistory(usedHistory, direction, adjustedColumn, modifyColumnInPair) {
      if (usedHistory) {
        this.resizeHistory[usedHistory].pop();
      }

      this.resizeHistory[direction].push({
        adjustedColumn: adjustedColumn,
        modifyColumnInPair: modifyColumnInPair
      });
    }
    /**
     * Set columns in the group as resizing
     *
     * @param {Array<ContentTypeCollectionInterface<ColumnPreview>>} columns
     */
    ;

    _proto.setColumnsAsResizing = function setColumnsAsResizing() {
      for (var _len = arguments.length, columns = new Array(_len), _key = 0; _key < _len; _key++) {
        columns[_key] = arguments[_key];
      }

      columns.forEach(function (column) {
        column.preview.resizing(true);
        column.preview.element.css({
          transition: "width 350ms ease-in-out"
        });
      });
    }
    /**
     * Handle a column being resized
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} width
     * @param {ContentTypeCollectionInterface<ColumnPreview>} adjustedColumn
     */
    ;

    _proto.onColumnResize = function onColumnResize(column, width, adjustedColumn) {
      this.resizeUtils.resizeColumn(column, width, adjustedColumn);
    }
    /**
     * Fire the mount event for content types
     *
     * @param {ContentTypeInterface[]} contentTypes
     */
    ;

    _proto.fireMountEvent = function fireMountEvent() {
      for (var _len2 = arguments.length, contentTypes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        contentTypes[_key2] = arguments[_key2];
      }

      contentTypes.forEach(function (contentType) {
        _events.trigger("contentType:mountAfter", {
          id: contentType.id,
          contentType: contentType
        });

        _events.trigger(contentType.config.name + ":mountAfter", {
          id: contentType.id,
          contentType: contentType
        });
      });
    }
    /**
     * Remove self if we contain no children
     */
    ;

    _proto.removeIfEmpty = function removeIfEmpty() {
      if (this.contentType.children().length === 0) {
        this.contentType.parentContentType.removeChild(this.contentType);
        return;
      }
    };

    _proto.getNewColumnLineIndex = function getNewColumnLineIndex() {
      var index = -1;
      var self = this;

      for (var _iterator2 = _createForOfIteratorHelperLoose(this.contentType.parentContentType.children()), _step2; !(_step2 = _iterator2()).done;) {
        var child = _step2.value;
        index++;

        if (child.id === self.contentType.id) {
          break;
        }
      }

      if (this.columnLineBottomDropPlaceholder.hasClass("active")) {
        // show the bottom drop placeholder
        index++;
      }

      return index;
    };

    _proto.isColumnBeingMovedToAnotherColumnLine = function isColumnBeingMovedToAnotherColumnLine() {
      var column = (0, _registry.getDragColumn)();

      if (!column) {
        // if no move position, column is not being moved.
        return false;
      }

      if (column.parentContentType !== this.contentType) {
        // if the parent content type is not same as this column line, column is being moved to new column line
        return true;
      }

      if (column.parentContentType === this.contentType && (this.columnLineDropPlaceholder.hasClass("active") || this.columnLineBottomDropPlaceholder.hasClass("active"))) {
        // since new column line drop placeholder is visible, column move should introduce a new column line
        return true;
      }

      return false;
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map