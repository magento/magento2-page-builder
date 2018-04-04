/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import EventBus from "../event-bus";
import Block from "./block";
import {BlockReadyEventParams} from "./factory";

export default class Tab extends Block {
    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container
        EventBus.on("tab:block:mount", (event: Event, params: BlockReadyEventParams) => {
            if (params.id === this.id) {
                this.updateDefaultTitle();
            }
        });
    }

    /**
     * Update the title of the tab to Tab N if it has no title
     */
    private updateDefaultTitle() {
        const data = this.parent.stage.store.get(this.id);
        if (!data.title) {
            this.parent.stage.store.updateKey(
                this.id,
                $t("Tab") + " " + (this.parent.children.indexOf(this) + 1),
                "title",
            );
        }
    }
}
