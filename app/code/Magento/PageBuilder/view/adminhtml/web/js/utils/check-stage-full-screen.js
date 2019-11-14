/*eslint-disable */
/* jscs:disable */
define(["jquery"], function (_jquery) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Check if stage full screen mode is active
   *
   * @param {string} stageId
   * @returns {boolean}
   */
  function checkStageFullScreen(stageId) {
    var $stage = (0, _jquery)("#" + stageId);
    var $fullScreenStageWrapper = $stage.closest(".stage-full-screen");
    return !!$fullScreenStageWrapper.length;
  }

  return checkStageFullScreen;
});
//# sourceMappingURL=check-stage-full-screen.js.map