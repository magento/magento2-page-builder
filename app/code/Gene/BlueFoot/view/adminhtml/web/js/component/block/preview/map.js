define(["./block", "knockout", "mage/backend/tabs"], function (_block, _knockout, _tabs) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /*eslint-disable */
  var Map =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Map, _Block);

    function Map(parent, config) {
      var _this;

      _this = _Block.call(this, parent, config) || this; // Declare position as it uses a container

      _this.element = void 0;
      _this.getMapUrl = void 0;
      _this.data.position = _knockout.observable(''); // We need to compute the maps URL from the position

      _this.getMapUrl = _knockout.computed(function () {
        var _this$data$position$s = _this.data.position().split(','),
            lat = _this$data$position$s[0],
            lng = _this$data$position$s[1],
            zoom = _this$data$position$s[2];

        return 'https://www.google.com/maps/embed/v1/place?q=' + lat + ',' + lng + '&zoom=' + zoom + '&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw';
      });
      return _this;
    }

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
