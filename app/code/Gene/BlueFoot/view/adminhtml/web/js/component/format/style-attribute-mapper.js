define(["../../component/config", "../../utils/directives"], function (_config, _directives) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
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

        if (value === '') {
          return;
        }

        if (key === 'min_height' || key === 'border_width') {
          value = value.replace('px', '') + 'px';
        }

        if (key === 'background_repeat') {
          value = value === "1" ? 'repeat' : 'no-repeat';
        }

        if (key === 'background_repeat-x' || key === 'background_repeat-y') {
          value = '';
        }

        if (key === 'background_image' && Array.isArray(value) && value[0] != undefined) {
          // convert to media directive
          var imageUrl = value[0]['url'],
              mediaUrl = _config.getInitConfig('media_url'),
              mediaPath = imageUrl.split(mediaUrl),
              directive = '{{media url=' + mediaPath[1] + '}}';

          value = 'url(\'' + (0, _directives.toDataUrl)(directive) + '\')';
        }

        if (key === 'margins_and_padding') {
          result['margin'] = value.margin.top + "px " + value.margin.right + "px" + (" " + value.margin.bottom + "px " + value.margin.left + "px");
          result['padding'] = value.padding.top + "px " + value.padding.right + "px" + (" " + value.padding.bottom + "px " + value.padding.left + "px");
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

        if (key === 'border-top-width') {
          key = 'border-width';
        }

        if (key === 'min-height' || key === 'border-width') {
          value = value.replace('px', '');
        }

        if (key === 'background-repeat-y') {
          key = 'background-repeat';
          value = value === 'repeat' ? '1' : '0';
        }

        if (key === 'background-position-y') {
          key = 'background-position';

          if (value === 'top') {
            value = 'left top';
          } else if (value === 'bottom') {
            value = 'left bottom';
          } else {
            value = 'center center';
          }
        }

        if (key === 'border-top-color') {
          key = 'border-color';
        }

        if (key === 'background-color' || key === 'border-color') {
          var regexp = /(\d{0,3}),\s(\d{0,3}),\s(\d{0,3})/;
          var matches = regexp.exec(value);
          value = '#' + _this2.fromIntToHex(parseInt(matches[1])) + _this2.fromIntToHex(parseInt(matches[2])) + _this2.fromIntToHex(parseInt(matches[3]));
        }

        if (key === 'background-image') {
          // Replace the location.href if it exists and decode the value
          value = decodeURIComponent(value.replace(window.location.href, ''));

          var _$exec = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(value),
              url = _$exec[1],
              type = _$exec[2],
              image = {
            "name": url.split('/').pop(),
            "size": 0,
            "type": "image/" + type,
            "url": _config.getInitConfig('media_url') + url
          };

          value = [image];
        }

        if (key.startsWith('margin') || key.startsWith('padding')) {
          var _$extend;

          var spacingObj = {
            margin: {},
            padding: {}
          };

          var _key$split = key.split('-'),
              attributeType = _key$split[0],
              attributeDirection = _key$split[1];

          result['margins_and_padding'] = result['margins_and_padding'] || spacingObj;
          result['margins_and_padding'][attributeType] = _.extend(result['margins_and_padding'][attributeType], (_$extend = {}, _$extend[attributeDirection] = value.replace('px', ''), _$extend));
          return;
        }

        result[key.replace('-', '_')] = value;
      });
      return result;
    };
    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */


    _proto.fromSnakeToCamelCase = function fromSnakeToCamelCase(string) {
      var parts = string.split(/[_-]/);
      var newString = '';

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
      return hex.length == 1 ? '0' + hex : hex;
    };

    return StyleAttributeMapper;
  }();

  return StyleAttributeMapper;
});
//# sourceMappingURL=style-attribute-mapper.js.map
