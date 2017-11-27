/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import ko from "knockout";
import $ from "jquery";
import _ from "underscore";
import "mage/backend/tabs";

export default class Tabs extends Block {
    element: Element;
    renderCounter: number = 0;

    constructor(parent: Block, config: object) {
        super(parent, config);

        // Declare our tabs, they'll get populated later
        this.data.tabs = ko.observableArray([]);
        this.data.tabs.subscribe((data) => {
            this.renderCounter = 0;
            $(this.element).tabs('destroy');
        });
    }

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    onContainerRender(element: Element) {
        this.element = element;
    }

    /**
     * Callback after a tab has been rendered, wait until all tabs have been rendered to init the widget
     */
    onTabRender() {
        ++this.renderCounter;
        if (this.data.tabs().length === this.renderCounter) {
            _.delay(() => $(this.element).tabs(), 50);
            this.renderCounter = 0;
        }
    }
}
