/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import filterHtml from "../../component/format/filter-html";
import decodeAllDataUrlsInString from "../../utils/directives";
import Structural from "./structural/abstract";

/**
 * Render the tree into a string
 *
 * @param {KnockoutObservableArray<Structural>} tree
 */

export default class Save {
    public rootTemplate: string = "Magento_PageBuilder/component/block/render/root.html";

    /**
     * Render a tree of content types instances stored in knockout
     *
     * @param {KnockoutObservableArray<Structural>} tree
     * @returns {Promise<string>}
     */
    public renderTree(tree: KnockoutObservableArray<Structural>): Promise<string> {
        const element = $("<div>");
        return new Promise((resolve, reject) => {
            engine.waitForFinishRender().then(() => {
                const filtered: JQuery = filterHtml(element);
                const output = decodeAllDataUrlsInString(filtered.html());
                resolve(output);
                element.remove();
            });
            ko.applyBindingsToNode(
                element[0],
                {
                    template: {
                        data: {getChildren: () => tree},
                        name: this.rootTemplate,
                    },
                },
            );
        });
    }
}
