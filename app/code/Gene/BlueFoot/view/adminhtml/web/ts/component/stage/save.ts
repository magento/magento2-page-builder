/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from 'knockout';
import $ from 'jquery';
import Structural from "./structural/abstract";
import engine from "Magento_Ui/js/lib/knockout/template/engine";

// The root template for the render tree
const rootTemplate = 'Gene_BlueFoot/component/stage/structural/render/root.html';

/**
 * Render the tree into a string
 *
 * @param {KnockoutObservableArray<Structural>} tree
 */
export default function renderTree(tree: KnockoutObservableArray<Structural>): Promise<string> {
    let temp = $('<div>');
    return new Promise((resolve, reject) => {
        engine.waitForFinishRender().then(function () {
            temp.find('[data-bind]').each(function (index, value) { $(value).removeAttr('data-bind') });
            temp.contents().filter(function() { return this.nodeType == 8; }).remove();
            temp.find('*').each(
                function (index, value) {
                    $(value).contents().filter(function() { return this.nodeType == 8; }).remove();
                }
            );
            let content = temp.html();
            content = content.replace(/\r?\n|\r/g, '');
            console.log('renderTree completed', content);
            resolve(temp.html());
            temp.remove();
        });
        console.log('renderTree started');
        ko.applyBindingsToNode(
            temp[0],
            {
                template: {
                    name: rootTemplate,
                    data: {data: tree}
                }
            }
        );
    });
}