/*eslint-disable */
/* jscs:disable */
define(["jquery"], function (_jquery) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Checks if PageBuilder has header and return it's height
   *
   * @param {string} stageId
   * @returns {number}
   */
  function pageBuilderHeaderHeight(stageId) {
    var $stageWrapper = (0, _jquery)("#" + stageId).closest('.pagebuilder-stage-wrapper');
    var $pageBuilderHeader = $stageWrapper.find('.pagebuilder-header');
    return !!$pageBuilderHeader.length ? $pageBuilderHeader.height() : 0;
  }

  return pageBuilderHeaderHeight;
});
//# sourceMappingURL=pagebuilder-header-height.js.map