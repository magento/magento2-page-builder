import { EditableAreaInterface } from './editable-area.d';
import { StageInterface } from 'stage.d';
import { OptionInterface } from "./options/option.d";

/**
 * StructuralInterface
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export interface Structural extends EditableAreaInterface {
    parent: EditableAreaInterface;
    stage: StageInterface;
    title: string;
    wrapperStyle: KnockoutObservable<object>;
    options: Array<OptionInterface>;
    children: KnockoutObservableArray<Structural>;
    template: string;
    childTemplate: string;
    config: any;
}