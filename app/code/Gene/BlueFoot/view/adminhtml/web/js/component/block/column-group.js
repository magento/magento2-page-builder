define(["./block", "jquery", "knockout", "../config", "./factory"], function (_block, _jquery, _knockout, _config, _factory) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var MAX_COLUMNS = 6;

  var ColumnGroup =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ColumnGroup, _Block);

    function ColumnGroup(parent, stage, config, formData, appearance) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData, appearance) || this;
      _this.resizing = _knockout.observable(false);
      _this.dropPlaceholder = void 0;

      _this.on('blockRemoved', _this.spreadWidth.bind(_this));

      return _this;
    }
    /**
     * Init the drop placeholder
     *
     * @param element
     */


    var _proto = ColumnGroup.prototype;

    _proto.initDropPlaceholder = function initDropPlaceholder(element) {
      this.dropPlaceholder = (0, _jquery)(element);
    };
    /**
     * Init the droppable functionality for new columns
     *
     * @param element
     * @param context
     */


    _proto.initDroppable = function initDroppable(element, context) {
      var _this2 = this;

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
          // We need to improve the detection of a column being dragged
          if (currentDraggedBlock.config.name === 'column') {
            overElement = true;
            dropPositions = _this2.calculateDropPositions(element);
          }
        },
        deactivate: function deactivate() {
          overElement = false;

          _this2.dropPlaceholder.removeClass('left right');
        },
        out: function out() {
          overElement = false;

          _this2.dropPlaceholder.removeClass('left right');
        },
        drop: function drop(e) {
          if (overElement && dropPosition) {
            overElement = false;
            e.preventDefault();
            e.stopImmediatePropagation(); // Create our new column

            (0, _factory)(_config.getContentTypeConfig('column'), _this2, _this2.stage, {
              width: _this2.getSmallestColumnWidth() + '%'
            }).then(function (column) {
              var newWidth = _this2.getAcceptedColumnWidth(parseFloat(_this2.stage.store.get(dropPosition.affectedColumn.id).width) - _this2.getSmallestColumnWidth()); // Reduce the affected columns width by the smallest column width


              _this2.stage.store.updateKey(dropPosition.affectedColumn.id, newWidth + '%', 'width'); // Add our new column into the container


              _this2.addChild(column, dropPosition.insertIndex);
            });
          }

          _this2.dropPlaceholder.removeClass('left right');
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
            _this2.dropPlaceholder.removeClass('left right').css({
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
      var _this3 = this;

      var dropPositions = [];
      (0, _jquery)(element).find('>*').each(function (index, column) {
        var columnData = _knockout.dataFor(column);

        if (parseFloat(_this3.stage.store.get(columnData.id).width) > _this3.getSmallestColumnWidth()) {
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

      for (var i = MAX_COLUMNS; i > 0; i--) {
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
          var currentWidth = this.stage.store.get(columnToModify.id).width;
          this.stage.store.updateKey(columnToModify.id, parseFloat(currentWidth) + spreadAmount + '%', 'width');
        }
      }
    };
    /**
     * Retrieve the total width of all columns in the group
     *
     * @returns {any}
     */


    _proto.getColumnsWidth = function getColumnsWidth() {
      var _this4 = this;

      return this.children().map(function (column) {
        return parseFloat(_this4.stage.store.get(column.id).width);
      }).reduce(function (widthA, widthB) {
        return widthA + (widthB ? widthB : 0);
      });
    };
    /**
     * Return the smallest column (%) that we can add
     *
     * @returns {string}
     */


    _proto.getSmallestColumnWidth = function getSmallestColumnWidth() {
      return this.getAcceptedColumnWidth(parseFloat(100 / MAX_COLUMNS).toFixed(Math.round(100 / MAX_COLUMNS) !== 100 / MAX_COLUMNS ? 8 : 0));
    };
    /**
     * Return an accepted percentage for a column width
     *
     * @param width
     * @returns {number}
     */


    _proto.getAcceptedColumnWidth = function getAcceptedColumnWidth(width) {
      var newWidth = 0;

      for (var i = MAX_COLUMNS; i > 0; i--) {
        var percentage = parseFloat((100 / MAX_COLUMNS * i).toFixed(Math.round(100 / MAX_COLUMNS * i) !== 100 / MAX_COLUMNS * i ? 8 : 0)); // Allow for rounding issues

        if (width > percentage - 0.1 && width < percentage + 0.1) {
          newWidth = percentage;
          break;
        }
      }

      return newWidth;
    };

    return ColumnGroup;
  }(_block);

  return ColumnGroup;
});
//# sourceMappingURL=column-group.js.map
