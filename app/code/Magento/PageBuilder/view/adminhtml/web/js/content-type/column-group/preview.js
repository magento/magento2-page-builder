/*eslint-disable */
/* jscs:disable */

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/drag-drop/move-content-type", "Magento_PageBuilder/js/drag-drop/registry", "Magento_PageBuilder/js/drag-drop/sortable", "Magento_PageBuilder/js/utils/check-stage-full-screen", "Magento_PageBuilder/js/utils/create-stylesheet", "Magento_PageBuilder/js/utils/pagebuilder-header-height", "Magento_PageBuilder/js/content-type/column/resize", "Magento_PageBuilder/js/content-type/preview-collection", "Magento_PageBuilder/js/content-type/column-group/drag-and-drop", "Magento_PageBuilder/js/content-type/column-group/factory", "Magento_PageBuilder/js/content-type/column-group/grid-size", "Magento_PageBuilder/js/content-type/column-group/registry"], function (_jquery, _knockout, _translate, _events, _underscore, _config, _moveContentType, _registry, _sortable, _checkStageFullScreen, _createStylesheet, _pagebuilderHeaderHeight, _resize, _previewCollection, _dragAndDrop, _factory, _gridSize, _registry2) {
  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_previewCollection2) {
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
      _this.hasEmptyChild = _knockout.computed(function () {
        var empty = false;

        _this.contentType.getChildren()().forEach(function (column) {
          if (column.getChildren()().length === 0) {
            empty = true;
          }
        });

        return empty;
      });
      _this.gridSize = _knockout.observable();
      _this.gridSizeInput = _knockout.observable();
      _this.gridSizeArray = _knockout.observableArray([]);
      _this.gridSizeError = _knockout.observable();
      _this.gridSizeMax = _knockout.observable((0, _gridSize.getMaxGridSize)());
      _this.gridFormOpen = _knockout.observable(false);
      _this.gridChange = _knockout.observable(false);
      _this.gridToolTipOverFlow = _knockout.observable(false);
      _this.resizeColumnWidths = [];
      _this.resizeHistory = {
        left: [],
        right: []
      };
      _this.dropPositions = [];
      _this.gridSizeHistory = new Map();
      _this.interactionLevel = 0;

      _this.onDocumentClick = function (event) {
        // Verify the click event wasn't within our form
        if (!_jquery.contains((0, _jquery)(_this.wrapperElement).find(".pagebuilder-grid-size-indicator")[0], (0, _jquery)(event.target)[0])) {
          _this.closeGridForm();
        }
      };

      _this.resizeUtils = new _resize(_this.contentType); // Keep track of the grid size in an observable

      _this.contentType.dataStore.subscribe(function (state) {
        var gridSize = parseInt(state.grid_size.toString(), 10);

        _this.gridSize(gridSize);

        _this.gridSizeInput(gridSize);

        if (gridSize) {
          _this.gridSizeArray(new Array(gridSize));
        }
      }, "grid_size");

      _events.on("contentType:removeAfter", function (args) {
        if (args.parentContentType && args.parentContentType.id === _this.contentType.id) {
          _underscore.defer(function () {
            _this.spreadWidth(args.index);
          });
        }
      }); // Listen for resizing events from child columns


      _events.on("column:resizeHandleBindAfter", function (args) {
        // Does the events content type match the previews column group?
        if (args.columnGroup.id === _this.contentType.id) {
          _this.registerResizeHandle(args.column, args.handle);
        }
      });

      _events.on("column:initializeAfter", function (args) {
        // Does the events parent match the previews column group?
        if (args.columnGroup.id === _this.contentType.id) {
          _this.bindDraggable(args.column);
        }
      });

      _this.contentType.children.subscribe(_underscore.debounce(_this.removeIfEmpty.bind(_assertThisInitialized(_this)), 50));

      return _this;
    }
    /**
     * Retrieve the resize utils
     *
     * @returns {Resize}
     */


    var _proto = Preview.prototype;

    _proto.getResizeUtils = function getResizeUtils() {
      return this.resizeUtils;
    }
    /**
     * Handle a new column being dropped into the group
     *
     * @param {DropPosition} dropPosition
     */
    ;

    _proto.onNewColumnDrop = function onNewColumnDrop(dropPosition) {
      var _this2 = this;

      // Create our new column
      (0, _factory.createColumn)(this.contentType, this.resizeUtils.getSmallestColumnWidth(), dropPosition.insertIndex).then(function () {
        var newWidth = _this2.resizeUtils.getAcceptedColumnWidth((_this2.resizeUtils.getColumnWidth(dropPosition.affectedColumn) - _this2.resizeUtils.getSmallestColumnWidth()).toString()); // Reduce the affected columns width by the smallest column width


        (0, _resize.updateColumnWidth)(dropPosition.affectedColumn, newWidth);
      });
    }
    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param {DropPosition} movePosition
     */
    ;

    _proto.onExistingColumnDrop = function onExistingColumnDrop(movePosition) {
      var column = (0, _registry2.getDragColumn)();
      var sourceGroupPreview = column.parentContentType.preview;
      var modifyOldNeighbour; // Determine which old neighbour we should modify

      var oldWidth = sourceGroupPreview.getResizeUtils().getColumnWidth(column); // Retrieve the adjacent column either +1 or -1

      if ((0, _resize.getAdjacentColumn)(column, "+1")) {
        modifyOldNeighbour = (0, _resize.getAdjacentColumn)(column, "+1");
      } else if ((0, _resize.getAdjacentColumn)(column, "-1")) {
        modifyOldNeighbour = (0, _resize.getAdjacentColumn)(column, "-1");
      } // Set the column to it's smallest column width


      (0, _resize.updateColumnWidth)(column, this.resizeUtils.getSmallestColumnWidth()); // Move the content type

      (0, _moveContentType.moveContentType)(column, movePosition.insertIndex, this.contentType); // Modify the old neighbour

      if (modifyOldNeighbour) {
        var oldNeighbourWidth = sourceGroupPreview.getResizeUtils().getAcceptedColumnWidth((oldWidth + sourceGroupPreview.getResizeUtils().getColumnWidth(modifyOldNeighbour)).toString());
        (0, _resize.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
      } // Modify the columns new neighbour


      var newNeighbourWidth = this.resizeUtils.getAcceptedColumnWidth((this.resizeUtils.getColumnWidth(movePosition.affectedColumn) - this.resizeUtils.getSmallestColumnWidth()).toString()); // Reduce the affected columns width by the smallest column width

      (0, _resize.updateColumnWidth)(movePosition.affectedColumn, newNeighbourWidth);
    }
    /**
     * Handle a column being sorted into a new position in the group
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {number} newIndex
     */
    ;

    _proto.onColumnSort = function onColumnSort(column, newIndex) {
      var currentIndex = (0, _resize.getColumnIndexInGroup)(column);

      if (currentIndex !== newIndex) {
        if (currentIndex < newIndex) {
          // As we're moving an array item the keys all reduce by 1
          --newIndex;
        } // Move the content type


        (0, _moveContentType.moveContentType)(column, newIndex);
      }
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
     * Init the droppable & resizing interactions
     *
     * @param group
     */
    ;

    _proto.bindInteractions = function bindInteractions(group) {
      this.groupElement = (0, _jquery)(group);
      this.initDroppable(this.groupElement);
      this.initMouseMove(this.groupElement); // Handle the mouse leaving the window

      (0, _jquery)("body").mouseleave(this.endAllInteractions.bind(this));
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
     * Register a resize handle within a child column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {JQuery} handle
     */
    ;

    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this3 = this;

      handle.off("mousedown touchstart");
      handle.on("mousedown touchstart", function (event) {
        event.preventDefault();

        var groupPosition = _this3.getGroupPosition(_this3.groupElement);

        _this3.resizing(true);

        _this3.resizeColumnInstance = column;
        _this3.resizeColumnWidths = _this3.resizeUtils.determineColumnWidths(_this3.resizeColumnInstance, groupPosition);
        _this3.resizeMaxGhostWidth = (0, _resize.determineMaxGhostWidth)(_this3.resizeColumnWidths); // Force the cursor to resizing

        (0, _jquery)("body").css("cursor", "col-resize"); // Reset the resize history

        _this3.resizeHistory = {
          left: [],
          right: []
        };
        _this3.resizeLastPosition = null;
        _this3.resizeMouseDown = true;
        ++_this3.interactionLevel;

        _events.trigger("stage:interactionStart", {
          stageId: _this3.contentType.stageId
        });
      });
    }
    /**
     * Bind draggable instances to the child columns
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     */
    ;

    _proto.bindDraggable = function bindDraggable(column) {
      var _this4 = this;

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


          (0, _registry2.setDragColumn)(columnInstance.contentType);
          _this4.dropPositions = (0, _dragAndDrop.calculateDropPositions)(_this4.contentType);
          _this4.startDragEvent = event;

          _events.trigger("column:dragStart", {
            column: columnInstance,
            stageId: _this4.contentType.stageId
          });

          _events.trigger("stage:interactionStart", {
            stageId: _this4.contentType.stageId
          });
        },
        stop: function stop() {
          var draggedColumn = (0, _registry2.getDragColumn)();

          if (_this4.movePosition && draggedColumn) {
            // Check if we're moving within the same group, even though this function will
            // only ever run on the group that bound the draggable event
            if (draggedColumn.parentContentType === _this4.contentType) {
              _this4.onColumnSort(draggedColumn, _this4.movePosition.insertIndex);

              _this4.movePosition = null;
            }
          }

          (0, _registry2.removeDragColumn)();

          _this4.dropPlaceholder.removeClass("left right");

          _this4.movePlaceholder.removeClass("active");

          _this4.startDragEvent = null;

          _events.trigger("column:dragStop", {
            column: draggedColumn,
            stageId: _this4.contentType.stageId
          });

          _events.trigger("stage:interactionStop", {
            stageId: _this4.contentType.stageId
          });
        }
      });
    }
    /**
     * Update the grid size on enter or blur of the input
     */
    ;

    _proto.updateGridSize = function updateGridSize() {
      var _this5 = this;

      if (!_jquery.isNumeric(this.gridSizeInput())) {
        this.gridSizeError((0, _translate)("Please enter a valid number."));
      }

      var newGridSize = parseInt(this.gridSizeInput().toString(), 10);

      if (newGridSize || newGridSize === 0) {
        if (newGridSize !== this.resizeUtils.getGridSize()) {
          try {
            (0, _gridSize.resizeGrid)(this.contentType, newGridSize, this.gridSizeHistory);
            this.recordGridResize(newGridSize);
            this.gridSizeError(null); // Make the grid "flash" on successful change

            this.gridChange(true);

            _underscore.delay(function () {
              _this5.gridChange(false);
            }, 1000);
          } catch (e) {
            if (e instanceof _gridSize.GridSizeError) {
              this.gridSizeError(e.message);
            } else {
              throw e;
            }
          }
        } else {
          this.gridSizeError(null);
        }
      }
    }
    /**
     * On grid input key up, check if the enter key was used and submit
     *
     * @param {Preview} context
     * @param {KeyboardEvent} event
     */
    ;

    _proto.onGridInputKeyUp = function onGridInputKeyUp(context, event) {
      if (event.which === 13 || event.keyCode === 13) {
        this.updateGridSize();
      }
    }
    /**
     * On grid input blur, update the grid size
     */
    ;

    _proto.onGridInputBlur = function onGridInputBlur() {
      this.updateGridSize();
    }
    /**
     * Hide grid size panel on focus out
     */
    ;

    _proto.closeGridForm = function closeGridForm() {
      this.updateGridSize();

      if (!this.gridSizeError()) {
        this.gridFormOpen(false);
        this.gridToolTipOverFlow(false);

        _events.trigger("stage:interactionStop");

        _events.trigger("stage:childFocusStop");

        (0, _jquery)(document).off("click focusin", this.onDocumentClick);
      }
    }
    /**
     * Show grid size panel on click and start interaction
     */
    ;

    _proto.openGridForm = function openGridForm() {
      var _this6 = this;

      var tooltip = (0, _jquery)(this.wrapperElement).find("[role='tooltip']");

      if (!this.gridFormOpen()) {
        this.gridSizeHistory = new Map();
        this.recordGridResize(this.gridSize()); // inline tooltip out of bounds

        var tooltipClientRectTop = tooltip[0].getBoundingClientRect().top - (0, _pagebuilderHeaderHeight)(this.contentType.stageId);

        if ((0, _checkStageFullScreen)(this.contentType.stageId) && tooltip[0].getBoundingClientRect().height > tooltipClientRectTop) {
          this.gridToolTipOverFlow(true);
        }

        this.gridFormOpen(true); // Wait for animation to complete

        _underscore.delay(function () {
          (0, _jquery)(_this6.wrapperElement).find(".grid-panel-item-wrapper input").focus().select();
        }, 200);

        (0, _jquery)(document).on("click focusin", this.onDocumentClick);

        _events.trigger("stage:interactionStart");

        _events.trigger("stage:childFocusStart");
      }
    }
    /**
     * Handle a click on the document closing the grid form
     *
     * @param {Event} event
     */
    ;

    /**
     * Set columns in the group as resizing
     *
     * @param {Array<ContentTypeCollectionInterface<ColumnPreview>>} columns
     */
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

      this.resizing(false);
      this.resizeMouseDown = null;
      this.resizeLeftLastColumnShrunk = this.resizeRightLastColumnShrunk = null;
      this.dropPositions = [];
      this.unsetResizingColumns(); // Change the cursor back

      (0, _jquery)("body").css("cursor", "");
      this.dropPlaceholder.removeClass("left right");
      this.movePlaceholder.css("left", "").removeClass("active");
      this.resizeGhost.removeClass("active"); // Reset the group positions cache

      this.groupPositionCache = null;
    }
    /**
     * Init the resizing events on the group
     *
     * @param {JQuery} group
     */
    ;

    _proto.initMouseMove = function initMouseMove(group) {
      var _this7 = this;

      var intersects = false;
      (0, _jquery)(document).on("mousemove touchmove", function (event) {
        if (group.parents(_sortable.hiddenClass).length > 0) {
          return;
        }

        var groupPosition = _this7.getGroupPosition(group); // If we're handling a touch event we need to pass through the page X & Y


        if (event.type === "touchmove") {
          event.pageX = event.originalEvent.pageX;
          event.pageY = event.originalEvent.pageY;
        }

        if (_this7.eventIntersectsGroup(event, groupPosition)) {
          intersects = true;

          _this7.onResizingMouseMove(event, group, groupPosition);

          _this7.onDraggingMouseMove(event, group, groupPosition);

          _this7.onDroppingMouseMove(event, group, groupPosition);
        } else {
          intersects = false;
          _this7.groupPositionCache = null;
          _this7.dropPosition = null;

          _this7.dropPlaceholder.removeClass("left right");

          _this7.movePlaceholder.css("left", "").removeClass("active");
        }
      }).on("mouseup touchend", function () {
        if (intersects) {
          _this7.handleMouseUp();
        }

        intersects = false;
        _this7.dropPosition = null;

        _this7.endAllInteractions();

        _underscore.defer(function () {
          // Re-enable any disabled sortable areas
          group.find(".ui-sortable").each(function () {
            if ((0, _jquery)(this).data("sortable")) {
              (0, _jquery)(this).sortable("option", "disabled", false);
            }
          });
        });
      });
    }
    /**
     * Handle the mouse up action, either adding a new column or moving an existing
     */
    ;

    _proto.handleMouseUp = function handleMouseUp() {
      if (this.dropOverElement && this.dropPosition) {
        this.onNewColumnDrop(this.dropPosition);
        this.dropOverElement = null; // Re-enable the parent disabled sortable instance

        _underscore.defer(function () {
          (0, _jquery)(".element-children.ui-sortable-disabled").each(function () {
            (0, _jquery)(this).sortable("option", "disabled", false);
          });
        });
      }

      var column = (0, _registry2.getDragColumn)();

      if (this.movePosition && column && column.parentContentType !== this.contentType) {
        this.onExistingColumnDrop(this.movePosition);
      }
    }
    /**
     * Does the current event intersect with the group?
     *
     * @param {JQueryEventObject} event
     * @param {GroupPositionCache} groupPosition
     * @returns {boolean}
     */
    ;

    _proto.eventIntersectsGroup = function eventIntersectsGroup(event, groupPosition) {
      return event.pageY > groupPosition.top && event.pageY < groupPosition.top + groupPosition.outerHeight && event.pageX > groupPosition.left && event.pageX < groupPosition.left + groupPosition.outerWidth;
    }
    /**
     * Cache the groups positions
     *
     * @param {JQuery} group
     * @returns {GroupPositionCache}
     */
    ;

    _proto.getGroupPosition = function getGroupPosition(group) {
      if (!this.groupPositionCache) {
        this.groupPositionCache = {
          top: group.offset().top,
          left: group.offset().left,
          width: group.width(),
          height: group.height(),
          outerWidth: group.outerWidth(),
          outerHeight: group.outerHeight()
        };
      }

      return this.groupPositionCache;
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
     * Handle the resizing on mouse move, we always resize a pair of columns at once
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} group
     * @param {GroupPositionCache} groupPosition
     */
    ;

    _proto.onResizingMouseMove = function onResizingMouseMove(event, group, groupPosition) {
      var _this8 = this;

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
                _this8.resizeColumnWidths = _this8.resizeUtils.determineColumnWidths(_this8.resizeColumnInstance, groupPosition);
                _this8.resizeMaxGhostWidth = (0, _resize.determineMaxGhostWidth)(_this8.resizeColumnWidths);
              });
            }
          }
        }
      }
    }
    /**
     * Handle a column being dragged around the group
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} group
     * @param {GroupPositionCache} groupPosition
     */
    ;

    _proto.onDraggingMouseMove = function onDraggingMouseMove(event, group, groupPosition) {
      var dragColumn = (0, _registry2.getDragColumn)();

      if (dragColumn) {
        // If the drop positions haven't been calculated for this group do so now
        if (this.dropPositions.length === 0) {
          this.dropPositions = (0, _dragAndDrop.calculateDropPositions)(this.contentType);
        }

        var columnInstance = dragColumn;
        var currentX = event.pageX - groupPosition.left; // Are we within the same column group or have we ended up over another?

        if (columnInstance.parentContentType === this.contentType && this.startDragEvent) {
          var dragDirection = event.pageX <= this.startDragEvent.pageX ? "left" : "right";
          var adjacentLeftColumn = (0, _resize.getAdjacentColumn)(dragColumn, "-1"); // Determine the current move position based on the cursors position and direction of drag

          this.movePosition = this.dropPositions.find(function (position) {
            return currentX > position.left && currentX < position.right && position.placement === dragDirection && position.affectedColumn !== dragColumn;
          }); // Differences in the element & event positions cause a right movement to activate on the left column

          if (this.movePosition && dragDirection === "right" && this.movePosition.affectedColumn === adjacentLeftColumn) {
            this.movePosition = null;
          }

          if (this.movePosition) {
            this.dropPlaceholder.removeClass("left right");
            this.movePlaceholder.css({
              left: this.movePosition.placement === "left" ? this.movePosition.left : "",
              right: this.movePosition.placement === "right" ? groupPosition.width - this.movePosition.right : "",
              width: dragColumn.preview.element.outerWidth() + "px"
            }).addClass("active");
          } else {
            this.movePlaceholder.removeClass("active");
          }
        } else {
          // If we're moving to another column group we utilise the existing drop placeholder
          this.movePosition = this.dropPositions.find(function (position) {
            return currentX > position.left && currentX <= position.right && position.canShrink;
          });

          if (this.movePosition) {
            var classToRemove = this.movePosition.placement === "left" ? "right" : "left";
            this.movePlaceholder.removeClass("active");
            this.dropPlaceholder.removeClass(classToRemove).css({
              left: this.movePosition.placement === "left" ? this.movePosition.left : "",
              right: this.movePosition.placement === "right" ? groupPosition.width - this.movePosition.right : "",
              width: groupPosition.width / this.resizeUtils.getGridSize() + "px"
            }).addClass(this.movePosition.placement);
          } else {
            this.dropPlaceholder.removeClass("left right");
          }
        }
      }
    }
    /**
     * Handle mouse move events on when dropping elements
     *
     * @param {JQueryEventObject} event
     * @param {JQuery} group
     * @param {GroupPositionCache} groupPosition
     */
    ;

    _proto.onDroppingMouseMove = function onDroppingMouseMove(event, group, groupPosition) {
      var elementChildrenParent = group.parents(".element-children"); // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly

      if (this.dropOverElement && event.pageY > groupPosition.top + 20 && event.pageY < groupPosition.top + groupPosition.outerHeight - 20) {
        // Disable the column group sortable instance
        if (elementChildrenParent.data("sortable")) {
          elementChildrenParent.sortable("option", "disabled", true);
        }

        var currentX = event.pageX - groupPosition.left;
        this.dropPosition = this.dropPositions.find(function (position) {
          return currentX > position.left && currentX <= position.right && position.canShrink;
        });

        if (this.dropPosition) {
          this.dropPlaceholder.removeClass("left right").css({
            left: this.dropPosition.placement === "left" ? this.dropPosition.left : "",
            right: this.dropPosition.placement === "right" ? groupPosition.width - this.dropPosition.right : "",
            width: groupPosition.width / this.resizeUtils.getGridSize() + "px"
          }).addClass(this.dropPosition.placement);
        }
      } else if (this.dropOverElement) {
        // Re-enable the column group sortable instance
        if (elementChildrenParent.data("sortable")) {
          elementChildrenParent.sortable("option", "disabled", false);
        }

        this.dropPosition = null;
        this.dropPlaceholder.removeClass("left right");
      }
    }
    /**
     * Init the droppable functionality for new columns
     *
     * @param {JQuery} group
     */
    ;

    _proto.initDroppable = function initDroppable(group) {
      var self = this;
      var headStyles;
      group.droppable({
        deactivate: function deactivate() {
          self.dropOverElement = null;
          self.dropPlaceholder.removeClass("left right");

          _underscore.defer(function () {
            // Re-enable the column group sortable instance & all children sortable instances
            group.parents(".element-children").each(function () {
              if ((0, _jquery)(this).data("sortable")) {
                (0, _jquery)(this).sortable("option", "disabled", false);
              }
            });
          });
        },
        activate: function activate() {
          if ((0, _registry.getDraggedContentTypeConfig)() === _config.getContentTypeConfig("column")) {
            var _ref;

            group.find(".ui-sortable").each(function () {
              if ((0, _jquery)(this).data("sortable")) {
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
          // Is the element currently being dragged a column?
          if ((0, _registry.getDraggedContentTypeConfig)() === _config.getContentTypeConfig("column")) {
            // Always calculate drop positions when an element is dragged over
            self.dropPositions = (0, _dragAndDrop.calculateDropPositions)(self.contentType);
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

        for (var _iterator = allowedColumnWidths, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray) {
            if (_i2 >= _iterator.length) break;
            _ref2 = _iterator[_i2++];
          } else {
            _i2 = _iterator.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
          }

          var width = _ref2;

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


      for (var _i3 = 1; _i3 <= spreadAcross; _i3++) {
        var columnToModify = void 0; // As the original column has been removed from the array, check the new index for a column

        if (removedIndex <= this.contentType.children().length && typeof this.contentType.children()[removedIndex] !== "undefined") {
          columnToModify = this.contentType.children()[removedIndex];
        }

        if (!columnToModify && removedIndex - _i3 >= 0 && typeof this.contentType.children()[removedIndex - _i3] !== "undefined") {
          columnToModify = this.contentType.children()[removedIndex - _i3];
        }

        if (columnToModify) {
          (0, _resize.updateColumnWidth)(columnToModify, this.resizeUtils.getColumnWidth(columnToModify) + spreadAmount);
        }
      }
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
    }
    /**
     * Record the grid resize operation into a history for later restoration
     *
     * @param {number} newGridSize
     */
    ;

    _proto.recordGridResize = function recordGridResize(newGridSize) {
      var _this9 = this;

      if (!this.gridSizeHistory.has(newGridSize)) {
        var columnWidths = [];
        this.contentType.getChildren()().forEach(function (column) {
          columnWidths.push(_this9.resizeUtils.getColumnWidth(column));
        });
        this.gridSizeHistory.set(newGridSize, columnWidths);
      }
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map