/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import "tabs";
import _ from "underscore";
import Block from "./block";

export default class Tabs extends Block {
    public element: Element;
    public renderCounter: number = 0;

    constructor(parent: Block, config: object) {
        super(parent, config);

        // Declare our tabs, they'll get populated later
        this.data.tabs = ko.observableArray([]);
        this.data.tabs.subscribe((data) => {
            this.renderCounter = 0;
            $(this.element).tabs("destroy");
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
     * Callback after a tab has been rendered, wait until all tabs have been rendered to init the widget
     */
    public onTabRender() {
        ++this.renderCounter;
        if (this.data.tabs().length === this.renderCounter) {
            _.delay(() => $(this.element).tabs(), 50);
            this.renderCounter = 0;
        }
    }
}
