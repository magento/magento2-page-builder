/*eslint-disable */
define(["../event-bus", "./block", "Magento_PageBuilder/js/utils/map"], function (_eventBus, _block, _map) {
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
     * Renders the map and subscribe to position for updates
     *
     * @param {Element} element
     * @returns {void}
     */


    _proto.renderMap = function renderMap(element) {
      var _this2 = this;

      this.generateMap(element);
      this.data.main.attributes.subscribe(function () {
        _this2.updateMap();
      });
    };
    /**
     * Generate maps
     *
     * @param {Element} element
     * @returns {void}
     */


    _proto.generateMap = function generateMap(element) {
      var position = this.data.main.attributes()['data-position'];
      var markers = [];
      var centerCoord = {
        lat: 30.2672,
        lng: -97.7431
      };
      var options = {
        zoom: 8
      };

      if (position && position !== "") {
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
      if (this.data.main.attributes()['data-position']) {
        var pos = this.getPosition();
        this.map.onUpdate(pos.markers, pos.latLng, pos.zoom);
      }
    };
    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */


    _proto.getPosition = function getPosition() {
      var positions = this.data.main.attributes()['data-position'].split(",");
      return {
        latLng: {
          lat: parseFloat(positions[0]),
          lng: parseFloat(positions[1])
        },
        markers: [{
          lat: parseFloat(positions[0]),
          lng: parseFloat(positions[1])
        }],
        zoom: parseInt(positions[2], 10)
      };
    };

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
