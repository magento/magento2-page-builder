/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import EventBus from "../event-bus";
import {Options} from "../stage/structural/options";
import Block from "./block";
import {BlockReadyEventParams} from "./factory";

export default class TabItem extends Block {

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        const options = super.getOptions();
        options.removeOption("move");
        options.removeOption("title");
        return options;
    }

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container
        EventBus.on("tab-item:block:mount", (event: Event, params: BlockReadyEventParams) => {
            if (params.id === this.id) {
                this.updateDefaultTabName();
            }
        });
    }

    /**
     * Update the name of the tab to Tab N if it has no title
     */
    private updateDefaultTabName() {
        const data = this.parent.stage.store.get(this.id);
        if (!data.tab_name) {
            this.parent.stage.store.updateKey(
                this.id,
                $t("Tab") + " " + (this.parent.children.indexOf(this) + 1),
                "tab_name",
            );
        }
    }
}
