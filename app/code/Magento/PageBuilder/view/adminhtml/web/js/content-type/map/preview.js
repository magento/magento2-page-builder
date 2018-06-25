/*eslint-disable */
define(["Magento_PageBuilder/js/utils/map", "uiEvents", "Magento_PageBuilder/js/content-type/preview"], function (_map, _uiEvents, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.element = void 0, _this.mapElement = void 0, _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When the map api key fails, empties out the content type and adds the placeholder


      _uiEvents.on("googleMaps:authFailure", function () {
        if (_this2.element) {
          _this2.mapElement.usePlaceholder(_this2.element);
        }
      }); // When a map is dropped for the first time open the edit panel


      _uiEvents.on("map:contentType:dropped:create", function (args) {
        if (args.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.edit.open();
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
      var _this3 = this;

      this.generateMap(element);
      this.element = element;

      if (this.mapElement.map) {
        this.data.main.attributes.subscribe(function () {
          _this3.updateMap();
        });
      }
    };
    /**
     * Generate maps
     *
     * @param {Element} element
     * @returns {void}
     */


    _proto.generateMap = function generateMap(element) {
      var currentLocations = this.data.main.attributes()["data-locations"] || "[]";
      var controls = this.data.main.attributes()["data-show-controls"] || "true";
      var locations = [];
      var options = {
        disableDefaultUI: controls !== "true",
        mapTypeControl: controls === "true"
      };

      if (currentLocations !== "[]") {
        var mapData = this.getMapData();
        locations = mapData.locations;
        options = mapData.options;
      }

      this.mapElement = new _map(element, locations, options);
    };
    /**
     * Updates map
     *
     * @returns {void}
     */


    _proto.updateMap = function updateMap() {
      var mapData = this.getMapData();
      this.mapElement.onUpdate(mapData.locations, mapData.options);
    };
    /**
     * Get locations, center coordinates, and zoom from data.position
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
      var locations = attributes["data-locations"];

      if (locations !== "" && typeof locations === "string") {
        locations = JSON.parse(locations);
      }

      locations.forEach(function (location) {
        location.position.latitude = parseFloat(location.position.latitude);
        location.position.longitude = parseFloat(location.position.longitude);
      });
      return {
        locations: locations,
        options: options
      };
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
