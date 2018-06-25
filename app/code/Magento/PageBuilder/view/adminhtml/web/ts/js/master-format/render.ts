/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import ContentTypeInterface from "../content-type.d";
import decodeAllDataUrlsInString from "../utils/directives";
import filterHtml from "./filter-html";

/**
 * @api
 */
export default class MasterFormatRenderer {
    private rootTemplate: string = "Magento_PageBuilder/content-type/master";

    /**
     * Render a tree of content types instances stored in knockout
     *
     * @param {KnockoutObservableArray<ContentTypeInterface>} tree
     * @returns {Promise<string>}
     */
    public applyBindings(tree: KnockoutObservableArray<ContentTypeInterface>): Promise<string> {
        const element = $("<div>");
        return new Promise((resolve, reject) => {
            engine.waitForFinishRender().then(() => {
                ko.cleanNode(element[0]);
                const filtered: JQuery = filterHtml(element);
                const output = decodeAllDataUrlsInString(filtered.html());
                element.remove();
                resolve(output);
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
