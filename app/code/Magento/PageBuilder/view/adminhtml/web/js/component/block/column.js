/*eslint-disable */
define(["underscore", "./block"], function (_underscore, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Column =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Column, _Block);

    function Column() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Column.prototype;

    _proto.getStyle = function getStyle() {
      var data = this.getData();

      if (typeof data.appearance !== "undefined" && typeof data.appearances !== "undefined" && typeof data.appearances[data.appearance] !== "undefined") {
        var appearances = {};

        _underscore.each(data.appearances[data.appearance], function (value, key) {
          var camelKey = key.replace(/_([a-z])/g, function (g) {
            return g[1].toUpperCase();
          });
          var camelStyle = {};
          camelStyle[camelKey] = value;

          _underscore.extend(appearances, camelStyle);
        });

        return _underscore.extend(_Block.prototype.getStyle.call(this), appearances);
      }

      return _Block.prototype.getStyle.call(this);
    };

    return Column;
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
