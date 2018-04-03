/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import createBlock from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import Block from "./block";
import {BlockReadyEventParams} from "./factory";

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
        createBlock(
            Config.getInitConfig("content_types").tab,
            this,
            this.stage,
        ).then((tab) => {
            _.defer(() => {
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
    }
}
