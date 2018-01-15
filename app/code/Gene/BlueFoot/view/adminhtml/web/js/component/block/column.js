define(["./block", "./factory", "jquery", "underscore"], function (_block, _factory, _jquery, _underscore) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  // Temporary variable until we determine how we'll implement this
  var MAX_COLUMNS = 6;
  var COL_GROUP_CONFIG = {
    component: 'Gene_BlueFoot/js/component/block/column-group',
    preview_component: 'Gene_BlueFoot/js/component/block/preview/column-group',
    preview_template: 'Gene_BlueFoot/component/block/preview/column-group.html',
    render_template: 'Gene_BlueFoot/component/block/render/column-group.html',
    appearances: []
  };

  var Column =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Column, _Block);

    /**
     * Constructor
     *
     * @param {EditableArea} parent
     * @param {Stage} stage
     * @param {ConfigContentBlock} config
     * @param formData
     * @param {Appearance} appearance
     */
    function Column(parent, stage, config, formData, appearance) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData, appearance) || this;

      _this.on('blockReady', _this.blockReady.bind(_this));

      return _this;
    }
    /**
     * Once a new block has been added check to see if we're inserting a new group, or just a new column
     */


    var _proto = Column.prototype;

    _proto.blockReady = function blockReady() {
      if (this.isNewGroup()) {
        this.wrapInColumnGroup();
      }
    };
    /**
     * Create a column group and insert the added column
     */


    _proto.wrapInColumnGroup = function wrapInColumnGroup() {
      var _this2 = this;

      (0, _factory)(COL_GROUP_CONFIG, this.parent, this.stage).then(function (colGroup) {
        _this2.parent.addChild(colGroup); // For speed on this prototype just create new columns


        _this2.parent.removeChild(_this2); // Add our additional second column


        (0, _factory)(_this2.config, parent, _this2.stage, {
          width: '50%'
        }).then(function (column) {
          colGroup.addChild(column);
        });
        (0, _factory)(_this2.config, parent, _this2.stage, {
          width: '50%'
        }).then(function (column) {
          colGroup.addChild(column);
        });
      });
    };
    /**
     * Is the column being added going to become a new group?
     *
     * @returns {boolean}
     */


    _proto.isNewGroup = function isNewGroup() {
      var parentChildren = this.parent.getChildren(),
          currentIndex = parentChildren().indexOf(this); // Are there items either side of the column?

      if (typeof parentChildren()[currentIndex - 1] !== 'undefined') {
        return !(parentChildren()[currentIndex - 1] instanceof Column);
      }

      if (typeof parentChildren()[currentIndex + 1] !== 'undefined') {
        return !(parentChildren()[currentIndex + 1] instanceof Column);
      }

      return true;
    };
    /**
     * Resize the current column
     *
     * @param currentNewWidth
     */


    _proto.resizeColumns = function resizeColumns(currentNewWidth) {
      var current = this.stage.store.get(this.id).width,
          difference = (parseFloat(currentNewWidth) - parseFloat(current)).toFixed(8);
      this.stage.store.updateKey(this.id, currentNewWidth, 'width');

      if (difference) {
        var parentChildren = this.parent.getChildren(),
            currentIndex = parentChildren().indexOf(this);

        if (typeof this.parent.children()[currentIndex + 1] !== 'undefined') {
          var adjacentId = this.parent.children()[currentIndex + 1].id,
              _current = this.stage.store.get(adjacentId).width;
          this.stage.store.updateKey(adjacentId, parseFloat(_current) - difference + '%', 'width');
        }
      }
    };
    /**
     * Init the resize handle and the resize functionality
     *
     * @param handle
     */


    _proto.initResizeHandle = function initResizeHandle(handle) {
      var _this3 = this;

      var group = (0, _jquery)(handle).parents('.bluefoot-column-group'),
          ghost = group.find('.resize-ghost'),
          column = (0, _jquery)(handle).parents('.bluefoot-column'),
          columnLeft = column.offset().left,
          isMouseDown = false,
          widths,
          initialPos,
          currentPos,
          currentCol;
      (0, _jquery)(handle).mousedown(function (e) {
        e.preventDefault();

        _this3.parent.resizing(true);

        widths = _this3.determineColumnWidths(column, group);
        initialPos = e.pageX;
        isMouseDown = true;
      });
      group.mousemove(function (e) {
        if (isMouseDown) {
          e.preventDefault();
          currentPos = e.pageX; // Update the ghosts width and position to give a visual indication of the dragging

          var ghostWidth = currentPos - columnLeft;

          if (ghostWidth <= group.width() / MAX_COLUMNS) {
            ghostWidth = group.width() / MAX_COLUMNS;
          }

          if (ghostWidth >= group.width() - column.position().left) {
            ghostWidth = group.width() - column.position().left;
          }

          ghost.width(ghostWidth + 'px').css('left', column.position().left + 'px');
          currentCol = _underscore.find(widths, function (val) {
            if (currentPos > val.position - 15 && currentPos < val.position + 15) {
              return val;
            }
          });

          if (currentCol) {
            _this3.resizeColumns(currentCol.width);
          }
        }
      }).mouseup(function () {
        _this3.parent.resizing(false);

        isMouseDown = false;
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
      var columnWidth = group.width() / MAX_COLUMNS,
          groupLeftPos = column.offset().left;
      var columnWidths = [],
          columnLeftPos;

      for (var i = MAX_COLUMNS; i > 0; i--) {
        columnWidths.push({
          position: Math.round(groupLeftPos + columnWidth * i),
          name: i + '/' + MAX_COLUMNS,
          width: (100 / 6 * i).toFixed(Math.round(100 / 6 * i) !== 100 / 6 * i ? 8 : 0) + '%'
        });
      }

      return columnWidths;
    };

    return Column;
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
