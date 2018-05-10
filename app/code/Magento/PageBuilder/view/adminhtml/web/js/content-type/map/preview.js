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
      var position = this.data.main.attributes()["data-markers"];
      var markers = [];
      var options = {
        disableDefaultUI: false
      };

      if (position !== "") {
        var pos = this.getMarkers();
        markers = pos.markers;
        options = pos.options;
      }

      this.map = new _map(element, markers, options);
    };
    /**
     * Updates map
     *
     * @returns {void}
     */


    _proto.updateMap = function updateMap() {
      if (this.data.main.attributes()["data-markers"] !== "") {
        var pos = this.getMarkers();
        this.map.onUpdate(pos.markers, pos.options);
      }
    };
    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */


    _proto.getMarkers = function getMarkers() {
      var attributes = this.data.main.attributes();
      var location = attributes["data-location-name"];
      var position = attributes["data-markers"];
      var address = attributes["data-address"];
      var city = attributes["data-city"];
      var comment = attributes["data-comment"];
      var controls = attributes["data-show-controls"];
      var country = attributes["data-country"];
      var zip = attributes["data-zip"];

      if (position !== "" && typeof position === "string") {
        position = JSON.parse(position);
      }

      return {
        markers: [{
          coordinates: {
            lat: parseFloat(position[0].lat),
            lng: parseFloat(position[0].lng)
          },
          location: location,
          address: address,
          city: city,
          comment: comment,
          country: country,
          zip: zip
        }],
        options: {
          center: {
            lat: parseFloat(position[0].lat),
            lng: parseFloat(position[0].lng)
          },
          disableDefaultUI: controls !== "false"
        }
      };
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
