/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import _ from "underscore";
import ObservableObject from "../../../observable-object.d";
import Preview from "../../../preview";

export default class Accordion extends Preview {
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
     * Callback after an item has been rendered, wait until all tabs have been rendered to init the widget
     */
    public onItemRender() {
        ++this.renderCounter;
        if (this.previewData.items().length === this.renderCounter) {
            require(["accordion"], () => {
                _.delay(
                    () => $(this.element).accordion({
                        active: this.parent.content.getActive(),
                    }),
                    50,
                );
            });
            this.renderCounter = 0;
        }
    }

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();
        this.updateDataValue("items", []);
        this.previewData.items.subscribe((data) => {
            this.renderCounter = 0;
            $(this.element).accordion("destroy");
        });
    }
}
