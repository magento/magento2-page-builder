/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from 'jquery';
import ko from 'knockout';
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import Structural from "./structural/abstract";
import filterHtml from '../../component/format/filter-html';
import decodeAllDataUrlsInString from "../../utils/directives";

/**
 * Render the tree into a string
 *
 * @param {KnockoutObservableArray<Structural>} tree
 */

/*eslint-disable */
export default class Save {
    rootTemplate: string = 'Gene_BlueFoot/component/block/render/root.html';

    /**
     * Render a tree of content types instances stored in knockout
     *
     * @param {KnockoutObservableArray<Structural>} tree
     * @returns {Promise<string>}
     */
    renderTree(tree: KnockoutObservableArray<Structural>): Promise<string> {
        let element = $('<div>');
        return new Promise((resolve, reject) => {
            engine.waitForFinishRender().then(() => {
                const filtered: JQuery = filterHtml(element),
                    output = decodeAllDataUrlsInString(filtered.html());
                resolve(output);
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
