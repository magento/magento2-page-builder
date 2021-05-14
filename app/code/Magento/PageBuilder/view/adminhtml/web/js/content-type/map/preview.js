/*eslint-disable */
/* jscs:disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/utils/map", "module", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type/preview"], function (_knockout, _events, _map, _module, _hideShowOption, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview = /*#__PURE__*/function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _preview2.call.apply(_preview2, [this].concat(args)) || this;
      _this.apiKeyValid = _knockout.observable(!!_module.config().apiKey);
      _this.apiKeyErrorMessage = _module.config().apiKeyErrorMessage;
      return _this;
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
    }
    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _preview2.prototype.bindEvents.call(this); // When the map api key fails, empties out the content type and adds the placeholder


      _events.on("googleMaps:authFailure", function () {
        _this2.apiKeyValid(false);
      });
    }
    /**
     * Renders the map and subscribe to position for updates
     *
     * @param {Element} element
     * @returns {void}
     */
    ;

    _proto.renderMap = function renderMap(element) {
      var _this3 = this;

      if (!this.apiKeyValid()) {
        return;
      }

      this.generateMap(element);
      this.element = element;

      if (this.mapElement && this.mapElement.map) {
        this.data.main.attributes.subscribe(function () {
          _this3.updateMap();
        });
      }
    }
    /**
     * Generate maps
     *
     * @param {Element} element
     * @returns {void}
     */
    ;

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
    }
    /**
     * Updates map
     *
     * @returns {void}
     */
    ;

    _proto.updateMap = function updateMap() {
      var mapData = this.getMapData();
      this.mapElement.onUpdate(mapData.locations, mapData.options);
    }
    /**
     * Get locations, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */
    ;

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