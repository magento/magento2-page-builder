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
        var url = "https://www.google.com/maps/embed/v1/";
        var lat = 30.2672;
        var lng = -97.7431;
        var zoom = 8;

        var position = _this.data.position();

        if (!position) {
          url += "view?center=";
        } else {
          var _position$split = position.split(",");

          lat = _position$split[0];
          lng = _position$split[1];
          zoom = _position$split[2];
          url += "place?q=";
        }

        return url + lat + "," + lng + "&zoom=" + zoom + "&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw";
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
