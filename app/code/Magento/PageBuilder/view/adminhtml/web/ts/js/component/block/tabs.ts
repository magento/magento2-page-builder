/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import createBlock from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
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
                const mountFunction = (event: Event, params: BlockMountEventParams) => {
                    if (params.id === tab.id) {
                        (this.preview as TabsPreview).setFocusedTab(this.children().length - 1);
                        EventBus.off("tab-item:block:mount", mountFunction);
                    }
                };
                EventBus.on("tab-item:block:mount", mountFunction);
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
        EventBus.on("tabs:block:ready", (event: Event, params: BlockReadyEventParams) => {
            if (params.id === this.id && this.children().length === 0) {
                this.addTab();
            }
        });

        // Block being removed from container
        EventBus.on("tab-item:block:removed", (event, params: BlockRemovedParams) => {
            if (params.parent.id === this.id) {
                // Mark the previous slide as active
                const newIndex = (params.index - 1 >= 0 ? params.index - 1 : 0);
                (this.preview as TabsPreview).setFocusedTab(newIndex);
            }
        });

        // Capture when a block is duplicated within the container
        let duplicatedTab: Block;
        let duplicatedTabIndex: number;
        EventBus.on("tab-item:block:duplicate", (event, params: BlockDuplicateEventParams) => {
            if (params.duplicate.parent.id === this.id) {
                const tabData = params.duplicate.stage.store.get(params.duplicate.id);
                this.parent.stage.store.updateKey(
                    params.duplicate.id,
                    tabData.tab_name.toString() + " Copy",
                    "tab_name",
                );
                duplicatedTab = params.duplicate;
                duplicatedTabIndex = params.index;
            }
        });
        EventBus.on("tab-item:block:mount", (event: Event, params: BlockMountEventParams) => {
            if (duplicatedTab && params.id === duplicatedTab.id) {
                (this.preview as TabsPreview).setFocusedTab(duplicatedTabIndex, true);
                duplicatedTab = duplicatedTabIndex = null;
            }
            if (this.id === params.block.parent.id) {
                this.updateTabNamesInDataStore();
                this.parent.stage.store.subscribe(() => {
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
