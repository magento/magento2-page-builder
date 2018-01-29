/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";

interface AccordionDataObject {
    content: string;
    open_on_load: string;
    title: string;
}

export default class Accordion extends Block {

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
        if (this.getData().items) {
            const items = this.getData().items as AccordionDataObject[];
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
