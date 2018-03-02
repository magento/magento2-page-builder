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
     * Check if current map has a marker
     *
     * @returns {boolean}
     */


    _proto.hasMarker = function hasMarker() {
      var data = this.getData();
      return data.position !== "";
    };
    /**
     * Return style for hidden if there is no marker
     *
     * @returns {object}
     */


    _proto.hiddenIfNoMarker = function hiddenIfNoMarker() {
      var result = {};

      if (!this.hasMarker()) {
        result = {
          display: "none"
        };
      }

      return result;
    };
    /**
     * Gets the map styles
     *
     * @returns {object}
     */


    _proto.getMapStyles = function getMapStyles() {
      var style = _underscore.clone(this.getStyle());

      return Object.assign(style, this.hiddenIfNoMarker());
    };

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
