/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Link =
  /*#__PURE__*/
  function () {
    "use strict";

    function Link() {
      this.regexpByLinkType = {
        category: new RegExp(/id_path=['"]category\/(\d+)/),
        product: new RegExp(/id_path=['"]product\/(\d+)/),
        page: new RegExp(/page_id=['"](\d+)/)
      };
    }

    var _proto = Link.prototype;

    /**
     * Read link from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element) {
      var _ref;

      var href = element.getAttribute("href");
      var attributeLinkType = element.getAttribute("data-link-type");

      if (typeof href === "string" && attributeLinkType !== "default") {
        href = this.getIdFromWidgetSyntax(href, this.regexpByLinkType[attributeLinkType]);
      }

      return _ref = {}, _ref[attributeLinkType] = href, _ref.setting = element.getAttribute("target") === "_blank", _ref.type = attributeLinkType, _ref;
    }
    /**
     * Returns link value from widget string
     *
     * @param {string} href
     * @param {RegExp} regexp
     * @return {string}
     */
    ;

    _proto.getIdFromWidgetSyntax = function getIdFromWidgetSyntax(href, regexp) {
      var attributeIdMatches = href.match(regexp);

      if (!attributeIdMatches) {
        return href;
      }

      return attributeIdMatches[1];
    };

    return Link;
  }();

  return Link;
});
//# sourceMappingURL=link.js.map