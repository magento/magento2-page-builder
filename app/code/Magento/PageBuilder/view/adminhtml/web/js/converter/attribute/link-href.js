/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var CreateValueForHref =
  /*#__PURE__*/
  function () {
    function CreateValueForHref() {
      this.widgetParamsByLinkType = {
        category: {
          type: "Magento\\Catalog\\Block\\Category\\Widget\\Link",
          id_path: "category/:href",
          template: "Magento_PageBuilder::widget/link_href.phtml",
          type_name: "Catalog Category Link"
        },
        product: {
          type: "Magento\\Catalog\\Block\\Product\\Widget\\Link",
          id_path: "product/:href",
          template: "Magento_PageBuilder::widget/link_href.phtml",
          type_name: "Catalog Product Link"
        },
        page: {
          type: "Magento\\Cms\\Block\\Widget\\Page\\Link",
          page_id: ":href",
          template: "Magento_PageBuilder::widget/link_href.phtml",
          type_name: "CMS Page Link"
        }
      };
    }

    var _proto = CreateValueForHref.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (value === "") {
        value = "javascript:void(0)";
      }

      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      var link = data[name];

      if (typeof link === "undefined" || !link[link.type].length) {
        return "javascript:void(0)";
      }

      var href = link[link.type];
      href = this.convertToWidget(href, link.type);
      return href;
    };
    /**
     * @param {string} href
     * @param {string} linkType
     * @returns {string}
     */


    _proto.convertToWidget = function convertToWidget(href, linkType) {
      if (!href || !this.widgetParamsByLinkType[linkType]) {
        return href;
      }

      var attributesString = _underscore.map(this.widgetParamsByLinkType[linkType], function (val, key) {
        return key + "='" + val.replace(":href", href) + "'";
      }).join(" ");

      return "{{widget " + attributesString + " }}";
    };

    return CreateValueForHref;
  }();

  return _extends(CreateValueForHref, {
    __esModule: true
  });
});
//# sourceMappingURL=link-href.js.map
