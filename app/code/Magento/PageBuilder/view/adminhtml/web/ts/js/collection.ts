/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeInterface from "./content-type.types";
import { moveArrayItemIntoArray, removeArrayItem } from "./utils/array";

/**
 * @api
 */
export default class Collection {
    public children: KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>;

    constructor(children?: KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>) {
        this.children = children ? children : ko.observableArray([]);
    }

    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>}
     */
    public getChildren(): KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface> {
        return this.children;
    }

    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */
    public addChild(child: any, index?: number): void {
        if (typeof index === "number") {
            // Use the arrayUtil function to add the item in the correct place within the array
            moveArrayItemIntoArray(child, this.children, index);
        } else {
            this.children.push(child);
        }
    }

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    public removeChild(child: any): void {
        removeArrayItem(this.children, child);
    }

    /**
     * Set the children observable array into the class
     *
     * @param children
     */
    public setChildren(children: KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>) {
        this.children = children;
    }
}
