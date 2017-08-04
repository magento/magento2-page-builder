import { StageInterface } from 'stage.d';
import { Structural } from './abstract.d';

export interface EditableAreaInterface {
    children: KnockoutObservableArray<any>;
    stage: StageInterface;
    title: string;

    addChild(child: Structural, index?: number): void
    removeChild(child: any) :void
}