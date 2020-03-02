/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import "tabs";
import _ from "underscore";
import {ActiveOptionsInterface} from "../../binding/active-options.types";
import {PreviewSortableSortUpdateEventParams, SortableOptionsInterface} from "../../binding/sortable-children.types";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ContentTypeConfigInterface from "../../content-type-config.types";
import createContentType from "../../content-type-factory";
import HideShowOption from "../../content-type-menu/hide-show-option";
import Option from "../../content-type-menu/option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import ContentTypeInterface from "../../content-type.types";
import {DataObject} from "../../data-store";
import delayUntil from "../../utils/delay-until";
import deferred, {DeferredInterface} from "../../utils/promise-deferred";
import {
    ContentTypeDroppedCreateEventParamsInterface,
    ContentTypeDuplicateEventParamsInterface,
    ContentTypeMountEventParamsInterface,
    ContentTypeRemovedEventParamsInterface,
    ContentTypeRemovedParamsInterface,
} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public focusedTab: KnockoutObservable<number> = ko.observable(null);
    public activeTab: KnockoutObservable<number> = ko.observable(0);
    private disableInteracting: boolean;
    private element: Element;
    private ready: boolean;
    private onContainerRenderDeferred: DeferredInterface = deferred();
    private mountAfterDeferred: DeferredInterface = deferred();

    /**
     * @param {ContentTypeCollectionInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ContentTypeCollectionInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);

        // Wait for the tabs instance to mount and the container to be ready
        Promise.all([
            this.onContainerRenderDeferred.promise,
            this.mountAfterDeferred.promise,
        ]).then(([element, expectedChildren]) => {
            // We always create 1 tab when dropping tabs into the instance
            expectedChildren = expectedChildren || 1;
            // Wait until all children's DOM elements are present before building the tabs instance
            delayUntil(
                () => {
                    this.element = element as Element;
                    this.buildTabs();
                },
                () => $(element).find(".pagebuilder-tab-item").length === expectedChildren,
            );
        });

        // Resolve our deferred when the tabs item mounts with expect children
        events.on("tabs:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.contentType.id === this.contentType.id && args.expectChildren !== undefined) {
                this.mountAfterDeferred.resolve(args.expectChildren);
            }
        });

        events.on("tab-item:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (this.element && args.contentType.parentContentType.id === this.contentType.id) {
                this.refreshTabs();
            }
        });
        events.on("tab-item:renderAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (this.element && args.contentType.parentContentType.id === this.contentType.id) {
                _.defer(() => {
                    this.refreshTabs();
                });
            }
        });
        // Set the active tab to the new position of the sorted tab
        events.on("tab-item:removeAfter", (args: ContentTypeRemovedEventParamsInterface) => {
            if (args.parentContentType && args.parentContentType.id === this.contentType.id) {
                this.refreshTabs();

                // We need to wait for the tabs to refresh before executing the focus
                _.defer(() => {
                    const newPosition = args.index > 0 ? args.index - 1 : 0;
                    this.setFocusedTab(newPosition, true);
                });
            }
        });
        // Refresh tab contents and set the focus to the new position of the sorted tab
        events.on("childContentType:sortUpdate", (args: PreviewSortableSortUpdateEventParams) => {
            if (args.instance.id === this.contentType.id) {
                this.refreshTabs(args.newPosition, true);
                /**
                 * Update the default active tab if its position was affected by the sorting
                 */
                const defaultActiveTab = +this.activeTab();
                let newDefaultActiveTab = defaultActiveTab;
                if (args.originalPosition === defaultActiveTab) {
                    newDefaultActiveTab = args.newPosition;
                } else if (args.originalPosition < defaultActiveTab && args.newPosition >= defaultActiveTab) {
                    // a tab was moved from the left of the default active tab the right of it, changing its index
                    newDefaultActiveTab--;
                } else if (args.originalPosition > defaultActiveTab && args.newPosition <= defaultActiveTab) {
                    // a tab was moved from the right of the default active tab the left of it, changing its index
                    newDefaultActiveTab++;
                }
                this.updateData("default_active", newDefaultActiveTab.toString());
            }
        });

        // Monitor focus tab to start / stop interaction on the stage, debounce to avoid duplicate calls
        this.focusedTab.subscribe(_.debounce((index: number) => {
            if (index !== null) {
                events.trigger("stage:interactionStart");
                delayUntil(
                    () => $($(this.wrapperElement).find(".tab-header")[index]).find("[contenteditable]").focus(),
                    () => $($(this.wrapperElement).find(".tab-header")[index]).find("[contenteditable]").length > 0,
                    10,
                );
            } else {
                // We have to force the stop as the event firing is inconsistent for certain operations
                events.trigger("stage:interactionStop", {force : true});
            }
        }, 1));
    }

    /**
     * Remove focused tab
     */
    public destroy(): void {
        super.destroy();
        _.defer(() => this.setFocusedTab(null));
    }

    /**
     * Refresh the tabs instance when new content appears
     *
     * @param {number} focusIndex
     * @param {boolean} forceFocus
     * @param {number} activeIndex
     */
    public refreshTabs(focusIndex?: number, forceFocus?: boolean, activeIndex?: number) {
        try {
            $(this.element).tabs("refresh");
            if (focusIndex >= 0) {
                this.setFocusedTab(focusIndex, forceFocus);
            } else if (activeIndex) {
                this.setActiveTab(activeIndex);
            }
            // update sortability of tabs
            const sortableElement = $(this.element).find(".tabs-navigation");
            if (sortableElement.hasClass("ui-sortable")) {
                if (this.contentType.children().length <= 1) {
                    sortableElement.sortable("disable");
                } else {
                    sortableElement.sortable("enable");
                }
            }
        } catch (e) {
            this.buildTabs();
        }
    }

    /**
     * Set the active tab, we maintain a reference to it in an observable for when we rebuild the tab instance
     *
     * @param {number} index
     */
    public setActiveTab(index: number) {
        if (index !== null) {
            // Added to prevent mismatched fragment error caused by not yet rendered tab-item
            index = parseInt(index.toString(), 10);
            delayUntil(
                () => {
                    $(this.element).tabs("option", "active", index);
                    this.activeTab(index);
                    events.trigger("contentType:redrawAfter", {
                        id: this.contentType.id,
                        contentType: this,
                    });
                },
                () => $(this.element).find(".pagebuilder-tab-item").length >= index + 1,
            );
        }
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
    }

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();

        options.add = new Option({
            preview: this,
            icon: "<i class='icon-pagebuilder-add'></i>",
            title: $t("Add"),
            action: this.addTab,
            classes: ["add-child"],
            sort: 10,
        });

        options.hideShow = new HideShowOption({
            preview: this,
            icon: HideShowOption.showIcon,
            title: HideShowOption.showText,
            action: this.onOptionVisibilityToggle,
            classes: ["hide-show-content-type"],
            sort: 40,
        });

        return options;
    }

    /**
     * Add a tab
     */
    public addTab() {
        createContentType(
            Config.getContentTypeConfig("tab-item"),
            this.contentType,
            this.contentType.stageId,
        ).then((tab) => {
            events.on("tab-item:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
                if (args.id === tab.id) {
                    this.setFocusedTab(this.contentType.children().length - 1);
                    events.off(`tab-item:${tab.id}:mountAfter`);
                }
            }, `tab-item:${tab.id}:mountAfter`);
            this.contentType.addChild(tab, this.contentType.children().length);

            // Update the default tab title when adding a new tab
            tab.dataStore.set(
                "tab_name",
                $t("Tab") + " " + (this.contentType.children.indexOf(tab) + 1),
            );
        });
    }

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    public onContainerRender(element: Element) {
        this.element = element;
        this.onContainerRenderDeferred.resolve(element);
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
     * Get the sortable options for the tab heading sorting
     *
     * @returns {JQueryUI.SortableOptions}
     */
    public getSortableOptions(): SortableOptionsInterface {
        const self = this;
        let borderWidth: number;
        return {
            handle: ".tab-drag-handle",
            tolerance: "pointer",
            cursor: "grabbing",
            cursorAt: { left: 8, top: 25 },

            /**
             * Provide custom helper element
             *
             * @param {Event} event
             * @param {JQueryUI.Sortable} element
             * @returns {Element}
             */
            helper(event: Event, element: JQueryUI.Sortable): Element {
                const helper = $(element).clone().css("opacity", "0.7");
                helper[0].querySelector(".pagebuilder-options").remove();
                return helper[0];
            },

            /**
             * Add a padding to the navigation UL to resolve issues of negative margins when sorting
             *
             * @param {Event} event
             * @param {JQueryUI.SortableUIParams} ui
             */
            start(event: Event, ui: JQueryUI.SortableUIParams) {
                /**
                 * Due to the way we use negative margins to overlap the borders we need to apply a padding to the
                 * container when we're moving the first item to ensure the tabs remain in the same place.
                 */
                if (ui.item.index() === 0) {
                    borderWidth = parseInt(ui.item.css("borderWidth"), 10) || 1;
                    $(this).css("paddingLeft", borderWidth);
                }

                ui.helper.css("width", "");
                events.trigger("stage:interactionStart");
                self.disableInteracting = true;
            },

            /**
             * Remove the padding once the operation is completed
             *
             * @param {Event} event
             * @param {JQueryUI.SortableUIParams} ui
             */
            stop(event: Event, ui: JQueryUI.SortableUIParams) {
                $(this).css("paddingLeft", "");
                events.trigger("stage:interactionStop");
                self.disableInteracting = false;
            },

            placeholder: {
                /**
                 * Provide custom placeholder element
                 *
                 * @param {JQuery} item
                 * @returns {JQuery}
                 */
                element(item: JQuery) {
                    const placeholder = item
                        .clone()
                        .css({
                            display: "inline-block",
                            opacity: "0.3",
                        })
                        .removeClass("focused")
                        .addClass("sortable-placeholder");
                    placeholder[0].querySelector(".pagebuilder-options").remove();
                    return placeholder[0];
                },
                update() {
                    return;
                },
            },
        };
    }

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();
        // ContentType being mounted onto container

        events.on("tabs:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.contentType.id && this.contentType.children().length === 0) {
                this.addTab();
            }
        });
        // ContentType being removed from container
        events.on("tab-item:removeAfter", (args: ContentTypeRemovedParamsInterface) => {
            if (args.parentContentType && args.parentContentType.id === this.contentType.id) {
                // Mark the previous tab as active
                const newIndex = (args.index - 1 >= 0 ? args.index - 1 : 0);
                this.refreshTabs(newIndex, true);
            }
        });
        // Capture when a content type is duplicated within the container
        let duplicatedTab: ContentTypeInterface;
        let duplicatedTabIndex: number;
        events.on("tab-item:duplicateAfter", (args: ContentTypeDuplicateEventParamsInterface) => {
            if (this.contentType.id === args.duplicateContentType.parentContentType.id && args.direct) {
                const tabData = args.duplicateContentType.dataStore.getState();
                args.duplicateContentType.dataStore.set(
                    "tab_name",
                    tabData.tab_name.toString() + " copy",
                );
                duplicatedTab = args.duplicateContentType;
                duplicatedTabIndex = args.index;
            }
        });
        events.on("tab-item:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (duplicatedTab && args.id === duplicatedTab.id) {
                this.refreshTabs(duplicatedTabIndex, true);
                duplicatedTab = duplicatedTabIndex = null;
            }
            if (this.contentType.id === args.contentType.parentContentType.id) {
                this.updateTabNamesInDataStore();
                args.contentType.dataStore.subscribe(() => {
                    this.updateTabNamesInDataStore();
                });
            }
        });

        this.contentType.dataStore.subscribe(
            (data: DataObject) => {
                this.activeTab(data.default_active);
            },
        );
    }

    /**
     * Update data store with active options
     */
    private updateTabNamesInDataStore() {
        const activeOptions: ActiveOptionsInterface[] = [];
        this.contentType.children().forEach((tab: ContentTypeInterface, index: number) => {
            const tabData = tab.dataStore.getState();
            activeOptions.push({
                label: tabData.tab_name.toString(),
                labeltitle: tabData.tab_name.toString(),
                value: index,
            });
        });

        this.contentType.dataStore.set(
            "_default_active_options",
            activeOptions,
        );
    }

    /**
     * Assign a debounce and delay to the init of tabs to ensure the DOM has updated
     *
     * @type {(() => void) & _.Cancelable}
     */
    private buildTabs(activeTabIndex = this.activeTab() as number || 0) {
        this.ready = false;
        if (this.element && this.element.children.length > 0) {
            const focusedTab = this.focusedTab();
            try {
                $(this.element).tabs("destroy");
            } catch (e) {
                // We aren't concerned if this fails, tabs throws an Exception when we cannot destroy
            }
            $(this.element).tabs({
                create: () => {
                    this.ready = true;
                    // Ensure focus tab is restored after a rebuild cycle
                    if (focusedTab !== null) {
                        this.setFocusedTab(focusedTab, true);
                    } else {
                        this.setFocusedTab(null);
                        if (activeTabIndex) {
                            this.setActiveTab(activeTabIndex);
                        }
                    }
                },
                /**
                 * Trigger redraw event since new content is being displayed
                 */
                activate: () => {
                    events.trigger("contentType:redrawAfter", {
                        element: this.element,
                    });
                },
            });
        }
    }
}

// Resolve issue with jQuery UI tabs content typing events on content editable areas
const originalTabKeyDown = $.ui.tabs.prototype._tabKeydown;
$.ui.tabs.prototype._tabKeydown = function(event: Event) {
    // If the target is content editable don't handle any events
    if ($(event.target).attr("contenteditable")) {
        return;
    }
    originalTabKeyDown.call(this, event);
};
