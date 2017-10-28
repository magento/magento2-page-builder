import Stage from '../../stage';
import EditableArea from './editable-area';
import { Structural as StructuralInterface } from "./abstract.d";
import { Options } from "./options";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";
import { ColumnBuilder } from "./column/builder";
import Edit from "../edit";
import StyleAttributeFilter from "../../../utils/style-attribute-filter";
import StyleAttributeMapper from "../../../utils/style-attribute-mapper";
import AttributeFilter from "../../../utils/attribute-filter";
import AttributeMapper from "../../../utils/attribute-mapper";
import AppearanceApplier from "../../../utils/appearance-applier";

import $t from 'mage/translate';
import ko from 'knockout';
import registry from 'uiRegistry';
import _ from 'underscore';

/**
 * Structural class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Structural extends EditableArea implements StructuralInterface {
    parent: EditableArea;
    stage: Stage;
    title: string;
    config: any;
    wrapperStyle: KnockoutObservable<object> = ko.observable({width: '100%'});
    edit: Edit;
    public options: Array<OptionInterface> = [
        new Option(this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10),
        new Option(this, 'edit', '<i></i>', $t('Edit'), this.onOptionEdit.bind(this), ['edit-block'], 50),
        new Option(this, 'duplicate', '<i></i>', $t('Duplicate'), this.onOptionDuplicate.bind(this), ['duplicate-structural'], 60),
        new Option(this, 'remove', '<i></i>', $t('Remove'), this.onOptionRemove.bind(this), ['remove-structural'], 100)
    ];
    optionsInstance: Options = new Options(this, this.options);
    children: KnockoutObservableArray<Structural> = ko.observableArray([]);
    template: string = 'Gene_BlueFoot/component/stage/structural/abstract.html';
    columnBuilder: ColumnBuilder = new ColumnBuilder();
    styleAttributeFilter: StyleAttributeFilter;
    styleAttributeMapper: StyleAttributeMapper;
    attributeFilter: AttributeFilter;
    attributeMapper: AttributeMapper;
    appearanceApplier: AppearanceApplier;

    previewChildTemplate: string = 'Gene_BlueFoot/component/block/preview/children.html';
    renderChildTemplate: string = 'Gene_BlueFoot/component/block/render/children.html';

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     */
    constructor(parent: EditableArea, stage: Stage, config: any = {}) {
        super(stage);
        super.setChildren(this.children);

        // Create a new instance of edit for our editing needs
        this.edit = new Edit(this, this.stage.store);
        this.styleAttributeFilter = new StyleAttributeFilter();
        this.styleAttributeMapper = new StyleAttributeMapper();
        this.attributeFilter = new AttributeFilter();
        this.attributeMapper = new AttributeMapper();
        this.appearanceApplier = new AppearanceApplier();

        this.parent = parent;
        this.stage = stage;
        this.config = config;
    }

    onOptionEdit(): void {
        this.edit.openAndRender();
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
     * @returns {object}
     */
    getCss() {
        let cssClasses = {};
        if ('css_classes' in this.getData()) {
            this.getData().css_classes.map((value, index) => cssClasses[value] = true);
        }
        return cssClasses;
    }

    /**
     * @returns {object}
     */
    getStyle() {
        let styleAttributes = this.getData();
        styleAttributes = this.appearanceApplier.apply(styleAttributes);
        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
    }

    /**
     * @returns {object}
     */
    getAttributes() {
        let data = this.getData();
        _.extend(data, this.config);
        return this.attributeMapper.toDom(this.attributeFilter.filter(data));
    }

    /**
     * @returns {object}
     */
    getData() {
        return this.stage.store.get(this.id);
    }
}