/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "uiEvents";
import _ from "underscore";
import createBlock from "../block/factory";
import Config from "../config";
import {BlockRemovedParams} from "../stage/event-handling-delegate";
import {BlockDuplicateEventParams, BlockMountEventParams} from "../stage/structural/editable-area";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import Block from "./block";
import {BlockReadyEventParams} from "./factory";
import TabsPreview from "./preview/tabs";

export default class Tabs extends Block {

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
        (this.preview as TabsPreview).setActiveTab(this.children().length - 1);
        createBlock(
            Config.getInitConfig("content_types")["tab-item"],
            this,
            this.stage,
        ).then((tab) => {
            _.defer(() => {
                const mountFunction = (event: Event, args: BlockMountEventParams) => {
                    if (args.id === tab.id) {
                        (this.preview as TabsPreview).setFocusedTab(this.children().length - 1);
                        events.off("tab-item:block:mount:add");
                    }
                };
                events.on("tab-item:block:mount", mountFunction, "tab-item:block:mount:add");
                this.addChild(tab, this.children().length);

                // Update the default tab title when adding a new tab
                this.parent.stage.store.updateKey(
                    tab.id,
                    $t("Tab") + " " + (this.children.indexOf(tab) + 1),
                    "tab_name",
                );
            });
        });
    }

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container
        events.on("tabs:block:ready", (event: Event, args: BlockReadyEventParams) => {
            if (args.id === this.id && this.children().length === 0) {
                this.addTab();
            }
        });

        // Block being removed from container
        events.on("tab-item:block:removed", (event, args: BlockRemovedParams) => {
            if (args.parent.id === this.id) {
                // Mark the previous slide as active
                const newIndex = (args.index - 1 >= 0 ? args.index - 1 : 0);
                (this.preview as TabsPreview).setFocusedTab(newIndex);
            }
        });

        // Capture when a block is duplicated within the container
        let duplicatedTab: Block;
        let duplicatedTabIndex: number;
        events.on("tab-item:block:duplicate", (event, args: BlockDuplicateEventParams) => {
            if (args.duplicate.parent.id === this.id) {
                duplicatedTab = args.duplicate;
                duplicatedTabIndex = args.index;
            }
        });
        events.on("tab-item:block:mount", (event: Event, args: BlockMountEventParams) => {
            if (duplicatedTab && args.id === duplicatedTab.id) {
                (this.preview as TabsPreview).setFocusedTab(duplicatedTabIndex, true);
                duplicatedTab = duplicatedTabIndex = null;
            }
            if (this.id === args.block.parent.id) {
                this.updateTabNamesInDataStore();
                this.parent.stage.store.subscribe(() => {
                    this.updateTabNamesInDataStore();
                }, args.block.id);
            }
        });
    }

    /**
     * Update data store with active options
     */
    private updateTabNamesInDataStore() {
        const activeOptions: ActiveOptions[] = [];
        this.children().forEach((tab: Block, index: number) => {
            const tabData = tab.stage.store.get(tab.id);
            activeOptions.push({
                label: tabData.tab_name.toString(),
                labeltitle: tabData.tab_name.toString(),
                value: index,
            });
        });
        this.parent.stage.store.updateKey(
            this.id,
            activeOptions,
            "_default_active_options",
        );
    }
}

export interface ActiveOptions {
    label: string;
    labeltitle: string;
    value: number;
}
