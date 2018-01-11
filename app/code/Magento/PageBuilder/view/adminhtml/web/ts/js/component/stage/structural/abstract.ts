/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import _ from "underscore";
import Appearance from "../../appearance/appearance";
import {DataObject} from "../../data-store";
import AttributeFilter from "../../format/attribute-filter";
import AttributeMapper from "../../format/attribute-mapper";
import StyleAttributeFilter from "../../format/style-attribute-filter";
import StyleAttributeMapper from "../../format/style-attribute-mapper";
import Stage from "../../stage";
import Edit from "../edit";
import { Structural as StructuralInterface } from "./abstract.d";
import EditableArea from "./editable-area";
import { Options } from "./options";
import { Option } from "./options/option";

export default class Structural extends EditableArea implements StructuralInterface {
    public appearance: Appearance;
    public config: any;
    public children: KnockoutObservableArray<Structural> = ko.observableArray([]);
    public edit: Edit;
    public parent: EditableArea;
    public title: string;
    public wrapperStyle: KnockoutObservable<object> = ko.observable({width: "100%"});
    protected attributeFilter: AttributeFilter = new AttributeFilter();
    protected attributeMapper: AttributeMapper =  new AttributeMapper();
    protected optionsInstance: Options = new Options(this, this.options);
    protected styleAttributeFilter: StyleAttributeFilter = new StyleAttributeFilter();
    protected styleAttributeMapper: StyleAttributeMapper = new StyleAttributeMapper();

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param appearance
     */
    constructor(
        parent: EditableArea,
        stage: Stage,
        config: any = {},
        appearance: Appearance = new Appearance({}),
    ) {
        super(stage);
        this.setChildren(this.children);

        // Create a new instance of edit for our editing needs
        this.edit = new Edit(this, this.stage.store);
        this.appearance = appearance;
        this.parent = parent;
        this.config = config;
    }

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    get options(): Option[] {
        return [
            new Option(this, "move", "<i></i>", $t("Move"), false, ["move-structural"], 10),
            new Option(this, "edit", "<i></i>", $t("Edit"), this.onOptionEdit, ["edit-block"], 50),
            new Option(
                this,
                "duplicate",
                "<i class='icon-pagebuilder-copy'></i>",
                $t("Duplicate"),
                this.onOptionDuplicate,
                ["duplicate-structural"],
                60,
            ),
            new Option(this, "remove", "<i></i>", $t("Remove"), this.onOptionRemove, ["remove-structural"], 100),
        ];
    }

    /**
     * Retrieve the template for the structural
     *
     * @returns {string}
     */
    get template(): string {
        return "Magento_PageBuilder/component/stage/structural/abstract.html";
    }

    /**
     * Retrieve the preview child template
     *
     * @returns {string}
     */
    get previewChildTemplate(): string {
        return "Magento_PageBuilder/component/block/preview/children.html";
    }

    /**
     * Retrieve the child template
     *
     * @returns {string}
     */
    get renderChildTemplate(): string {
        return "Magento_PageBuilder/component/block/render/children.html";
    }

    /**
     * Handle user editing an instance
     */
    public onOptionEdit(): void {
        this.edit.open();
    }

    /**
     * Handle duplicate of items
     */
    public onOptionDuplicate(): void {
        this.parent.duplicateChild(this);
    }

    /**
     * Handle block removal
     */
    public onOptionRemove(): void {
        this.stage.parent.confirmationDialog({
            actions: {
                confirm: () => {
                    // Call the parent to remove the child element
                    this.parent.emit("blockRemoved", {
                        block: this,
                    });
                },
            },
            content: $t("Are you sure you want to remove this item? " +
                "The data within this item is not recoverable once removed."),
            title: $t("Confirm Item Removal"),
        });
    }

    /**
     * Get css classes for an block
     * Example {"class-name": true}
     *
     * @returns {DataObject}
     */
    public getCss() {
        const cssClasses: any = {};
        if ("css_classes" in this.getData() && this.getData().css_classes !== "") {
            this.getData().css_classes.split(" ").map(
                (value: any, index: number) => cssClasses[value] = true,
            );
        }
        return cssClasses;
    }

    /**
     * Get stype properties for an block
     * Example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     */
    public getStyle() {
        let styleAttributes = this.getData();
        styleAttributes = this.appearance.add(styleAttributes);
        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
    }

    /**
     * Get attributes for an block
     * Example {"data-role": "element"}
     *
     * @returns {DataObject}
     */
    public getAttributes(extra = {}) {
        const data: DataObject = this.getData();
        _.extend(data, this.config);
        return _.extend(
            this.attributeMapper.toDom(this.attributeFilter.filter(data)),
            extra,
        );
    }

    /**
     * Get block data
     *
     * @returns {DataObject}
     */
    public getData() {
        return this.stage.store.get(this.id);
    }
}
