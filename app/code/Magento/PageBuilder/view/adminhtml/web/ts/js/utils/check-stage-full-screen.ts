/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";

/**
 * Check if stage full screen mode is active
 *
 * @param {string} stageId
 * @returns {boolean}
 */
export default function checkStageFullScreen(stageId: string): boolean {
    const $stage = $("#" + stageId);
    const $fullScreenStageWrapper = $stage.closest(".stage-full-screen");
    return !!$fullScreenStageWrapper.length;
}
