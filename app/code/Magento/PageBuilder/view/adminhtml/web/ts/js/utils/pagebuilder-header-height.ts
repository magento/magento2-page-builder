/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";

/**
 * Checks if PageBuilder has header and return it's height
 *
 * @param {string} stageId
 * @returns {number}
 */
export default function pageBuilderHeaderHeight(stageId: string): number {
    const $stageWrapper = $("#" + stageId).closest('.pagebuilder-stage-wrapper');
    const $pageBuilderHeader = $stageWrapper.find('.pagebuilder-header');
    return (!!$pageBuilderHeader.length) ? $pageBuilderHeader.height() : 0;
}
