/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from 'jquery';

export default class FilterHtml {
    commentNodeType: number = 8;
    whitespaceNodeType: number = 3;

    /**
     * Remove comments, whitespaces and line breaks from the markup
     *
     * @param {any} element
     * @returns {any}
     */
    filter(element: any): any {
        const self = this;
        const isWhiteSpace = function() {
            return this.nodeType == self.commentNodeType;
        };
        element.find('[data-bind]').each(function (index, value) { $(value).removeAttr('data-bind') });
        element.contents().filter(isWhiteSpace).remove();
        element.find('*').each(
            function (index, value) {
                $(value).contents().filter(isWhiteSpace).remove();
            }
        );
        element.find('[data-wrapper]').each((index, value) => {
            $(value).parent().append($(value).children());
            $(value).remove();
        });
        return element;
    }
}
