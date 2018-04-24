/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import "tabs";
import _ from "underscore";
import ContentTypeConfigInterface from "../../../content-type-config.d";
import createContentType from "../../../content-type-factory";
import ContentTypeInterface from "../../../content-type.d";
import ObservableUpdater from "../../../observable-updater";
import PreviewCollection from "../../../preview-collection";
import BlockRemovedParamsInterface from "../../block-removed-params";
import Config from "../../config";
import EventBus from "../../event-bus";
import {Option} from "../../stage/structural/options/option";
import {OptionInterface} from "../../stage/structural/options/option.d";
import {BlockCreateEventParamsInterface} from "../block-create-event-params.d";
import {BlockMountEventParamsInterface} from "../block-mount-event-params.d";
import {BlockReadyEventParamsInterface} from "../block-ready-event-params.d";

export default class Tabs extends PreviewCollection {
    public focusedTab: KnockoutObservable<number> = ko.observable();
    private element: Element;

    /**
     * Assign a debounce and delay to the init of tabs to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */
    private buildTabs = _.debounce((activeTabIndex = this.previewData.default_active()) => {
        if (this.element && this.element.children.length > 0) {
            try {
                $(this.element).tabs("destroy");
            } catch (e) {
                // We aren't concerned if this fails, tabs throws an Exception when we cannot destroy
            }
            $(this.element).tabs({
                create: (event: Event, ui: JQueryUI.TabsCreateOrLoadUIParams) => {
                    this.setFocusedTab(activeTabIndex || 0);
                },
            });
        }
    }, 10);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);

        EventBus.on("tabs:block:ready", (event: Event, params: BlockReadyEventParamsInterface) => {
            if (params.id === this.parent.id && this.element) {
                this.buildTabs();
            }
        });
        EventBus.on("tab-item:block:create", (event: Event, params: BlockCreateEventParamsInterface) => {
            if (this.element && params.block.parent.id === this.parent.id) {
                this.buildTabs();
            }
        });
        EventBus.on("tab-item:block:removed", (event: Event, params: BlockCreateEventParamsInterface) => {
            if (this.element && params.block.parent.id === this.parent.id) {
                this.buildTabs();
            }
        });
        // Set the stage to interacting when a tab is focused
        let focusTabValue: number;
        this.focusedTab.subscribe((value: number) => {
            focusTabValue = value;
            // If we're stopping the interaction we need to wait, to ensure any other actions can complete
            _.delay(() => {
                if (focusTabValue === value) {
                    if (value !== null) {
                        EventBus.trigger("interaction:start", {});
                    } else {
                        EventBus.trigger("interaction:stop", {});
                    }
                }
            }, (value === null ? 200 : 0));
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
            if (this.element.getElementsByTagName("span")[index]) {
                this.element.getElementsByTagName("span")[index].focus();
            }
            _.defer(() => {
                if ($(":focus").hasClass("tab-name") && $(":focus").prop("contenteditable")) {
                    document.execCommand("selectAll", false, null);
                } else {
                    // If the active element isn't the tab title, we're not interacting with the stage
                    EventBus.trigger("interaction:stop", {});
                }
            });
        }
    }

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        options.push(
            new Option(
                this,
                "add",
                "<i class='icon-pagebuilder-add'></i>",
                $t("Add"),
                this.addTab,
                ["add-child"],
                10,
            ),
        );
        return options;
    }

    /**
     * Add a tab
     */
    public addTab() {
        this.setActiveTab(this.parent.children().length - 1);
        createContentType(
            Config.getContentTypeConfig("tab-item"),
            this.parent,
            this.parent.stageId,
        ).then((tab) => {
            _.defer(() => {
                const mountFunction = (event: Event, params: BlockMountEventParamsInterface) => {
                    if (params.id === tab.id) {
                        this.setFocusedTab(this.parent.children().length - 1);
                        EventBus.off("tab-item:block:mount", mountFunction);
                    }
                };
                EventBus.on("tab-item:block:mount", mountFunction);
                this.parent.addChild(tab, this.parent.children().length);

                // Update the default tab title when adding a new tab
                tab.store.updateKey(
                    tab.id,
                    $t("Tab") + " " + (this.parent.children.indexOf(tab) + 1),
                    "tab_name",
                );
            });
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
     * Copy over border styles to the tab headers
     *
     * @returns {any}
     */
    public getTabHeaderStyles() {
        const headerStyles = this.data.headers.style();
        return {
            ...headerStyles,
            marginBottom: "-" + headerStyles.borderWidth,
            marginLeft: "-" + headerStyles.borderWidth,
        };
    }

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container

        EventBus.on("tabs:block:dropped:create", (event: Event, params: BlockReadyEventParamsInterface) => {
            if (params.id === this.parent.id && this.parent.children().length === 0) {
                this.addTab();
            }
        });
        // Block being removed from container
        EventBus.on("tab-item:block:removed", (event, params: BlockRemovedParamsInterface) => {
            if (params.parent.id === this.parent.id) {
                // Mark the previous slide as active
                const newIndex = (params.index - 1 >= 0 ? params.index - 1 : 0);
                this.setFocusedTab(newIndex);
            }
        });
        EventBus.on("tab-item:block:duplicate", (event, params: BlockDuplicateEventParams) => {
            this.buildTabs(params.index);
        });
        EventBus.on("tab-item:block:mount", (event: Event, params: BlockMountEventParamsInterface) => {
            if (this.parent.id === params.block.parent.id) {
                this.updateTabNamesInDataStore();
                this.parent.store.subscribe(() => {
                    this.updateTabNamesInDataStore();
                }, params.block.id);
            }
        });
    }

    /**
     * Update data store with active options
     */
    private updateTabNamesInDataStore() {
        const activeOptions: ActiveOptions[] = [];
        this.parent.children().forEach((tab: Block, index: number) => {
            const tabData = tab.store.get(tab.id);
            activeOptions.push({
                label: tabData.tab_name.toString(),
                labeltitle: tabData.tab_name.toString(),
                value: index,
            });
        });

        this.parent.store.updateKey(
            this.parent.id,
            activeOptions,
            "_default_active_options",
        );
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

export interface ActiveOptions {
    label: string;
    labeltitle: string;
    value: number;
}
