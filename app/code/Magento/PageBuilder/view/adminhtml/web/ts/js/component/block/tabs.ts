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
import Tab from "./tab";

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
     * Add a slide into the slider
     */
    public addTab() {
        (this.preview as TabsPreview).setActiveTab(this.children().length - 1);
        createBlock(
            Config.getInitConfig("content_types").tab,
            this,
            this.stage,
        ).then((tab) => {
            _.defer(() => {
                const mountFn = (event: Event, params: BlockMountEventParams) => {
                    if (params.id === tab.id) {
                        (this.preview as TabsPreview).setFocusedTab(this.children().length - 1);
                        EventBus.off("tab:block:mount", mountFn);
                    }
                };
                EventBus.on("tab:block:mount", mountFn);
                this.addChild(tab, this.children().length);
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
        EventBus.on("tab:block:removed", (event, params: BlockRemovedParams) => {
            if (params.parent.id === this.id) {
                // Mark the previous slide as active
                const newIndex = (params.index - 1 >= 0 ? params.index - 1 : 0);
                (this.preview as TabsPreview).setFocusedTab(newIndex);
            }
        });

        // Capture when a block is duplicated within the container
        let duplicatedTab: Tab;
        let duplicatedTabIndex: number;
        EventBus.on("tab:block:duplicate", (event, params: BlockDuplicateEventParams) => {
            if (params.duplicate.parent.id === this.id) {
                duplicatedTab = (params.duplicate as Tab);
                duplicatedTabIndex = params.index;
            }
        });
        EventBus.on("tab:block:mount", (event: Event, params: BlockMountEventParams) => {
            if (duplicatedTab && params.id === duplicatedTab.id) {
                (this.preview as TabsPreview).setFocusedTab(duplicatedTabIndex, true);
                duplicatedTab = duplicatedTabIndex = null;
            }
        });
    }
}
