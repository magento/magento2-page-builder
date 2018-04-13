/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import "tabs";
import _ from "underscore";
import Preview from "../../../preview";

export default class Tabs extends Preview {
    private element: Element;
    private renderCounter: number = 0;

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

        if (this.previewData.tabs().length === this.renderCounter) {
            _.delay(() => $(this.element).tabs(), 50);
            this.renderCounter = 0;
        }
    }

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();

        this.updateDataValue("tabs", []);
        this.previewData.tabs.subscribe((data) => {
            this.renderCounter = 0;
            $(this.element).tabs("destroy");
        });
    }
}
