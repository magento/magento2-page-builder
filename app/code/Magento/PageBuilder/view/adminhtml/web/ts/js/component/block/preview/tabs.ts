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
            $(this.element).tabs({
                create: (event: Event, ui: JQueryUI.TabsCreateOrLoadUIParams) => {
                    this.setActiveTab(this.data.default_active() || 0);
                },
            });
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
        EventBus.on("tab:block:removed", (event: Event, params: BlockCreateEventParams) => {
            if (this.element && params.block.parent.id === this.parent.id) {
                this.buildTabs();
            }
        });
        // Set the stage to interacting when a tab is focused
        this.focusedTab.subscribe((value: number) => {
            this.parent.stage.interacting(value !== null);
        });
    }

    /**
     * Set the active tab, we maintain a reference to it in an observable for when we rebuild the tab instance
     *
     * @param {number} index
     */
    public setActiveTab(index: number) {
        $(this.element).tabs("option", "active", index);
    }

    /**
     * Set the focused tab
     *
     * @param {number} index
     * @param {boolean} force
     */
    public setFocusedTab(index: number, force: boolean = false) {
        this.setActiveTab(index);
        if (force) {
            this.focusedTab(null);
        }
        this.focusedTab(index);

        if (this.element) {
            _.defer(() => {
                document.execCommand("selectAll", false, null);
            });
        }
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

    /**
     * Handle clicking on a tab
     *
     * @param {number} index
     * @param {Event} event
     */
    public onTabClick(index: number, event: Event) {
        // The options menu is within the tab, so don't change the focus if we click an item within
        if ($(event.target).parents(".pagebuilder-options").length > 0) {
            return;
        }
        this.setFocusedTab(index);
    }

    /**
     * Get the Tab header style attributes for the preview
     *
     * @param {number} index
     * @returns {any}
     */
    public getTabHeaderStyles(index: number) {
        const mainStyles = this.parent.data.headers.style();
        delete mainStyles.marginBottom;
        const styles = {
            borderBottomColor: "",
            borderBottomStyle: "none",
            borderBottomWidth: "2px",
            marginLeft: "0px",
        };
        if (index !== 0) {
            styles.marginLeft = `-${this.data.border_width()}px`;
        }
        // if (index === this.activeTab()) {
        //     styles.borderBottomColor = this.data.border() !== "_default" ?
        //     `rgba(255,255,255,1)` : "transparent";
        //     styles.borderBottomWidth = `${Math.abs(parseInt(mainStyles.marginBottom, 10)) + 1}px`;
        // } else {
        //     styles.borderBottomColor = "transparent";
        // }
        return {
            ...mainStyles,
            ...styles,
        };
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
