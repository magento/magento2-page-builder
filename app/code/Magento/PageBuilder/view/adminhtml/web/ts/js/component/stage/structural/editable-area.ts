/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import mageUtils from "mageUtils";
import { moveArrayItemIntoArray, removeArrayItem } from "../../../utils/array";
import Block from "../../block/block";
import EventBus from "../../event-bus";
import Stage from "../../stage";
import {SortParams} from "../event-handling-delegate";
import Structural from "./abstract";
import { EditableAreaInterface } from "./editable-area.d";

export default class EditableArea implements EditableAreaInterface {
    public id: string = mageUtils.uniqueid();
    public children: KnockoutObservableArray<Structural> = ko.observableArray([]);
    public stage: Stage;
    public title: string = $t("Editable");
    public parent: EditableArea;

    /**
     * EditableArea constructor
     *
     * @param stage
     */
    constructor(stage?: Stage) {
        if (stage) {
            this.stage = stage;
        }

        this.bindEvents();
    }

    /**
     * Retrieve the child template
     *
     * @returns {string}
     */
    get childTemplate(): string {
        return "Magento_PageBuilder/component/block/render/children.html";
    }

    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<Structural>}
     */
    public getChildren(): KnockoutObservableArray<Structural> {
        return this.children;
    }

    /**
     * Duplicate a child of the current instance
     *
     * @param {Structural} child
     * @param {boolean} autoAppend
     * @returns {Structural}
     */
    public duplicateChild(child: Structural, autoAppend: boolean = true): Structural {
        const store = this.stage.store;
        const instance = child.constructor as typeof Block;
        const duplicate = new instance(
            child.parent,
            child.stage,
            child.config,
            child.getData(),
            child.elementConverterPool,
            child.dataConverterPool,
        );
        const index = child.parent.children.indexOf(child) + 1 || null;
        // Copy the data from the data store
        store.update(
            duplicate.id,
            Object.assign({}, store.get(child.id)),
        );
        // Duplicate the instances children into the new duplicate
        if (child.children().length > 0) {
            child.children().forEach((subChild: Structural, childIndex: number) => {
                duplicate.addChild(
                    duplicate.duplicateChild(subChild, false),
                    childIndex,
                );
            });
        }

        if (autoAppend) {
            this.addChild(duplicate, index);
        }
        return duplicate;
    }

    /**
     * Retrieve the stage instance
     *
     * @returns {Stage}
     */
    public getStage(): Stage {
        return this.stage;
    }

    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */
    public addChild(child: any, index?: number): void {
        child.parent = this;
        child.stage = this.stage;
        if (typeof index === "number") {
            // Use the arrayUtil function to add the item in the correct place within the array
            moveArrayItemIntoArray(child, this.children, index);
        } else {
            this.children.push(child);
        }
    }

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    public removeChild(child: any): void {
        removeArrayItem(this.children, child);
    }

    /**
     * Event called when starting starts on this element
     *
     * @param event
     * @param params
     */
    public onSortStart(event: Event, params: SortParams): void {
        if (params.block.id === this.id) {
            const originalEle = jQuery(params.originalEle);
            originalEle.show();
            originalEle.addClass("pagebuilder-sorting-original");

            // Reset the width & height of the helper
            jQuery(params.helper)
                .css({width: "", height: ""})
                .html(jQuery("<h3 />").text(this.title).html());
        }
    }

    /**
     * Set the children observable array into the class
     */
    public setChildren() {
        // Attach a subscription to the children of every editable area to fire the stageUpdated event
        this.children.subscribe(() => EventBus.trigger("stage:updated", {stage: this.stage}));
    }

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        EventBus.on("block:sortStart", this.onSortStart.bind(this));
    }
}
