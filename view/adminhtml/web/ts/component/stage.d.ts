import { EditableAreaInterface } from 'stage/structural/editable-area.d';
import Row from './stage/structural/row';

export interface StageInterface extends EditableAreaInterface {
    parent: any;
    active: boolean;
    showBorders: KnockoutObservable<boolean>;
    userSelect: KnockoutObservable<boolean>;
    loading: KnockoutObservable<boolean>;
    serializeRole: string;

    build(): void
    ready(): void
    addRow(self: StageInterface, data?: object): Row
    openTemplateManager(): void
    addComponent(): void
    onSortingStart(): void
    onSortingStop(): void
}