/*eslint-disable */
define(["mage/translate", "underscore", "../../utils/array", "../event-bus", "./block", "./column-group/factory", "./column-group/resizing", "./preview/column-group/registry", "./preview/column-group/resizing"], function (_translate, _underscore, _array, _eventBus, _block, _factory, _resizing, _registry, _resizing2) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ColumnGroup =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ColumnGroup, _Block);

    /**
     * @param {EditableArea} parent
     * @param {Stage} stage
     * @param {ConfigContentBlock} config
     * @param formData
     */
    function ColumnGroup(parent, stage, config, formData) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData) || this;

      _eventBus.on("block:removed", function (event, params) {
        if (params.parent.id === _this.id) {
          _this.spreadWidth(event, params);
        }
      }); // Listen for resizing events from child columns


      _eventBus.on("column:bindResizeHandle", function (event, params) {
        // Does the events parent match the previews parent? (e.g. column group)
        if (params.parent.id === _this.id) {
          _this.preview.registerResizeHandle(params.column, params.handle);
        }
      });

      _eventBus.on("column:initElement", function (event, params) {
        // Does the events parent match the previews parent? (e.g. column group)
        if (params.parent.id === _this.id) {
          _this.preview.bindDraggable(params.column);
        }
      });

      _this.children.subscribe(_underscore.debounce(_this.removeIfEmpty.bind(_this), 50));

      return _this;
    }
    /**
     * Duplicate a child of the current instance
     *
     * @param {Column} child
     * @param {boolean} autoAppend
     * @returns {Structural|Undefined}
     */


    var _proto = ColumnGroup.prototype;

    _proto.duplicateChild = function duplicateChild(child, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      // Are we duplicating from a parent?
      if (this.children().length === 0 || this.children().length > 0 && (0, _resizing2.getColumnsWidth)(this) < 100) {
        return _Block.prototype.duplicateChild.call(this, child, autoAppend);
      }

      var duplicate; // Attempt to split the current column into parts

      var splitTimes = Math.round((0, _resizing2.getColumnWidth)(child) / (0, _resizing2.getSmallestColumnWidth)());

      if (splitTimes > 1) {
        duplicate = _Block.prototype.duplicateChild.call(this, child, autoAppend);
        var originalWidth = 0;
        var duplicateWidth = 0;

        for (var i = 0; i <= splitTimes; i++) {
          if (splitTimes > 0) {
            originalWidth += (0, _resizing2.getSmallestColumnWidth)();
            --splitTimes;
          }

          if (splitTimes > 0) {
            duplicateWidth += (0, _resizing2.getSmallestColumnWidth)();
            --splitTimes;
          }
        }

        (0, _resizing.updateColumnWidth)(child, (0, _resizing2.getAcceptedColumnWidth)(originalWidth.toString()));
        (0, _resizing.updateColumnWidth)(duplicate, (0, _resizing2.getAcceptedColumnWidth)(duplicateWidth.toString()));
      } else {
        // Conduct an outward search on the children to locate a suitable shrinkable column
        var shrinkableColumn = (0, _resizing2.findShrinkableColumn)(child);

        if (shrinkableColumn) {
          duplicate = _Block.prototype.duplicateChild.call(this, child, autoAppend);
          (0, _resizing.updateColumnWidth)(shrinkableColumn, (0, _resizing2.getAcceptedColumnWidth)(((0, _resizing2.getColumnWidth)(shrinkableColumn) - (0, _resizing2.getSmallestColumnWidth)()).toString()));
          (0, _resizing.updateColumnWidth)(duplicate, (0, _resizing2.getSmallestColumnWidth)());
        }
      } // If we aren't able to duplicate inform the user why


      if (!duplicate) {
        this.stage.parent.alertDialog({
          content: (0, _translate)("There is no free space within the column group to perform this action."),
          title: (0, _translate)("Unable to duplicate column")
        });
      } else {
        return duplicate;
      }
    };
    /**
     * Handle a new column being dropped into the group
     *
     * @param {Event} event
     * @param {JQueryUI.DroppableEventUIParam} ui
     * @param {DropPosition} dropPosition
     */


    _proto.onNewColumnDrop = function onNewColumnDrop(event, ui, dropPosition) {
      event.preventDefault();
      event.stopImmediatePropagation(); // Create our new column

      (0, _factory.createColumn)(this, (0, _resizing2.getSmallestColumnWidth)(), dropPosition.insertIndex).then(function () {
        var newWidth = (0, _resizing2.getAcceptedColumnWidth)(((0, _resizing2.getColumnWidth)(dropPosition.affectedColumn) - (0, _resizing2.getSmallestColumnWidth)()).toString()); // Reduce the affected columns width by the smallest column width

        (0, _resizing.updateColumnWidth)(dropPosition.affectedColumn, newWidth);
      });
    };
    /**
     * Handle an existing column being dropped into a new column group
     *
     * @param {Event} event
     * @param {DropPosition} movePosition
     */


    _proto.onExistingColumnDrop = function onExistingColumnDrop(event, movePosition) {
      var column = (0, _registry.getDragColumn)();
      var modifyOldNeighbour;
      event.preventDefault();
      event.stopImmediatePropagation(); // Determine which old neighbour we should modify

      var oldWidth = (0, _resizing2.getColumnWidth)(column); // Retrieve the adjacent column either +1 or -1

      if ((0, _resizing2.getAdjacentColumn)(column, "+1")) {
        modifyOldNeighbour = (0, _resizing2.getAdjacentColumn)(column, "+1");
      } else if ((0, _resizing2.getAdjacentColumn)(column, "-1")) {
        modifyOldNeighbour = (0, _resizing2.getAdjacentColumn)(column, "-1");
      } // Set the column to it's smallest column width


      (0, _resizing.updateColumnWidth)(column, (0, _resizing2.getSmallestColumnWidth)());
      column.parent.removeChild(column);

      _eventBus.trigger("block:instanceDropped", {
        blockInstance: column,
        index: movePosition.insertIndex,
        parent: this
      }); // Modify the old neighbour


      if (modifyOldNeighbour) {
        var oldNeighbourWidth = (0, _resizing2.getAcceptedColumnWidth)((oldWidth + (0, _resizing2.getColumnWidth)(modifyOldNeighbour)).toString());
        (0, _resizing.updateColumnWidth)(modifyOldNeighbour, oldNeighbourWidth);
      } // Modify the columns new neighbour


      var newNeighbourWidth = (0, _resizing2.getAcceptedColumnWidth)(((0, _resizing2.getColumnWidth)(movePosition.affectedColumn) - (0, _resizing2.getSmallestColumnWidth)()).toString()); // Reduce the affected columns width by the smallest column width

      (0, _resizing.updateColumnWidth)(movePosition.affectedColumn, newNeighbourWidth);
    };
    /**
     * Handle a column being sorted into a new position in the group
     *
     * @param {Column} column
     * @param {number} newIndex
     */


    _proto.onColumnSort = function onColumnSort(column, newIndex) {
      var currentIndex = (0, _resizing2.getColumnIndexInGroup)(column);

      if (currentIndex !== newIndex) {
        if (currentIndex < newIndex) {
          // As we're moving an array item the keys all reduce by 1
          --newIndex;
        }

        (0, _array.moveArrayItem)(this.children, currentIndex, newIndex);
      }
    };
    /**
     * Handle a column being resized
     *
     * @param {Column} column
     * @param {number} width
     * @param {Column} adjustedColumn
     */


    _proto.onColumnResize = function onColumnResize(column, width, adjustedColumn) {
      (0, _resizing.resizeColumn)(column, width, adjustedColumn);
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

      var availableWidth = 100 - (0, _resizing2.getColumnsWidth)(this);
      var formattedAvailableWidth = (0, _resizing2.getRoundedColumnWidth)(availableWidth);
      var totalChildColumns = this.children().length;
      var allowedColumnWidths = [];
      var spreadAcross = 1;
      var spreadAmount;

      for (var i = (0, _resizing2.getMaxColumns)(); i > 0; i--) {
        allowedColumnWidths.push((0, _resizing2.getRoundedColumnWidth)(100 / 6 * i));
      } // Determine how we can spread the empty space across the columns


      for (var _i = totalChildColumns; _i > 0; _i--) {
        var potentialWidth = Math.floor(formattedAvailableWidth / _i);

        for (var _i2 = 0; _i2 < allowedColumnWidths.length; _i2++) {
          var width = allowedColumnWidths[_i2];

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

        if (params.index <= this.children().length && typeof this.children()[params.index] !== "undefined") {
          columnToModify = this.children()[params.index];
        }

        if (!columnToModify && params.index - _i3 >= 0 && typeof this.children()[params.index - _i3] !== "undefined") {
          columnToModify = this.children()[params.index - _i3];
        }

        if (columnToModify) {
          (0, _resizing.updateColumnWidth)(columnToModify, (0, _resizing2.getColumnWidth)(columnToModify) + spreadAmount);
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
