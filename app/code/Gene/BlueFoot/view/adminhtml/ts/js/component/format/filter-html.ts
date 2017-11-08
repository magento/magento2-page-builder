/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from 'jquery';

export default class FilterHtml {
    /**
     * Remove comments, whitespaces and line breaks from the markup
     *
     * @param {any} element
     * @returns {any}
     */
    filter(element: any): any {
        const isWhiteSpaceOrComment = function() {
            return this.nodeType == Node.COMMENT_NODE
                || (this.nodeType == Node.TEXT_NODE && this.data.match(/^\s+$/));
        };
        element.find('[data-bind]').each(function (index, value) { $(value).removeAttr('data-bind') });
        element.contents().filter(isWhiteSpaceOrComment).remove();
        element.find('*').each(
            function (index, value) {
                $(value).contents().filter(isWhiteSpaceOrComment).remove();
            }
        );
        element.find('[data-wrapper]').each((index, value) => {
            $(value).parent().append($(value).children());
            $(value).remove();
        });
        return element;
    }
}
