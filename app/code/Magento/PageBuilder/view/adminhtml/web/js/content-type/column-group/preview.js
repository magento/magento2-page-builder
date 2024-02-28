/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/drag-drop/move-content-type", "Magento_PageBuilder/js/drag-drop/registry", "Magento_PageBuilder/js/drag-drop/sortable", "Magento_PageBuilder/js/utils/check-stage-full-screen", "Magento_PageBuilder/js/utils/create-stylesheet", "Magento_PageBuilder/js/content-type/column/resize", "Magento_PageBuilder/js/content-type/preview-collection", "Magento_PageBuilder/js/content-type/column-group/drag-and-drop", "Magento_PageBuilder/js/content-type/column-group/factory", "Magento_PageBuilder/js/content-type/column-group/grid-size", "Magento_PageBuilder/js/content-type/column-group/registry"], function (_jquery, _knockout, _translate, _hideShowOption, _events, _underscore, _config, _contentTypeFactory, _moveContentType, _registry, _sortable, _checkStageFullScreen, _createStylesheet, _resize, _previewCollection, _dragAndDrop, _factory, _gridSize, _registry2) {
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
      });

      _events.on("column:initializeAfter", function (args) {
        // Does the events parent match the previews column group?
        if (args.columnGroup.id === _this.contentType.id) {
          _this.bindDraggable(args.column);
        }
      });

      _events.on("stage:" + _this.contentType.stageId + ":readyAfter", _this.moveContentsToNewColumnGroup.bind(_assertThisInitialized(_this)));

      _events.on("column-group:renderAfter", function (args) {
        if (args.contentType.id === _this.contentType.id) {
          if (!_this.hasColumnLine(args.contentType)) {
            args.element.classList.add("no-column-line");
          } else {
            args.element.classList.remove("no-column-line");
            args.element.classList.add("with-column-line");
          }
        }
      });

      _this.contentType.children.subscribe(_underscore.debounce(_this.removeIfEmpty.bind(_assertThisInitialized(_this)), 50));

      return _this;
    }
    /**
     * Handle user editing an instance
     */


    var _proto = Preview.prototype;

    _proto.onOptionEdit = function onOptionEdit() {
      var numCols = this.contentType.getChildren()().length; // count the number of non empty columns

      var numEmptyColumns = 0;
      this.contentType.getChildren()().forEach(function (column) {
        if (column.getChildren()().length === 0) {
          numEmptyColumns++;
        }
      });
      var appearance = this.contentType.dataStore.get("appearance") ? this.contentType.dataStore.get("appearance") : "default";
      this.contentType.dataStore.set("appearance", appearance);
      this.contentType.dataStore.set("non_empty_column_count", this.getNonEmptyColumnCount());
      this.contentType.dataStore.set("max_grid_size", (0, _gridSize.getMaxGridSize)());
      this.contentType.dataStore.set("initial_grid_size", this.contentType.dataStore.get("grid_size"));

      _previewCollection2.prototype.openEdit.call(this);
    }
    /**
     * Bind events
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _previewCollection2.prototype.bindEvents.call(this);

      if (_config.getContentTypeConfig("column")) {
        _events.on("column-group:dropAfter", function (args) {
          if (args.id === _this2.contentType.id) {
            _this2.setDefaultGridSizeOnColumnGroup();

            _this2.addDefaultColumnLine(args);
          }
        });
      }

      _events.on("form:" + this.contentType.id + ":saveAfter", function () {
        if (_this2.contentType.dataStore.get("grid_size") !== _this2.contentType.dataStore.get("initial_grid_size")) {
          _this2.updateGridSize();
        }
      });
    }
    /**
     * Set default grid size on current column group
     */
    ;

    _proto.setDefaultGridSizeOnColumnGroup = function setDefaultGridSizeOnColumnGroup() {
      this.contentType.dataStore.set("grid_size", (0, _gridSize.getDefaultGridSize)());
    }
    /**
     * Add Columns to the current Column Group
     *
     * @returns {Promise<ContentTypeCollectionInterface>}
     */
    ;

    _proto.createColumns = function createColumns() {
      var _this3 = this;

      var defaultGridSize = (0, _gridSize.getDefaultGridSize)();
      var col1Width = (Math.ceil(defaultGridSize / 2) * 100 / defaultGridSize).toFixed(Math.round(100 / defaultGridSize) !== 100 / defaultGridSize ? 8 : 0);
      Promise.all([(0, _contentTypeFactory)(_config.getContentTypeConfig("column"), this.contentType, this.contentType.stageId, {
        width: col1Width + "%"
      }), (0, _contentTypeFactory)(_config.getContentTypeConfig("column"), this.contentType, this.contentType.stageId, {
        width: 100 - parseFloat(col1Width) + "%"
      })]).then(function (columns) {
        _this3.contentType.addChild(columns[0], 0);

        _this3.contentType.addChild(columns[1], 1);

        _this3.fireMountEvent(_this3.contentType, columns[0], columns[1]);
      });
    };

    _proto.addDefaultColumnLine = function addDefaultColumnLine(args) {
      var _this4 = this;

      (0, _contentTypeFactory)(_config.getContentTypeConfig("column-line"), this.contentType, this.contentType.stageId).then(function (columnLine) {
        _this4.contentType.addChild(columnLine, 0);

        if (args.columnGroupWithoutColumnLine === undefined) {
          _events.trigger(columnLine.config.name + ":dropAfter", {
            id: columnLine.id,
            columnLine: columnLine
          });
        } else {
          // Move children of this column group without column line as descendant of new
          // column group that has a column line
          var children = args.columnGroupWithoutColumnLine.getChildren()();
          var index = 0;
          children.forEach(function (child) {
            setTimeout(function () {
              (0, _moveContentType.moveContentType)(child, index++, columnLine);
            }, 250);
          });
        }

        _this4.fireMountEvent(_this4.contentType, columnLine);
      });
    }
    /**
     * Use the conditional remove to disable the option when the content type has a single child
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _previewCollection2.prototype.retrieveOptions.call(this);

      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }
    /**
     * Return selected element styles
     *
     * @param element
     * @param styleProperties
     */
    ;

    _proto.getStyle = function getStyle(element, styleProperties) {
      var stylesObject = element.style();
      return styleProperties.reduce(function (obj, key) {
        var _extends2;

        return _extends({}, obj, (_extends2 = {}, _extends2[key] = stylesObject[key], _extends2));
      }, {});
    }
    /**
     * Return element styles without selected
     *
     * @param element
     * @param styleProperties
     */
    ;

    _proto.getStyleWithout = function getStyleWithout(element, styleProperties) {
      var stylesObject = element.style();
      return Object.keys(stylesObject).filter(function (key) {
        return !styleProperties.includes(key);
      }).reduce(function (obj, key) {
        var _extends3;

        return _extends({}, obj, (_extends3 = {}, _extends3[key] = stylesObject[key], _extends3));
      }, {});
    }
    /**
     * Get background image url base on the viewport.
     *
     * @returns {string}
     */
    ;

    _proto.getBackgroundImage = function getBackgroundImage() {
      var mobileImage = this.contentType.dataStore.get("mobile_image");
      var desktopImage = this.contentType.dataStore.get("background_image");
      var backgroundImage = this.viewport() === "mobile" && mobileImage.length ? mobileImage : desktopImage;
      return backgroundImage.length ? "url(\"" + backgroundImage[0].url + "\")" : "none";
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
     * Handle a new column being dropped into the group
     *
     * @param {DropPosition} dropPosition
     */
    ;

    _proto.onNewColumnDrop = function onNewColumnDrop(dropPosition) {
      var _this5 = this;

      // Create our new column
      (0, _factory.createColumn)(this.contentType, this.resizeUtils.getSmallestColumnWidth(), dropPosition.insertIndex).then(function () {
        var newWidth = _this5.resizeUtils.getAcceptedColumnWidth((_this5.resizeUtils.getColumnWidth(dropPosition.affectedColumn) - _this5.resizeUtils.getSmallestColumnWidth()).toString()); // Reduce the affected columns width by the smallest column width


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
     * @deprecated - dropPlaceholder functionality moved to column-line
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
     * @deprecated
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {JQuery} handle
     */
    ;

    _proto.registerResizeHandle = function registerResizeHandle(column, handle) {
      var _this6 = this;

      handle.off("mousedown touchstart");
      handle.on("mousedown touchstart", function (event) {
        event.preventDefault();

        var groupPosition = _this6.getGroupPosition(_this6.groupElement);

        _this6.resizing(true);

        _this6.resizeColumnInstance = column;
        _this6.resizeColumnWidths = _this6.resizeUtils.determineColumnWidths(_this6.resizeColumnInstance, groupPosition);
        _this6.resizeMaxGhostWidth = (0, _resize.determineMaxGhostWidth)(_this6.resizeColumnWidths); // Force the cursor to resizing

        (0, _jquery)("body").css("cursor", "col-resize"); // Reset the resize history

        _this6.resizeHistory = {
          left: [],
          right: []
        };
        _this6.resizeLastPosition = null;
        _this6.resizeMouseDown = true;
        ++_this6.interactionLevel;

        _events.trigger("stage:interactionStart", {
          stageId: _this6.contentType.stageId
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
      var _this7 = this;

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
          _this7.dropPositions = (0, _dragAndDrop.calculateDropPositions)(_this7.contentType);
          _this7.startDragEvent = event;

          _events.trigger("column:dragStart", {
            column: columnInstance,
            stageId: _this7.contentType.stageId
          });

          _events.trigger("stage:interactionStart", {
            stageId: _this7.contentType.stageId
          });
        },
        stop: function stop() {
          var draggedColumn = (0, _registry2.getDragColumn)();

          if (_this7.movePosition && draggedColumn) {
            // Check if we're moving within the same group, even though this function will
            // only ever run on the group that bound the draggable event
            if (draggedColumn.parentContentType === _this7.contentType) {
              _this7.onColumnSort(draggedColumn, _this7.movePosition.insertIndex);

              _this7.movePosition = null;
            }
          }

          (0, _registry2.removeDragColumn)();

          _this7.movePlaceholder.removeClass("active");

          _this7.startDragEvent = null;

          _events.trigger("column:dragStop", {
            column: draggedColumn,
            stageId: _this7.contentType.stageId
          });

          _events.trigger("stage:interactionStop", {
            stageId: _this7.contentType.stageId
          });
        }
      });
    }
    /**
     * Update the grid size on enter or blur of the input
     */
    ;

    _proto.updateGridSize = function updateGridSize() {
      var _this8 = this;

      if (!_jquery.isNumeric(this.gridSizeInput())) {
        this.gridSizeError((0, _translate)("Please enter a valid number."));
      }

      var newGridSize = parseInt(this.gridSizeInput().toString(), 10);

      if (newGridSize || newGridSize === 0) {
        if (newGridSize !== this.resizeUtils.getGridSize() || true) {
          try {
            (0, _gridSize.resizeGrid)(this.contentType, newGridSize, this.gridSizeHistory);
            this.recordGridResize(newGridSize);
            this.gridSizeError(null); // Make the grid "flash" on successful change

            this.gridChange(true);

            _underscore.delay(function () {
              _this8.gridChange(false);
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
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
     * @private
     */
    ;

    _proto.hasColumnLine = function hasColumnLine(contentType) {
      var children = this.contentType.getChildren()();
      var hasColumnLine = false;

      if (children.length === 0 && (0, _checkStageFullScreen)(contentType.stageId)) {
        // new column group, so it has a column line
        hasColumnLine = true;
      }

      children.forEach(function (child) {
        if (child.config.name === "column-line") {
          hasColumnLine = true;
        }
      });
      return hasColumnLine;
    }
    /**
     * If the column group does not have a column line, move contents to a new column group with a column line
     */
    ;

    _proto.moveContentsToNewColumnGroup = function moveContentsToNewColumnGroup() {
      var _this9 = this;

      if (this.hasColumnLine(this.contentType)) {
        // This column-group already has a column line. Don't need to add one.
        return;
      }

      var indexToInsertNewColumnGroupAt = this.getCurrentIndexInParent();
      (0, _contentTypeFactory)(_config.getContentTypeConfig("column-group"), this.contentType.parentContentType, this.contentType.stageId).then(function (columnGroup) {
        _this9.contentType.parentContentType.addChild(columnGroup, indexToInsertNewColumnGroupAt);

        _events.trigger(columnGroup.config.name + ":dropAfter", {
          id: columnGroup.id,
          columnGroup: columnGroup,
          columnGroupWithoutColumnLine: _this9.contentType
        });

        _this9.fireMountEvent(_this9.contentType, columnGroup);
      });
    }
    /**
     * @private return index of current content type in parent
     */
    ;

    _proto.getCurrentIndexInParent = function getCurrentIndexInParent() {
      var parentContentType = this.contentType.parentContentType;
      var currentIndex = 0;

      for (var _iterator = _createForOfIteratorHelperLoose(this.contentType.parentContentType.getChildren()()), _step; !(_step = _iterator()).done;) {
        var sibling = _step.value;

        if (sibling.id !== this.contentType.id) {
          currentIndex++;
          continue;
        }

        break;
      }

      return currentIndex;
    }
    /**
     * Fire the mount event for content types
     *
     * @param {ContentTypeInterface[]} contentTypes
     */
    ;

    _proto.fireMountEvent = function fireMountEvent() {
      for (var _len = arguments.length, contentTypes = new Array(_len), _key = 0; _key < _len; _key++) {
        contentTypes[_key] = arguments[_key];
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
     * Set columns in the group as resizing
     *
     * @param {Array<ContentTypeCollectionInterface<ColumnPreview>>} columns
     */
    ;

    _proto.setColumnsAsResizing = function setColumnsAsResizing() {
      for (var _len2 = arguments.length, columns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        columns[_key2] = arguments[_key2];
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
      this.dropPositions = []; // this.unsetResizingColumns();
      // Change the cursor back

      (0, _jquery)("body").css("cursor", "");
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
      var _this10 = this;

      var intersects = false;
      (0, _jquery)(document).on("mousemove touchmove", function (event) {
        if (group.parents(_sortable.hiddenClass).length > 0) {
          return;
        }

        var groupPosition = _this10.getGroupPosition(group); // If we're handling a touch event we need to pass through the page X & Y


        if (event.type === "touchmove") {
          event.pageX = event.originalEvent.pageX;
          event.pageY = event.originalEvent.pageY;
        }

        if (_this10.eventIntersectsGroup(event, groupPosition)) {
          intersects = true; // @todo make column re-sizing work

          _this10.onResizingMouseMove(event, group, groupPosition);
        } else {
          intersects = false;
          _this10.groupPositionCache = null;
          _this10.dropPosition = null;

          _this10.movePlaceholder.css("left", "").removeClass("active");
        }
      }).on("mouseup touchend", function () {
        intersects = false;
        _this10.dropPosition = null;

        _this10.endAllInteractions();

        _underscore.defer(function () {
          // Re-enable any disabled sortable areas
          group.find(".ui-sortable").each(function () {
            if ((0, _jquery)(this).data("ui-sortable")) {
              (0, _jquery)(this).sortable("option", "disabled", false);
            }
          });
        });
      });
    }
    /**
     * Handle the mouse up action, either adding a new column or moving an existing
     * @deprecated
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
      var _this11 = this;

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
                _this11.resizeColumnWidths = _this11.resizeUtils.determineColumnWidths(_this11.resizeColumnInstance, groupPosition);
                _this11.resizeMaxGhostWidth = (0, _resize.determineMaxGhostWidth)(_this11.resizeColumnWidths);
              });
            }
          }
        }
      }
    }
    /**
     * Handle a column being dragged around the group
     * @deprecated - this is now handled in column-line/preview onDraggingMouseMove
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
     * @deprecated now handled in column-line/preview
     */
    ;

    _proto.onDroppingMouseMove = function onDroppingMouseMove(event, group, groupPosition) {
      var elementChildrenParent = group.parents(".element-children"); // Only initiate this process if we're within the group by a buffer to allow for sortable to function correctly

      if (this.dropOverElement && event.pageY > groupPosition.top + 20 && event.pageY < groupPosition.top + groupPosition.outerHeight - 20) {
        // Disable the column group sortable instance
        if (elementChildrenParent.data("ui-sortable")) {
          elementChildrenParent.sortable("option", "disabled", true);
        }

        var currentX = event.pageX - groupPosition.left;
        this.dropPosition = this.dropPositions.find(function (position) {
          return currentX > position.left && currentX <= position.right && position.canShrink;
        });
      } else if (this.dropOverElement) {
        // Re-enable the column group sortable instance
        if (elementChildrenParent.data("ui-sortable")) {
          elementChildrenParent.sortable("option", "disabled", false);
        }

        this.dropPosition = null;
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

          _underscore.defer(function () {
            // Re-enable the column group sortable instance & all children sortable instances
            group.parents(".element-children").each(function () {
              if ((0, _jquery)(this).data("ui-sortable")) {
                (0, _jquery)(this).sortable("option", "disabled", false);
              }
            });
          });
        },
        activate: function activate() {
          if ((0, _registry.getDraggedContentTypeConfig)() === _config.getContentTypeConfig("column-group")) {
            var _ref;

            group.find(".ui-sortable").each(function () {
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
        },
        out: function out() {
          self.dropOverElement = null;
        },
        over: function over() {
          // Is the element currently being dragged a column group?
          if ((0, _registry.getDraggedContentTypeConfig)() === _config.getContentTypeConfig("column-group")) {
            // Always calculate drop positions when an element is dragged over
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

        for (var _iterator2 = _createForOfIteratorHelperLoose(allowedColumnWidths), _step2; !(_step2 = _iterator2()).done;) {
          var width = _step2.value;

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
      var _this12 = this;

      // @todo evaluate utility of having a grid size history
      return;

      if (!this.gridSizeHistory.has(newGridSize)) {
        var columnWidths = [];
        this.contentType.getChildren()().forEach(function (column) {
          columnWidths.push(_this12.resizeUtils.getColumnWidth(column));
        });
        this.gridSizeHistory.set(newGridSize, columnWidths);
      }
    }
    /**
     * Figure out the maximum number of non-empty columns in various column lines
     * @private
     */
    ;

    _proto.getNonEmptyColumnCount = function getNonEmptyColumnCount() {
      var nonEmptyColumnCount = 0;
      this.contentType.getChildren()().forEach(function (columnLine, index) {
        var numEmptyColumns = 0;
        var numCols = columnLine.getChildren()().length;
        columnLine.getChildren()().forEach(function (column) {
          if (column.getChildren()().length === 0) {
            numEmptyColumns++;
          }
        });

        if (numCols - numEmptyColumns > nonEmptyColumnCount) {
          nonEmptyColumnCount = numCols - numEmptyColumns;
        }
      });
      return nonEmptyColumnCount;
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map