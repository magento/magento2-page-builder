/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import Config from "../config";
import EventBus from "../event-bus";
import {Option} from "../stage/structural/options/option";
import Block from "./block";
import ColumnGroup from "./column-group";

export default class Column extends Block {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);

    public bindEvents() {
        super.bindEvents();

        if (Config.getContentTypeConfig("column-group")) {
            EventBus.on("column:mount", (event: Event, params: {[key: string]: any}) => {
                if (params.id === this.id) {
                    this.createColumnGroup();
                }
            });
        }
    }

    /**
     * Make a reference to the element in the column
     *
     * @param element
     */
    public initColumn(element: Element) {
        this.element = $(element);
    }

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    get options(): Option[] {
        const options = super.options;
        const newOptions = options.filter((option) => {
                return (option.code !== "move");
            });
        newOptions.unshift(
            new Option(this, "move", "<i></i>", $t("Move"), null, ["move-column"], 10),
        );
        return newOptions;
    }

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    public bindResizeHandle(handle: Element) {
        EventBus.trigger("column:bindResizeHandle", {
            column: this,
            handle: $(handle),
            parent: this.parent,
        });
    }

    /**
     * Wrap the current column in a group
     *
     * @returns {Promise<Block>}
     */
    public createColumnGroup(): Promise<Block> {
        if (!(this.parent instanceof ColumnGroup)) {
            const index = this.parent.children().indexOf(this);
            // Remove child instantly to stop content jumping around
            this.parent.removeChild(this);
            // Create a new instance of column group to wrap our columns with
            return super.createBlock(
                Config.getContentTypeConfig("column-group"),
                this.parent,
                index,
            ).then((columnGroup) => {
                return Promise.all([
                    super.createBlock(this.config, columnGroup, 0, {width: "50%"}),
                    super.createBlock(this.config, columnGroup, 1, {width: "50%"}),
                ]).then(() => {
                    return columnGroup;
                });
            });
        }
    }
}
