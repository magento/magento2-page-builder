/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from 'knockout';
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
    let temp = jQuery('<div>');
    return new Promise((resolve, reject) => {
        engine.waitForFinishRender().then(function () {
            console.log('renderTree completed', temp.html());
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