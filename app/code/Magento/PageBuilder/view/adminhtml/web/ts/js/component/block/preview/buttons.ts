/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import events from "uiEvents";
import $t from "mage/translate";
import createContentType from "../../../content-type-factory";
import PreviewCollection from "../../../preview-collection";
import Config from "../../config";
import {Option} from "../../stage/structural/options/option";
import {OptionInterface} from "../../stage/structural/options/option.d";
import BlockMountEventParamsInterface from "../block-mount-event-params.d";
import ButtonItem from "./button-item";

export default class Buttons extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);

    public bindEvents() {
        super.bindEvents();

        events.on("buttons:block:dropped:create", (args: BlockMountEventParamsInterface) => {
            if (args.id === this.parent.id && this.parent.children().length === 0) {
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
