/*eslint-disable */
/* jscs:disable */
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
    var isWhiteSpaceOrComment = function isWhiteSpaceOrComment() {
      return this.nodeType === Node.COMMENT_NODE || this.nodeType === Node.TEXT_NODE && this.data.match(/^\s+$/);
    };

    element.find("[data-bind]").each(function (index, value) {
      (0, _jquery)(value).removeAttr("data-bind");
    });
    element.contents().filter(isWhiteSpaceOrComment).remove();
    element.find("*").filter(function (index, descendentEl) {
      // filter out elements that are iframes or have .bypass-html-filter ancestor
      var isIframe = descendentEl.tagName === "IFRAME";
      var isBeingBypassedByThisFilter = !!(0, _jquery)(descendentEl).closest(".bypass-html-filter").length;
      return !isIframe && !isBeingBypassedByThisFilter;
    }).each(function (index, descendentEl) {
      (0, _jquery)(descendentEl).contents().filter(isWhiteSpaceOrComment).remove();
    });
    element.find("[data-wrapper]").each(function (index, value) {
      (0, _jquery)(value).parent().append((0, _jquery)(value).children());
      (0, _jquery)(value).remove();
    });
    element.find(".bypass-html-filter").each(function (index, value) {
      (0, _jquery)(value).removeClass("bypass-html-filter").filter('[class=""]').removeAttr("class");
    });
    return element;
  }

  return filterHtml;
});
//# sourceMappingURL=filter-html.js.map