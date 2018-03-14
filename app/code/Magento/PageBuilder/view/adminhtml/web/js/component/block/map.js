/*eslint-disable */
define(["underscore", "../event-bus", "./block"], function (_underscore, _eventBus, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Map =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Map, _Block);

    function Map() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Map.prototype;

    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Block.prototype.bindEvents.call(this);

      _eventBus.on("map:block:mount", function (event, params) {
        if (params.id === _this.id) {
          setTimeout(function () {
            params.block.edit.open();
          }, 300);
        }
      });
    };
    /**
     * Gets the map attributes
     *
     * @returns {object}
     */


    _proto.getAttributes = function getAttributes() {
      var data = this.getData();

      var result = _Block.prototype.getAttributes.call(this);

      if (data.position) {
        var positions = data.position.split(",");
        var marker = {
          lat: parseFloat(positions[0]),
          lng: parseFloat(positions[1])
        };
        var markers = "[" + JSON.stringify(marker) + "]";
        var markerAttributes = {
          "data-markers": markers,
          "data-zoom": positions[2]
        };
        result = _underscore.extend(_Block.prototype.getAttributes.call(this), markerAttributes);
      }

      return result;
    };
    /**
     * Gets the map styles
     *
     * @returns {object}
     */


    _proto.getStyle = function getStyle() {
      var style = _underscore.clone(_Block.prototype.getStyle.call(this));

      return this.hasMarker() ? style : Object.assign(style, {
        display: "none"
      });
    };
    /**
     * Check if current map has a marker
     *
     * @returns {boolean}
     */


    _proto.hasMarker = function hasMarker() {
      var data = this.getData();
      return data.position !== "";
    };

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
