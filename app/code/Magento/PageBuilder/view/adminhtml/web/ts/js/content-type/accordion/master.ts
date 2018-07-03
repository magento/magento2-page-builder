/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * @api
 */
import MasterCollection from "../master-collection";

interface AccordionDataObject {
    content: string;
    open_on_load: string;
    title: string;
}

export default class Master extends MasterCollection {

    /**
     * Retrieve the data-mage-init contents
     *
     * @returns {{accordion: {collapsibleElement: string; content: string}}}
     */
    public getMageInit() {
        return JSON.stringify(
            {
                accordion: {
                    active: this.getActive(),
                    collapsibleElement: "[data-collapsible=true]",
                    content: "[data-content=true]",
                },
            },
        );
    }

    /**
     * Return the active (open on load) accordion items
     *
     * @returns {number[]|[]}
     */
    public getActive() {
        if (this.parent.dataStore.get("items")) {
            const items = this.parent.dataStore.get("items") as AccordionDataObject[];
            const activeItems = items.map(
                (item, index) =>
                    item.open_on_load === "1" ? index : null,
            ).filter((item) => {
                return item !== null;
            });
            return _.isEmpty(activeItems) ? [0] : activeItems;
        }
        return [0];
    }
}
