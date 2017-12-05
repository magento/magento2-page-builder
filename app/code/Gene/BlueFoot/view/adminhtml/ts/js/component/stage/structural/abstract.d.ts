import EditableArea from './editable-area';
import { EditableAreaInterface } from "./editable-area.d";
import { OptionInterface } from "./options/option.d";
import Stage from "../../stage";

/**
 * StructuralInterface
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export interface Structural extends EditableAreaInterface {
    parent: EditableArea;
    stage: Stage;
    title: string;
    wrapperStyle: KnockoutObservable<object>;
    options: Array<OptionInterface>;
    children: KnockoutObservableArray<Structural>;
    template: string;
    childTemplate: string;
    config: any;
}