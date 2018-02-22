/*eslint-disable */
define(["knockout", "mage/backend/tabs", "./block"], function (_knockout, _tabs, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Map =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Map, _PreviewBlock);

    function Map() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.getMapUrl = _knockout.computed(function () {
        var _this$data$position$s = _this.data.position().split(","),
            lat = _this$data$position$s[0],
            lng = _this$data$position$s[1],
            zoom = _this$data$position$s[2];

        return "https://www.google.com/maps/embed/v1/place?q=" + lat + "," + lng + "&zoom=" + zoom + "&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw";
      }), _this.element = void 0, _temp) || _this;
    }

    var _proto = Map.prototype;

    /**
     * Setup fields observables within the data class property
     */
    _proto.setupDataFields = function setupDataFields() {
      _PreviewBlock.prototype.setupDataFields.call(this); // Declare our buttons, they'll get populated later


      this.updateDataValue("position", "");
    };

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
