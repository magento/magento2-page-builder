/*eslint-disable */
define(["mage/backend/tabs", "./block", "Magento_PageBuilder/js/component/map"], function (_tabs, _block, _map) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Map =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Map, _PreviewBlock);

    function Map() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Map.prototype;

    /**
     * Renders the map and subscribe to position for updates
     *
     * @param {Element} element
     * @returns {void}
     */
    _proto.renderMap = function renderMap(element) {
      var preview = this.preview;
      preview.generateMap(element);
      preview.data.position.subscribe(function () {
        preview.updateMap();
      });
    };

    /**
     * Generate maps
     *
     * @param {Element} element
     * @returns {void}
     */
    _proto.generateMap = function generateMap(element) {
      var position = this.data.position();
      var markers = [],
          centerCoord = {
        lat: 30.2672,
        lng: -97.7431
      },
          options = {
        zoom: 8
      };

      if (position !== "") {
        var pos = this.getPosition();
        markers = pos.markers;
        centerCoord = pos.latLng;
        options = {
          zoom: pos.zoom
        };
      }

      this.map = new _map(element, markers, centerCoord, options);
    };
    /**
     * Updates map
     *
     * @returns {void}
     */


    _proto.updateMap = function updateMap() {
      var pos = this.getPosition();
      this.map.onUpdate(pos.markers, pos.latLng, pos.zoom);
    };
    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */


    _proto.getPosition = function getPosition() {
      var positions = this.data.position().split(",");
      return {
        markers: [{
          lat: parseFloat(positions[0]),
          lng: parseFloat(positions[1])
        }],
        latLng: {
          lat: parseFloat(positions[0]),
          lng: parseFloat(positions[1])
        },
        zoom: parseInt(positions[2], 10)
      };
    };

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
