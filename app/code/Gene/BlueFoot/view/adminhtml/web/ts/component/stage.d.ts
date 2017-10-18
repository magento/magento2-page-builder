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
    serializeRole: string;
    store: DataStore;

    build(buildInstance: Build, buildStructure: HTMLElement): void;
    ready(): void
    addRow(self: StageInterface, data?: object): Row
    openTemplateManager(): void
    addComponent(): void
    onSortingStart(): void
    onSortingStop(): void
}