/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import ContentTypeCollectionInterface from "../content-type-collection.types";
import decodeAllDataUrlsInString from "../utils/directives";
import filterHtml from "./filter-html";

export default class MasterFormatRenderer {
    /**
     * Render the root container into a string
     *
     * @param {ContentTypeCollection} rootContainer
     * @returns {Promise<string>}
     */
    public applyBindings(rootContainer: ContentTypeCollectionInterface): Promise<string> {
        const element = $("<div>");
        return new Promise((resolve) => {
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
                        data: rootContainer.content,
                        name: rootContainer.content.template,
                    },
                },
            );
        }).catch((error) => {
            console.error(error);
            return null;
        });
    }
}
