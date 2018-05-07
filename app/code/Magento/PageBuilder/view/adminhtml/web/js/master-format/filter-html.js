/*eslint-disable */
define(["jquery"], function (_jquery) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Filter the HTML output to only include necessary attributes & nodes
   *
   * @param {JQuery} element
   * @returns {JQuery}
   */
  function filterHtml(element) {
    var _this = this;

    var isWhiteSpaceOrComment = function isWhiteSpaceOrComment() {
      return _this.nodeType === Node.COMMENT_NODE || _this.nodeType === Node.TEXT_NODE && _this.data.match(/^\s+$/);
    };

    element.find("[data-bind]").each(function (index, value) {
      (0, _jquery)(value).removeAttr("data-bind");
    });
    element.contents().filter(isWhiteSpaceOrComment).remove();
    element.find("*").each(function (index, value) {
      if (value.tagName !== "IFRAME") {
        (0, _jquery)(value).contents().filter(isWhiteSpaceOrComment).remove();
      }
    });
    element.find("[data-wrapper]").each(function (index, value) {
      (0, _jquery)(value).parent().append((0, _jquery)(value).children());
      (0, _jquery)(value).remove();
    });
    return element;
  }

  return filterHtml;
});
//# sourceMappingURL=filter-html.js.map
