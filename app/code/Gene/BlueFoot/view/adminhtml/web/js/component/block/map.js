/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Map =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Map, _Block);

    function Map() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Map.prototype;

    _proto.getMapUrl = function getMapUrl() {
      var _getData$position$spl = this.getData().position().split(','),
          lat = _getData$position$spl[0],
          lng = _getData$position$spl[1],
          zoom = _getData$position$spl[2];

      return 'https://www.google.com/maps/embed/v1/view?center=' + lat + ',' + lng + '&zoom=' + zoom + '&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw';
    };

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
