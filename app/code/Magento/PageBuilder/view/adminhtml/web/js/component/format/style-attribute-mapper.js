/*eslint-disable */
define(["underscore", "../../component/config", "../../utils/directives", "../../utils/image", "../../utils/url"], function (_underscore, _config, _directives, _image, _url) {
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
     * @returns {DataObject}
     */
    _proto.toDom = function toDom(data) {
      var _this = this;

      var result = {};
      Object.keys(data).map(function (key) {
        var value = data[key];

        if (value === "") {
          return;
        }

        if (key === "color" && value === "default") {
          value = "";
        }

        if (key === "border" && value === "default") {
          value = "";
        }

        if (key === "min_height" || key === "border_width" || key === "border_radius") {
          if (typeof value === "number") {
            value = value.toString();
          }

          value = value.replace("px", "") + "px";
        }

        if (key === "background_repeat") {
          value = value === "1" ? "repeat" : "no-repeat";
        }

        if (key === "background_repeat-x" || key === "background_repeat-y") {
          value = "";
        }

        if (key === "background_image" && Array.isArray(value) && value[0] !== undefined || key === "mobile_image" && Array.isArray(value) && value[0] !== undefined) {
          // convert to media directive
          var imageUrl = value[0].url;
          var mediaUrl = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(_config.getInitConfig("media_url"), imageUrl);
          var mediaPath = imageUrl.split(mediaUrl);
          var directive = "{{media url=" + mediaPath[1] + "}}";
          value = "url(\'" + (0, _directives.toDataUrl)(directive) + "\')";
        }

        if (key === "margins_and_padding") {
          var toPxStr = function toPxStr(val) {
            return !isNaN(parseInt(val, 10)) ? val + "px" : "";
          };

          var _value = value,
              padding = _value.padding,
              margin = _value.margin;
          var paddingAndMargins = {
            marginBottom: toPxStr(margin.bottom),
            marginLeft: toPxStr(margin.left),
            marginRight: toPxStr(margin.right),
            marginTop: toPxStr(margin.top),
            paddingBottom: toPxStr(padding.bottom),
            paddingLeft: toPxStr(padding.left),
            paddingRight: toPxStr(padding.right),
            paddingTop: toPxStr(padding.top)
          };
          Object.assign(result, paddingAndMargins);
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
     * @returns {DataObject}
     */


    _proto.fromDom = function fromDom(data) {
      var _this2 = this;

      var result = {};
      Object.keys(data).map(function (key) {
        var value = data[key];

        if (value === "") {
          return;
        }

        if (key === "border-top-width") {
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
          if (value === "default" || value === "") {
            value = "";
          } else {
            value = _this2.convertRgbToHex(value);
          }
        }

        if (key === "color") {
          if (value === "") {
            value = "default";
          } else {
            value = _this2.convertRgbToHex(value);
          }
        }

        if (key === "border") {
          if (value === "") {
            value = "default";
          }
        }

        if (key === "background-image" || key === "mobile-image") {
          value = (0, _image.decodeUrl)(value);
        }

        if (key.startsWith("margin") || key.startsWith("padding")) {
          var _$extend;

          var spacingObj = {
            margin: {},
            padding: {}
          };

          var _key$split = key.split("-"),
              attributeType = _key$split[0],
              attributeDirection = _key$split[1];

          result.margins_and_padding = result.margins_and_padding || spacingObj;
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
