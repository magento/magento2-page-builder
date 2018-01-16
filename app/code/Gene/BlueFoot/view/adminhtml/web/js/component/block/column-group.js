define(["./block", "knockout"], function (_block, _knockout) {
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

      _this.on('blockRemoved', _this.spreadWidth.bind(_this));

      return _this;
    }
    /**
     * Spread any empty space across the other columns
     *
     * @param event
     * @param params
     */


    var _proto = ColumnGroup.prototype;

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
      var _this2 = this;

      return this.children().map(function (column) {
        return parseFloat(_this2.stage.store.get(column.id).width);
      }).reduce(function (widthA, widthB) {
        return widthA + (widthB ? widthB : 0);
      });
    };

    return ColumnGroup;
  }(_block);

  return ColumnGroup;
});
//# sourceMappingURL=column-group.js.map
