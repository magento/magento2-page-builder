/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import PreviewCollection from "../../../preview-collection";
import createContentType from "../../../content-type-factory";
import Config from "../../config";
import EventBus from "../../event-bus";
import BlockMountEventParamsInterface from "../block-mount-event-params.d";
import ButtonItem from "../button-item";

export default class Buttons extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);

    public bindEvents() {
        super.bindEvents();

        EventBus.on("buttons:block:ready", (event: Event, params: BlockMountEventParamsInterface) => {
            if (params.id === this.parent.id && this.parent.children().length === 0) {
                this.addButton();
            }
        });
    }

    /**
     * Add button-item to buttons children array
     */
    public addButton() {
        const createButtonItemPromise: Promise<ButtonItem> = createContentType(
            Config.getContentTypeConfig("button-item"),
            this.parent.parent,
            this.parent.stageId,
            {},
        );

        createButtonItemPromise.then((button: ButtonItem) => {
            this.parent.addChild(button);
            this.isLiveEditing(this.parent.children().indexOf(button));
            return button;
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
