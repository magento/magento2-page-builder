/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Stage from '../../stage';
import EditableArea from './editable-area';
import { Structural as StructuralInterface } from "./abstract.d";
import { Options } from "./options";
import { Option } from "./options/option";
import { ColumnBuilder } from "./column/builder";
import Edit from "../edit";
import StyleAttributeFilter from "../../../utils/style-attribute-filter";
import StyleAttributeMapper from "../../../utils/style-attribute-mapper";
import AttributeFilter from "../../../utils/attribute-filter";
import AttributeMapper from "../../../utils/attribute-mapper";
import {DataObject} from "../../data-store";
import AppearanceApplier from "../../../utils/appearance-applier";

import $t from 'mage/translate';
import ko from 'knockout';
import _ from 'underscore';

export default class Structural extends EditableArea implements StructuralInterface {
    parent: EditableArea;
    title: string;
    config: any;
    wrapperStyle: KnockoutObservable<object> = ko.observable({width: '100%'});
    edit: Edit;
    optionsInstance: Options = new Options(this, this.options);
    children: KnockoutObservableArray<Structural> = ko.observableArray([]);
    columnBuilder: ColumnBuilder = new ColumnBuilder();
    styleAttributeFilter: StyleAttributeFilter = new StyleAttributeFilter();
    styleAttributeMapper: StyleAttributeMapper = new StyleAttributeMapper();
    attributeFilter: AttributeFilter = new AttributeFilter();
    attributeMapper: AttributeMapper =  new AttributeMapper();
    appearanceApplier: AppearanceApplier;

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param appearanceApplier
     */
    constructor(
        parent: EditableArea,
        stage: Stage,
        config: any = {},
        appearanceApplier: AppearanceApplier = new AppearanceApplier({})
    ) {
        super(stage);
        this.setChildren(this.children);

        // Create a new instance of edit for our editing needs
        this.edit = new Edit(this, this.stage.store);
        this.appearanceApplier = appearanceApplier;

        this.parent = parent;
        this.config = config;
    }

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    get options(): Array<Option> {
        return [
            new Option(this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10),
            new Option(this, 'edit', '<i></i>', $t('Edit'), this.onOptionEdit, ['edit-block'], 50),
            new Option(this, 'duplicate', '<i></i>', $t('Duplicate'), this.onOptionDuplicate, ['duplicate-structural'], 60),
            new Option(this, 'remove', '<i></i>', $t('Remove'), this.onOptionRemove, ['remove-structural'], 100)
        ];
    }

    /**
     * Retrieve the template for the structural
     *
     * @returns {string}
     */
    get template(): string {
        return 'Gene_BlueFoot/component/stage/structural/abstract.html';
    }

    /**
     * Retrieve the preview child template
     *
     * @returns {string}
     */
    get previewChildTemplate(): string {
        return 'Gene_BlueFoot/component/block/preview/children.html';
    }

    /**
     * Retrieve the child template
     *
     * @returns {string}
     */
    get renderChildTemplate(): string {
        return 'Gene_BlueFoot/component/block/render/children.html';
    }

    /**
     * Handle user editing an instance
     */
    onOptionEdit(): void {
        this.edit.open();
    }

    /**
     * Handle duplicate of items
     */
    onOptionDuplicate(): void {
        this.parent.duplicateChild(this);
    }

    /**
     * Handle block removal
     */
    onOptionRemove(): void {
        this.stage.parent.confirmationDialog({
            title: 'Confirm Item Removal',
            content: 'Are you sure you want to remove this item? The data within this item is not recoverable once removed.',
            actions: {
                confirm: () => {
                    // Call the parent to remove the child element
                    this.parent.emit('blockRemoved', {
                        block: this
                    });
                }
            }
        });
    }

    /**
     * Get css classes for an block
     * Example {'class-name': true}
     *
     * @returns {DataObject}
     */
    getCss() {
        let cssClasses = {};
        if ('css_classes' in this.getData()) {
            this.getData().css_classes.map((value, index) => cssClasses[value] = true);
        }
        return cssClasses;
    }

    /**
     * Get stype properties for an block
     * Example {'backgroundColor': '#cccccc'}
     *
     * @returns {DataObject}
     */
    getStyle() {
        let styleAttributes = this.getData();
        styleAttributes = this.appearanceApplier.apply(styleAttributes);
        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
    }

    /**
     * Get attributes for an block
     * Example {'data-role': 'element'}
     *
     * @returns {DataObject}
     */
    getAttributes() {
        let data = this.getData();
        _.extend(data, this.config);
        return this.attributeMapper.toDom(this.attributeFilter.filter(data));
    }

    /**
     * Get block data
     *
     * @returns {DataObject}
     */
    getData() {
        return this.stage.store.get(this.id);
    }
}
