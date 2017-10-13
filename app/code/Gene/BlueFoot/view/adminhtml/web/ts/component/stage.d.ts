import { EditableAreaInterface } from 'stage/structural/editable-area.d';
import Row from './stage/structural/row';
import DataStore from "./data-store";
import Build from "./stage/build";

export interface StageInterface extends EditableAreaInterface {
    parent: any;
    active: boolean;
    showBorders: KnockoutObservable<boolean>;
    userSelect: KnockoutObservable<boolean>;
    loading: KnockoutObservable<boolean>;
    originalScrollTop: number;
    serializeRole: string;
    store: DataStore;

    build(): void
    ready(): void
    addRow(self: StageInterface, data?: object): Row
    openTemplateManager(): void
    goFullScreen(): void
    addComponent(): void
    onSortingStart(): void
    onSortingStop(): void
    isFullScreen(): boolean
}