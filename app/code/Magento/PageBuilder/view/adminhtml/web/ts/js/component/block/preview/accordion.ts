/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import _ from "underscore";
import AccordionBlock from "../accordion";
import PreviewBlock from "./block";

export default class Accordion extends PreviewBlock {
    private element: Element;
    private renderCounter: number = 0;

    /**
     * @param {Accordion} parent
     * @param {object} config
     */
    constructor(parent: AccordionBlock, config: object) {
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
                    () => $(this.element).accordion({
                        active: (this.parent as AccordionBlock).getActive(),
                    }),
                    50,
                );
            });
            this.renderCounter = 0;
        }
    }
}
