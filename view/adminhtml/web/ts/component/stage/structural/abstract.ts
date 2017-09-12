import { StageInterface } from '../../stage.d';
import EditableArea from './editable-area';
import { EditableAreaInterface } from './editable-area.d';
import { Structural as StructuralInterface } from "./abstract.d";
import { Options } from "./options";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";

import $t from 'mage/translate';
import * as ko from 'knockout';

/**
 * AbstractStructural class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class AbstractStructural extends EditableArea implements StructuralInterface {
    parent: any;
    stage: any;
    id: number;
    title: string;
    public options: Array<OptionInterface> = [
        new Option(this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10),
        new Option(this, 'edit', '<i></i>', $t('Edit'), this.onOptionEdit.bind(this), ['edit-block'], 50),
        new Option(this, 'duplicate', '<i></i>', $t('Duplicate'), this.onOptionDuplicate.bind(this), ['duplicate-structural'], 60),
        new Option(this, 'remove', '<i></i>', $t('Remove'), this.onOptionRemove.bind(this), ['remove-structural'], 100)
    ];
    optionsInstance: Options = new Options(this, this.options);
    data: KnockoutObservable<object> = ko.observable({});
    children: KnockoutObservableArray<StructuralInterface> = ko.observableArray([]);
    template: string = 'Gene_BlueFoot/component/stage/structural/abstract.html';
    childTemplate: string = 'Gene_BlueFoot/component/stage/structural/children.html';

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    constructor(parent: EditableAreaInterface, stage: StageInterface) {
        super(stage);
        super.setChildren(this.children);

        this.parent = parent;
        this.stage = stage;
    }

    onOptionEdit() {

    }

    onOptionDuplicate() {

    }

    onOptionRemove() {

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