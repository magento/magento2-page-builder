define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * Column class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Column =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Column, _Block);

    function Column() {
      return _Block.apply(this, arguments) || this;
    }

    return Column;
  }(_block);

  return Column;
});