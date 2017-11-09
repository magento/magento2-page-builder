define(["jquery"], function (_jquery) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var FilterHtml =
  /*#__PURE__*/
  function () {
    function FilterHtml() {
      var _replaceStrings;

      this.replaceStrings = (_replaceStrings = {}, _replaceStrings[window.location.origin + '/'] = '', _replaceStrings[window.location.origin] = '', _replaceStrings);
    }

    var _proto = FilterHtml.prototype;

    /**
     * Remove comments, whitespaces and line breaks from the markup, return as string
     *
     * @param {JQuery} element
     * @returns {string}
     */
    _proto.filter = function filter(element) {
      var isWhiteSpaceOrComment = function isWhiteSpaceOrComment() {
        return this.nodeType == Node.COMMENT_NODE || this.nodeType == Node.TEXT_NODE && this.data.match(/^\s+$/);
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
      }); // Filter any string replacement entries

      var html = element.html();

      for (var match in this.replaceStrings) {
        html = html.replace(match, this.replaceStrings[match]);
      }

      return html;
    };

    return FilterHtml;
  }();

  return FilterHtml;
});
//# sourceMappingURL=filter-html.js.map
