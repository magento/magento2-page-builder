define(["./block", "./factory"], function (_block, _factory) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

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
        // Ensure the column is 50% width
        this.stage.store.updateKey(this.id, '50%', 'width');
        this.appendNewColumn();
      }
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
     * Append a new column directly after the current one
     */


    _proto.appendNewColumn = function appendNewColumn() {
      var _this2 = this;

      var parentChildren = this.parent.getChildren(),
          currentIndex = parentChildren().indexOf(this);
      (0, _factory)(this.config, this.parent, this.stage, {
        width: '50%'
      }).then(function (block) {
        _this2.parent.addChild(block, currentIndex + 1);
      });
    };

    return Column;
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
