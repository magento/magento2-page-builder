import Stage from '../../stage';
import EditableArea from './editable-area';
import { Structural as StructuralInterface } from "./abstract.d";
import { Options } from "./options";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";
import { ColumnBuilder } from "./column/builder";

import $t from 'mage/translate';
import ko from 'knockout';
import registry from 'uiRegistry';

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
    public options: Array<OptionInterface> = [
        new Option(this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10),
        new Option(this, 'edit', '<i></i>', $t('Edit'), this.onOptionEdit.bind(this), ['edit-block'], 50),
        new Option(this, 'duplicate', '<i></i>', $t('Duplicate'), this.onOptionDuplicate.bind(this), ['duplicate-structural'], 60),
        new Option(this, 'remove', '<i></i>', $t('Remove'), this.onOptionRemove.bind(this), ['remove-structural'], 100)
    ];
    optionsInstance: Options = new Options(this, this.options);
    children: KnockoutObservableArray<Structural> = ko.observableArray([]);
    template: string = 'Gene_BlueFoot/component/stage/structural/abstract.html';
    childTemplate: string = 'Gene_BlueFoot/component/stage/structural/children.html';
    columnBuilder: ColumnBuilder = new ColumnBuilder();

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    constructor(parent: EditableArea, stage: Stage, config: any = {}) {
        super(stage);
        super.setChildren(this.children);

        this.parent = parent;
        this.stage = stage;
        this.config = config;
    }

    /**
     * Open edit panel when user requests to edit instance
     */
    onOptionEdit(): void {
        let modal = registry.get('bluefoot_modal_form.bluefoot_modal_form.modal'),
            insertForm = registry.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');
        modal.setTitle($t('Edit ' + this.config.name));
        modal.openModal();

        insertForm.removeActions();
        insertForm.onRender(window.components['bluefoot_heading_form']);
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
     * Retrieve the template from the class
     *
     * @deprecated use this.template instead
     * @returns {string}
     */
    getTemplate(): string {
        return this.template;
    }

    /**
     * Retrieve the child template
     *
     * @deprecated
     * @returns {string}
     */
    getChildTemplate(): string {
        return this.childTemplate;
    }
}