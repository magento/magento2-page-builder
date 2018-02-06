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
import createBlock from "./factory";

export default class Column extends Block {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Bind events for the current instance
     */
    public bindEvents() {
        super.bindEvents();

        if (Config.getContentTypeConfig("column-group")) {
            EventBus.on("column:block:mount", (event: Event, params: {[key: string]: any}) => {
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
        EventBus.trigger("column:initElement", {
            column: this,
            element: $(element),
            parent: this.parent,
        });
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
            return createBlock(
                Config.getContentTypeConfig("column-group"),
                this.parent,
                this.parent.stage,
            ).then((columnGroup: ColumnGroup) => {
                return Promise.all([
                    createBlock(this.config, columnGroup, columnGroup.stage, {width: "50%"}),
                    createBlock(this.config, columnGroup, columnGroup.stage, {width: "50%"}),
                ]).then((columns: [Column, Column]) => {
                    columnGroup.addChild(columns[0], 0);
                    columnGroup.addChild(columns[1], 1);
                    this.parent.addChild(columnGroup, index);

                    this.fireMountEvent(columnGroup, columns[0], columns[1]);

                    return columnGroup;
                });
            });
        }
    }

    /**
     * Fire the mount event for blocks
     *
     * @param {Block} blocks
     */
    private fireMountEvent(...blocks: Block[]) {
        blocks.forEach((block) => {
            EventBus.trigger("block:mount", {id: block.id, block});
            EventBus.trigger(block.config.name + ":block:mount", {id: block.id, block});
        });
    }
}
