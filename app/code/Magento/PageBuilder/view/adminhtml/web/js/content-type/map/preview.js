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
      var markers = typeof this.data.main.attributes()["data-markers"] === "string" ? JSON.parse(this.data.main.attributes()["data-markers"]) : this.data.main.attributes()["data-markers"];
      var options = {
        zoom: 8,
        disableDefaultUI: false
      };

      if (markers && markers !== "" && markers.length && Object.keys(markers[0]).length) {
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
      var markers = this.data.main.attributes()["data-markers"];

      if (typeof markers === "string" && markers !== "") {
        markers = JSON.parse(this.data.main.attributes()["data-markers"]);
      }

      if (markers.length) {
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
      var markers = typeof attributes["data-markers"] === "string" ? JSON.parse(attributes["data-markers"]) : attributes["data-markers"];
      var zoom = attributes["data-zoom"];
      var location = attributes["data-location-name"];
      var address = attributes["data-address"];
      var city = attributes["data-city"];
      var comment = attributes["data-comment"];
      var controls = attributes['data-show-controls'];
      var country = attributes["data-country"];
      var zip = attributes["data-zip"];

      if (typeof zoom !== "number") {
        zoom = parseInt(zoom, 10);
      }

      return {
        markers: [{
          coordinates: {
            lat: parseFloat(markers[0].lat),
            lng: parseFloat(markers[0].lng)
          },
          location: location,
          address: address,
          city: city,
          comment: comment,
          country: country,
          zip: zip
        }],
        options: {
          zoom: zoom,
          center: {
            lat: parseFloat(markers[0].lat),
            lng: parseFloat(markers[0].lng)
          },
          disableDefaultUI: controls !== 'false'
        }
      };
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
