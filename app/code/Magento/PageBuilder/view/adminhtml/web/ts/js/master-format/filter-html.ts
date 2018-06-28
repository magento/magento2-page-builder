/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";

/**
 * Filter the HTML output to only include necessary attributes & nodes
 *
 * @param {JQuery} element
 * @returns {JQuery}
 */

export default function filterHtml(element: JQuery): JQuery {
    const isWhiteSpaceOrComment = function() {
        return this.nodeType === Node.COMMENT_NODE
            || (this.nodeType === Node.TEXT_NODE && this.data.match(/^\s+$/));
    };
    element.find("[data-bind]").each((index, value) => { $(value).removeAttr("data-bind"); });
    element.contents().filter(isWhiteSpaceOrComment).remove();
    element.find("*").each(
        (index, value) => {
            const isIframe = value.tagName === "IFRAME";
            const isBeingBypassedByThisFilter = !!$(value).closest('.bypass-html-filter').length;
            if (!isIframe && !isBeingBypassedByThisFilter) {
                $(value).contents().filter(isWhiteSpaceOrComment).remove();
            }
        },
    );
    element.find("[data-wrapper]").each((index, value) => {
        $(value).parent().append($(value).children());
        $(value).remove();
    });
    return element;
}
