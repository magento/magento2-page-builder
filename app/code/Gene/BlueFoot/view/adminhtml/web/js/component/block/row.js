define(["underscore", "./block"], function (_underscore, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Row, _Block);

    function Row() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Row.prototype;

    /**
     * Get stype properties for an block
     * Example {'backgroundColor': '#cccccc'}
     *
     * @returns {DataObject}
     */
    _proto.getStyle = function getStyle() {
      var children = this.children();
      var styleAttributes = {},
          isAllColumns = true;

      if (children.length !== 0) {
        for (var i = 0; i < children.length; i++) {
          if (children[i].config.name !== 'column') {
            isAllColumns = false;
          }
        }
      } else {
        isAllColumns = false;
      }

      if (isAllColumns) {
        styleAttributes['display'] = 'flex';
      }

      return _underscore.extend(_Block.prototype.getStyle.call(this), styleAttributes);
    };
    /**
     * Retrieve the preview child template
     *
     * @returns {string}
     */
    // get previewWrapperTemplate(): string {
    //     return 'Gene_BlueFoot/component/block/preview/wrapper.html';
    // }


    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
