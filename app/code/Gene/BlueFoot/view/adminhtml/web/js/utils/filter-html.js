define(["jquery"], function (_jquery) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var FilterHtml =
  /*#__PURE__*/
  function () {
    function FilterHtml() {
      this.commentNodeType = 8;
      this.whitespaceNodeType = 3;
    }

    var _proto = FilterHtml.prototype;

    /**
     * Remove comments, whitespaces and line breaks from the markup
     *
     * @param {any} element
     * @returns {any}
     */
    _proto.filter = function filter(element) {
      var isWhiteSpaceOrComment = function isWhiteSpaceOrComment() {
        return this.nodeType == this.commentNodeType
        /* || (this.nodeType == this.whitespaceNodeType && this.data.match(/^\s+$/))*/
        ;
      };

      element.find('[data-bind]').each(function (index, value) {
        (0, _jquery)(value).removeAttr('data-bind');
      });
      element.contents().filter(isWhiteSpaceOrComment).remove();
      element.find('*').each(function (index, value) {
        (0, _jquery)(value).contents().filter(isWhiteSpaceOrComment).remove();
      });
      element.find('[data-wrapper]').each(function (index, value) {
        (0, _jquery)(value).parent().append((0, _jquery)(value).children());
        (0, _jquery)(value).remove();
      });
      return element;
    };

    return FilterHtml;
  }();

  return FilterHtml;
});
//# sourceMappingURL=filter-html.js.map
