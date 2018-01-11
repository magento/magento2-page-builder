/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import require from "require";
import Block from "./block";

export default class Accordion extends Block {
    protected element: Element;
    protected renderCounter: number = 0;

    constructor(parent: Block, config: object) {
        super(parent, config);

        // Declare our tabs, they'll get populated later
        this.data.items = ko.observableArray([]);
        this.data.items.subscribe((data) => {
            this.renderCounter = 0;
            $(this.element).accordion("destroy");
        });
    }

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    public onContainerRender(element: Element) {
        this.element = element;
    }

    /**
     * Callback after an item has been rendered, wait until all tabs have been rendered to init the widget
     */
    public onItemRender() {
        ++this.renderCounter;
        if (this.data.items().length === this.renderCounter) {
            require(["accordion"], () => {
                _.delay(
                    () => $(this.element).accordion({ active: this.parent.getActive() }),
                    50,
                );
            });
            this.renderCounter = 0;
        }
    }
}
