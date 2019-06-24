/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import RenderViewModel from "./view-model";

export default class RenderContentType {
    public children: KnockoutObservableArray<RenderContentType> = ko.observableArray([]);
    public content: RenderViewModel;

    constructor(content: RenderViewModel) {
        content.contentType = this;
        this.content = content;
    }

    /**
     * Return the children of the current content type
     */
    public getChildren(): KnockoutObservableArray<RenderContentType> {
        return this.children;
    }
}