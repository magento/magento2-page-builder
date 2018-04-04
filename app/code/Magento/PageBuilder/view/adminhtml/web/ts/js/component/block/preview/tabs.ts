/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import "tabs";
import _ from "underscore";
import {ConfigContentBlock} from "../../config";
import EventBus from "../../event-bus";
import Block from "../block";
import {BlockCreateEventParams, BlockReadyEventParams} from "../factory";
import PreviewBlock from "./block";

export default class Tabs extends PreviewBlock {
    public focusedTab: KnockoutObservable<number> = ko.observable();
    private element: Element;
    private renderCounter: number = 0;

    /**
     * Assign a debounce and delay to the init of tabs to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */
    private buildTabs = _.debounce(() => {
        if (this.element && this.element.children.length > 0) {
            try {
                $(this.element).tabs("destroy");
            } catch (e) {
                // We aren't concerned if this fails, tabs throws an Exception when we cannot destroy
            }
            $(this.element).tabs();
        }
    }, 10);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        EventBus.on("tabs:block:ready", (event: Event, params: BlockReadyEventParams) => {
            if (params.id === this.parent.id && this.element) {
                this.buildTabs();
            }
        });
        EventBus.on("tab:block:create", (event: Event, params: BlockCreateEventParams) => {
            if (this.element && params.block.parent.id === this.parent.id) {
                this.buildTabs();
            }
        });
    }

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    public onContainerRender(element: Element) {
        this.element = element;
        this.buildTabs();
    }
}

// Resolve issue with jQuery UI tabs blocking events on content editable areas
const originalTabKeyDown = $.ui.tabs.prototype._tabKeydown;
$.ui.tabs.prototype._tabKeydown = function(event: Event) {
    // If the target is content editable don't handle any events
    if ($(event.target).attr("contenteditable")) {
        return;
    }
    originalTabKeyDown.call(this, event);
};
