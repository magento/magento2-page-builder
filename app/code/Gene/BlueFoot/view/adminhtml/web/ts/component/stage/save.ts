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
    const temp = $('<div>');
    return new Promise((resolve, reject) => {
        engine.waitForFinishRender().then(() => {
            temp.find('[data-bind]').each((index, value) => { $(value).removeAttr('data-bind') });
            temp.contents().filter(function() { return this.nodeType == commentNodeType; }).remove();
            temp.find('*').each(
                (index, value) => {
                    $(value).contents().filter(function () { return this.nodeType == commentNodeType; }).remove();
                }
            );
            // Strip all is wrapper elements
            temp.find('[data-wrapper]').each(function(index, element) {
                $(element).parent().append($(element).children());
                $(element).remove();
            });
            let content = temp.html();
            content = content.replace(/\r?\n|\r/g, '');
            console.log(content)
            resolve(content);
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