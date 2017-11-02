/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from 'jquery';
import ko from 'knockout';
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import Structural from "./structural/abstract";
import FilterHtml from '../../utils/filter-html';

/**
 * Render the tree into a string
 *
 * @param {KnockoutObservableArray<Structural>} tree
 */
export default class Save {
    rootTemplate: string = 'Gene_BlueFoot/component/block/render/root.html';
    filterHtml: FilterHtml = new FilterHtml();

    renderTree(tree: KnockoutObservableArray<Structural>): Promise<string> {
        let element = $('<div>');
        return new Promise((resolve, reject) => {
            engine.waitForFinishRender().then(() => {
                element = this.filterHtml.filter(element);
                resolve(element.html());
                element.remove();
            });
            ko.applyBindingsToNode(
                element[0],
                {
                    template: {
                        name: this.rootTemplate,
                        data: {getChildren: () => tree}
                    }
                }
            );
        });
    }
}
