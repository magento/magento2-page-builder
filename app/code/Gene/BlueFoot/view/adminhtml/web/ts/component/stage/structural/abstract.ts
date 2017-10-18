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
     * @param config
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
     * 
     * @todo refactor, abstract, this is just a prototype
     */
    onOptionEdit(): void {
        // @todo dynamically build from config
        const formComponent = 'bluefoot_heading_form';

        let modal = registry.get('bluefoot_modal_form.bluefoot_modal_form.modal'),
            insertForm = registry.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');

        // Destroy any existing components that exist for this type
        let existingComponent;
        if (existingComponent = registry.get(formComponent + '.' + formComponent)) {
            existingComponent.destroy();
        }

        modal.setTitle($t('Edit ' + (this.config.name || $t('Block'))));
        modal.openModal();

        // Reset the insert form component
        insertForm.destroyInserted();
        insertForm.removeActions();

        // Pass the UI component to the render function
        insertForm.onRender((<any>window).components['bluefoot_heading_form']);

        // Retrieve the component
        registry.get(formComponent + '.' + formComponent, (component: any) => {
            const provider = registry.get(component.provider);

            // Set the instance to act as it's client in the data provider
            provider.client = this;

            // Set the data on the provider from the data store
            provider.set('data', this.stage.store.get(this.id));
        });
    }

    /**
     * Save any data which has been modified in the edit panel
     * 
     * @todo create new dedicated client for saving
     * 
     * @param data 
     * @param options 
     */
    save(data: any, options: any): void {
        this.stage.store.update(this.id, data);

        registry.get('bluefoot_modal_form.bluefoot_modal_form.modal').closeModal();
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