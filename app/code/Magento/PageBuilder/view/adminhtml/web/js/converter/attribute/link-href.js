/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/object"], function (_underscore, _object) {
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
    "use strict";

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
      return value;
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var link = (0, _object.get)(data, name);
      var href = "";

      if (!link) {
        return href;
      }

      var linkType = link.type;
      var isHrefId = !isNaN(parseInt(link[linkType], 10));

      if (isHrefId && link) {
        href = this.convertToWidget(link[linkType], linkType);
      } else if (typeof link[linkType] === "string") {
        href = link[linkType];
      }

      return href;
    }
    /**
     * @param {string} href
     * @param {string} linkType
     * @returns {string}
     */
    ;

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

  return CreateValueForHref;
});
//# sourceMappingURL=link-href.js.map