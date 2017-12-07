/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from 'jquery';

/**
 * Filter the HTML output to only include necessary attributes & nodes
 *
 * @param {JQuery} element
 * @returns {JQuery}
 */
export default function filterHtml(element: JQuery): JQuery {
    const isWhiteSpaceOrComment = function() {
        return this.nodeType == Node.COMMENT_NODE
            || (this.nodeType == Node.TEXT_NODE && this.data.match(/^\s+$/));
    };
    element.find('[data-bind]').each(function (index, value) { $(value).removeAttr('data-bind') });
    element.contents().filter(isWhiteSpaceOrComment).remove();
    element.find('*').each(
        function (index, value) {
            if (value.tagName !== 'IFRAME') {
                $(value).contents().filter(isWhiteSpaceOrComment).remove();
            }
        }
    );
    element.find('[data-wrapper]').each((index, value) => {
        $(value).parent().append($(value).children());
        $(value).remove();
    });
    return element;
}
