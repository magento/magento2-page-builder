/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";

/**
 * Checks if PageBuilder has header and returns it's height
 *
 * @param {string} stageId
 * @param {string} stageWrapper
 * @param {string} pageBuilderHeader
 * @returns {number}
 */
export default function pageBuilderHeaderHeight(
    stageId: string,
    stageWrapper: string = ".pagebuilder-stage-wrapper",
    pageBuilderHeader: string = ".pagebuilder-header",
): number {
    const $stageWrapper = $("#" + stageId).closest(stageWrapper);
    const $pageBuilderHeader = $stageWrapper.find(pageBuilderHeader);
    return (!!$pageBuilderHeader.length) ? $pageBuilderHeader.height() : 0;
}
