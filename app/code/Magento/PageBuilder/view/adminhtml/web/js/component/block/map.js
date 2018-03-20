/*eslint-disable */
define(["underscore", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/block/block"], function (_underscore, _eventBus, _block) {
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

      _Block.prototype.bindEvents.call(this); // When a map is dropped for the first time open the edit panel


      _eventBus.on("map:block:dropped:create", function (event, params) {
        if (params.id === _this.id) {
          setTimeout(function () {
            _this.edit.open();
          }, 300);
        }
      });
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
