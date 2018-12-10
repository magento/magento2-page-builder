/*eslint-disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/utils/map", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type/preview"], function (_events, _map, _hideShowOption, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      return _preview2.apply(this, arguments) || this;
    }

    var _proto = Preview.prototype;

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _preview2.prototype.retrieveOptions.call(this);

      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    };
    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */


    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _preview2.prototype.bindEvents.call(this); // When the map api key fails, empties out the content type and adds the placeholder


      _events.on("googleMaps:authFailure", function () {
        if (_this.element) {
          _this.mapElement.usePlaceholder(_this.element);
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
      this.element = element;

      if (this.mapElement.map) {
        this.data.main.attributes.subscribe(function () {
          _this2.updateMap();
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
