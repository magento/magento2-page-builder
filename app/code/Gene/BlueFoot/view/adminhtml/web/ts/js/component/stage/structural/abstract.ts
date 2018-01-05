/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import ko from 'knockout';
import $t from 'mage/translate';
import Stage from '../../stage';
import EditableArea from './editable-area';
import { Structural as StructuralInterface } from "./abstract.d";
import { Options } from "./options";
import { Option } from "./options/option";
import { ColumnBuilder } from "./column/builder";
import Edit from "../edit";
import StyleAttributeFilter from "../../format/style-attribute-filter";
import StyleAttributeMapper from "../../format/style-attribute-mapper";
import AttributeFilter from "../../format/attribute-filter";
import AttributeMapper from "../../format/attribute-mapper";
import {DataObject} from "../../data-store";
import Appearance from "../../appearance/appearance";
'use strict';

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
    appearance: Appearance;

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
        appearance: Appearance = new Appearance({})
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
    get options(): Array<Option> {
        return [
            new Option(this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10),
            new Option(this, 'edit', '<i></i>', $t('Edit'), this.onOptionEdit, ['edit-block'], 50),
            new Option(this, 'duplicate', '<i class="icon-bluefoot-copy"></i>', $t('Duplicate'), this.onOptionDuplicate, ['duplicate-structural'], 60),
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
            title: $t('Confirm Item Removal'),
            content: $t('Are you sure you want to remove this item? The data within this item is not recoverable once removed.'),
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
        if ('css_classes' in this.getData() && this.getData().css_classes != '') {
            this.getData().css_classes.split(' ').map(
                (value, index) => cssClasses[value] = true
            );
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
        styleAttributes = this.appearance.add(styleAttributes);
        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
    }

    /**
     * Get attributes for an block
     * Example {'data-role': 'element'}
     *
     * @returns {DataObject}
     */
    getAttributes(extra = {}) {
        let data: DataObject = this.getData();
        _.extend(data, this.config);
        return _.extend(
            this.attributeMapper.toDom(this.attributeFilter.filter(data)),
            extra
        );
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
