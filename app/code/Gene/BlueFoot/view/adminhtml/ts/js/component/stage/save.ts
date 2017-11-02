/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from 'knockout';
import $ from 'jquery';
import Structural from "./structural/abstract";
import engine from "Magento_Ui/js/lib/knockout/template/engine";

/**
 * Render the tree into a string
 *
 * @param {KnockoutObservableArray<Structural>} tree
 */
export default function renderTree(tree: KnockoutObservableArray<Structural>): Promise<string> {
    const rootTemplate = 'Gene_BlueFoot/component/block/render/root.html';
    const commentNodeType = 8;
    const whitespaceNodeType = 3;
    const temp = $('<div>');
    return new Promise((resolve, reject) => {
        engine.waitForFinishRender().then(function () {
            const isWhiteSpaceOrComment = function() {
                return this.nodeType == commentNodeType/* || (this.nodeType == whitespaceNodeType && this.data.match(/^\s+$/))*/;
            };
            temp.find('[data-bind]').each(function (index, value) { $(value).removeAttr('data-bind') });
            temp.contents().filter(isWhiteSpaceOrComment).remove();
            temp.find('*').each(
                function (index, value) {
                    $(value).contents().filter(isWhiteSpaceOrComment).remove();
                }
            );
            // Strip all is wrapper elements
            temp.find('[data-wrapper]').each((index, element) => {
                $(element).parent().append($(element).children());
                $(element).remove();
            });
            resolve(temp.html());
            temp.remove();
        });
        ko.applyBindingsToNode(
            temp[0],
            {
                template: {
                    name: rootTemplate,
                    data: {getChildren: () => tree}
                }
            }
        );
    });
}
