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
    element.find("*").filter((index, descendentEl) => {
        // filter out elements that are iframes or have .bypass-html-filter ancestor
        const isIframe = descendentEl.tagName === "IFRAME";
        const isBeingBypassedByThisFilter = !!$(descendentEl).closest(".bypass-html-filter").length;
        return !isIframe && !isBeingBypassedByThisFilter;
    }).each(
        (index, descendentEl) => {
            $(descendentEl).contents().filter(isWhiteSpaceOrComment).remove();
        },
    );
    element.find("[data-wrapper]").each((index, value) => {
        $(value).parent().append($(value).children());
        $(value).remove();
    });
    element.find(".bypass-html-filter").each((index, value) => {
        $(value).removeClass("bypass-html-filter").filter('[class=""]').removeAttr("class");
    });
    return element;
}
