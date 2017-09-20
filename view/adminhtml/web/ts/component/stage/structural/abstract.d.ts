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
    id: string;
    title: string;
    wrapperStyle: KnockoutObservable<object>;
    options: Array<OptionInterface>;
    data: KnockoutObservable<object>;
    children: KnockoutObservableArray<Structural>;
    template: string;
    childTemplate: string;
}
