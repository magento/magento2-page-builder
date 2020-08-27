/*eslint-disable */
/* jscs:disable */
define(["jquery"], function (_jquery) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Checks if PageBuilder has header and returns it's height
   *
   * @param {string} stageId
   * @param {string} stageWrapper
   * @param {string} pageBuilderHeader
   * @returns {number}
   */
  function pageBuilderHeaderHeight(stageId, stageWrapper, pageBuilderHeader) {
    if (stageWrapper === void 0) {
      stageWrapper = ".pagebuilder-stage-wrapper";
    }

    if (pageBuilderHeader === void 0) {
      pageBuilderHeader = ".pagebuilder-header";
    }

    var $stageWrapper = (0, _jquery)("#" + stageId).closest(stageWrapper);
    var $pageBuilderHeader = $stageWrapper.find(pageBuilderHeader);
    return !!$pageBuilderHeader.length ? $pageBuilderHeader.height() : 0;
  }

  return pageBuilderHeaderHeight;
});
//# sourceMappingURL=pagebuilder-header-height.js.map