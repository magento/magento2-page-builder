/*eslint-disable */
define(["Magento_PageBuilder/js/utils/map", "uiEvents", "Magento_PageBuilder/js/content-type/preview"], function (_map, _uiEvents, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      return _BasePreview.apply(this, arguments) || this;
    }

    var _proto = Preview.prototype;

    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _BasePreview.prototype.bindEvents.call(this); // When a map is dropped for the first time open the edit panel


      _uiEvents.on("map:block:dropped:create", function (args) {
        if (args.id === _this.parent.id) {
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
      var locations = this.data.main.attributes()["data-location-listing"] || "[]";
      var controls = this.data.main.attributes()["data-show-controls"] || "true";
      var markers = [];
      var options = {
        disableDefaultUI: controls !== "true",
        mapTypeControl: controls === "true"
      };

      if (locations !== "[]") {
        var mapData = this.getMapData();
        markers = mapData.markers;
        options = mapData.options;
      }

      this.map = new _map(element, markers, options);
    };
    /**
     * Updates map
     *
     * @returns {void}
     */


    _proto.updateMap = function updateMap() {
      var mapData = this.getMapData();
      this.map.onUpdate(mapData.markers, mapData.options);
    };
    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */


    _proto.getMapData = function getMapData() {
      var attributes = this.data.main.attributes();
      var controls = attributes["data-show-controls"];
      var options = {
        disableDefaultUI: controls !== "true",
        mapTypeControl: controls === "true"
      };
      var markers = attributes["data-location-listing"];

      if (markers !== "" && typeof markers === "string") {
        markers = JSON.parse(markers);
      }

      markers.forEach(function (marker) {
        marker.position.lat = parseFloat(marker.position.lat);
        marker.position.lng = parseFloat(marker.position.lng);
      });

      if (markers[0]) {
        options.center = {
          lat: markers[0].position.lat,
          lng: markers[0].position.lng
        };
      }

      return {
        markers: markers,
        options: options
      };
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
