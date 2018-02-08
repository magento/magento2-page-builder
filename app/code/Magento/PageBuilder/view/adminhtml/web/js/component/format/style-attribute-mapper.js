/*eslint-disable */
define(["underscore", "../../component/config", "../../utils/directives"], function (_underscore, _config, _directives) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var StyleAttributeMapper =
  /*#__PURE__*/
  function () {
    function StyleAttributeMapper() {}

    var _proto = StyleAttributeMapper.prototype;

    /**
     * Map style attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {StyleAttributeMapperResult}
     */
    _proto.toDom = function toDom(data) {
      var _this = this;

      var result = {};
      data = _underscore.extend({}, data); // Handle the border being set to none and default

      if (typeof data.border !== "undefined") {
        if (data.border === "none") {
          data.border_color = "";
          data.border_width = "";
          data.border_radius = "";
        }
      }

      Object.keys(data).map(function (key) {
        var value = data[key];
        /**
         * If a field is set to _default then don't append it to the stylesheet. This is used when you need an
         * empty value but can't as the field has a default value
         */

        if (value === "" || value === "_default") {
          return;
        }

        if (key === "color" && (value === "default" || value === "Default")) {
          value = "inherit";
        }

        if (key === "min_height" || key === "border_width" || key === "border_radius") {
          value = value.replace("px", "") + "px";
        }

        if (key === "background_repeat") {
          value = value === "1" ? "repeat" : "no-repeat";
        }

        if (key === "background_repeat-x" || key === "background_repeat-y") {
          value = "";
        }

        if (key === "background_image" && Array.isArray(value) && value[0] !== undefined) {
          // convert to media directive
          var imageUrl = value[0].url;

          var mediaUrl = _config.getInitConfig("media_url");

          var mediaPath = imageUrl.split(mediaUrl);
          var directive = "{{media url=" + mediaPath[1] + "}}";
          value = "url(\'" + (0, _directives.toDataUrl)(directive) + "\')";
        }

        if (key === "margins_and_padding") {
          // The default value is set as a string
          if (_underscore.isString(value)) {
            value = JSON.parse(value);
          }

          result.marginTop = value.margin.top ? value.margin.top + "px" : null;
          result.marginRight = value.margin.right ? value.margin.right + "px" : null;
          result.marginBottom = value.margin.bottom ? value.margin.bottom + "px" : null;
          result.marginLeft = value.margin.left ? value.margin.left + "px" : null;
          result.paddingTop = value.padding.top ? value.padding.top + "px" : null;
          result.paddingRight = value.padding.right ? value.padding.right + "px" : null;
          result.paddingBottom = value.padding.bottom ? value.padding.bottom + "px" : null;
          result.paddingLeft = value.padding.left ? value.padding.left + "px" : null;
          return;
        }

        result[_this.fromSnakeToCamelCase(key)] = value;
      });
      return result;
    };
    /**
     * Map DOM key names and values to internal format
     *
     * @param {DataObject} data
     * @returns {StyleAttributeMapperResult}
     */


    _proto.fromDom = function fromDom(data) {
      var _this2 = this;

      var result = {};
      data = _underscore.extend({}, data); // Set the initial state of margins & paddings and allow the reader below to populate it as desired

      result.margins_and_padding = {
        margin: {
          bottom: "",
          left: "",
          right: "",
          top: ""
        },
        padding: {
          bottom: "",
          left: "",
          right: "",
          top: ""
        }
      };
      Object.keys(data).map(function (key) {
        var value = data[key];

        if (value === "") {
          return;
        } // The border values will be translated through as their top, left etc. so map them to the border-width


        if (key === "border-top-width" && value !== "initial") {
          key = "border-width";
        }

        if (key === "border-top-style") {
          key = "border";
        }

        if (key === "border-top-left-radius") {
          key = "border-radius";
        }

        if (key === "min-height" || key === "border-width" || key === "border-radius") {
          value = value.replace("px", "");
        }

        if (key === "background-repeat-y") {
          key = "background-repeat";
          value = value === "repeat" ? "1" : "0";
        }

        if (key === "background-position-y") {
          key = "background-position";

          if (value === "top") {
            value = "left top";
          } else if (value === "bottom") {
            value = "left bottom";
          } else {
            value = "center center";
          }
        }

        if (key === "border-top-color") {
          key = "border-color";
        }

        if (key === "background-color" || key === "border-color") {
          if (value === "initial") {
            value = "";
          } else {
            value = _this2.convertRgbToHex(value);
          }
        }

        if (key === "color") {
          if (value === "inherit") {
            value = "Default";
          } else {
            value = _this2.convertRgbToHex(value);
          }
        }

        if (key === "background-image") {
          // Replace the location.href if it exists and decode the value
          value = decodeURIComponent(value.replace(window.location.href, ""));

          var _$exec = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(value),
              url = _$exec[1],
              type = _$exec[2];

          var image = {
            name: url.split("/").pop(),
            size: 0,
            type: "image/" + type,
            url: _config.getInitConfig("media_url") + url
          };
          value = [image];
        }

        if (key.startsWith("margin") || key.startsWith("padding")) {
          var _$extend;

          var _key$split = key.split("-"),
              attributeType = _key$split[0],
              attributeDirection = _key$split[1];

          result.margins_and_padding[attributeType] = _underscore.extend(result.margins_and_padding[attributeType], (_$extend = {}, _$extend[attributeDirection] = value.replace("px", ""), _$extend));
          return;
        }

        result[key.replace("-", "_")] = value;
      });
      return result;
    };
    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */


    _proto.fromSnakeToCamelCase = function fromSnakeToCamelCase(currentString) {
      var parts = currentString.split(/[_-]/);
      var newString = "";

      for (var i = 1; i < parts.length; i++) {
        newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      }

      return parts[0] + newString;
    };
    /**
     * Convert from int to hex
     *
     * @param {number} value
     * @returns {string}
     */


    _proto.fromIntToHex = function fromIntToHex(value) {
      var hex = value.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    /**
     * Convert from string to hex
     *
     * @param {string} value
     * @returns {string}
     */


    _proto.convertRgbToHex = function convertRgbToHex(value) {
      if (value) {
        var regexp = /(\d{0,3}),\s(\d{0,3}),\s(\d{0,3})/;
        var matches = regexp.exec(value);

        if (matches) {
          return "#" + this.fromIntToHex(parseInt(matches[1], 10)) + this.fromIntToHex(parseInt(matches[2], 10)) + this.fromIntToHex(parseInt(matches[3], 10));
        }
      }

      return value;
    };

    return StyleAttributeMapper;
  }();

  return StyleAttributeMapper;
});
//# sourceMappingURL=style-attribute-mapper.js.map
