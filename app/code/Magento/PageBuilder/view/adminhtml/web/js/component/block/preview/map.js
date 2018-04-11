/*eslint-disable */
define(["Magento_PageBuilder/js/utils/map", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/block/preview/block"], function (_map, _eventBus, _block) {
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
     * Open edit menu on map content type drop with a delay of 300ms
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _PreviewBlock.prototype.bindEvents.call(this); // When a map is dropped for the first time open the edit panel


      _eventBus.on("map:block:dropped:create", function (event, params) {
        if (params.id === _this.parent.id) {
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
      var markers = typeof this.data.main.attributes()["data-markers"] === "string" ? JSON.parse(this.data.main.attributes()["data-markers"]) : this.data.main.attributes()["data-markers"];
      var centerCoord = {
        lat: 30.2672,
        lng: -97.7431
      };
      var options = {
        zoom: 8
      };

      if (markers && markers !== "" && markers.length && Object.keys(markers[0]).length) {
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
      var markers = this.data.main.attributes()["data-markers"];

      if (typeof markers === "string" && markers !== "") {
        markers = JSON.parse(this.data.main.attributes()["data-markers"]);
      }

      if (markers.length) {
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
      var markers = typeof this.data.main.attributes()["data-markers"] === "string" ? JSON.parse(this.data.main.attributes()["data-markers"]) : this.data.main.attributes()["data-markers"];
      var zoom = this.data.main.attributes()["data-zoom"];

      if (typeof zoom !== "number") {
        zoom = parseInt(zoom, 10);
      }

      return {
        latLng: {
          lat: parseFloat(markers[0].lat),
          lng: parseFloat(markers[0].lng)
        },
        markers: [{
          lat: parseFloat(markers[0].lat),
          lng: parseFloat(markers[0].lng)
        }],
        zoom: zoom
      };
    };

    return Map;
  }(_block);

  return Map;
});
//# sourceMappingURL=map.js.map
