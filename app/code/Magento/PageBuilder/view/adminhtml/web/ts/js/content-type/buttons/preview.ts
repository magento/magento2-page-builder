/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import BlockMountEventParamsInterface from "../../component/block/block-mount-event-params.d";
import Config from "../../component/config";
import EventBus from "../../component/event-bus";
import {Option} from "../../component/stage/structural/options/option";
import {OptionInterface} from "../../component/stage/structural/options/option.d";
import createContentType from "../../content-type-factory";
import PreviewCollection from "../../preview-collection";
import ButtonItem from "../button-item/preview";

export default class Preview extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);

    public bindEvents() {
        super.bindEvents();

        EventBus.on("buttons:block:dropped:create", (event: Event, params: BlockMountEventParamsInterface) => {
            if (params.id === this.parent.id && this.parent.children().length === 0) {
                this.addButton();
            }
        });
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
                $t("Add Button"),
                this.addButton,
                ["add-child"],
                20,
            ),
        );
        return options;
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
