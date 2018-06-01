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


      _uiEvents.on("map:contentType:dropped:create", function (args) {
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
      var position = this.data.main.attributes()["data-position"] || "{}";
      var controls = this.data.main.attributes()["data-show-controls"] || "true";
      var marker = {};
      var options = {
        disableDefaultUI: controls !== "true",
        mapTypeControl: controls === "true"
      };

      if (position !== "{}") {
        var mapData = this.getMapData();
        marker = mapData.marker;
        options = mapData.options;
      }

      this.map = new _map(element, marker, options);
    };
    /**
     * Updates map
     *
     * @returns {void}
     */


    _proto.updateMap = function updateMap() {
      if (this.data.main.attributes()["data-position"] !== "{}") {
        var mapData = this.getMapData();
        this.map.onUpdate(mapData.marker, mapData.options);
      }
    };
    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */


    _proto.getMapData = function getMapData() {
      var attributes = this.data.main.attributes();
      var location = attributes["data-location-name"];
      var position = attributes["data-position"];
      var address = attributes["data-address"];
      var city = attributes["data-city"];
      var comment = attributes["data-comment"];
      var controls = attributes["data-show-controls"];
      var country = attributes["data-country"];
      var zipcode = attributes["data-zipcode"];

      if (position !== "" && typeof position === "string") {
        position = JSON.parse(position);
      }

      return {
        marker: {
          coordinates: {
            lat: parseFloat(position.lat),
            lng: parseFloat(position.lng)
          },
          location: location,
          address: address,
          city: city,
          comment: comment,
          country: country,
          zipcode: zipcode
        },
        options: {
          center: {
            lat: parseFloat(position.lat),
            lng: parseFloat(position.lng)
          },
          disableDefaultUI: controls !== "true",
          mapTypeControl: controls === "true"
        }
      };
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
