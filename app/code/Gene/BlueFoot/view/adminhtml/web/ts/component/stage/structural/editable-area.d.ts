import { StageInterface } from 'stage.d';
import { Structural } from './abstract.d';
import { EventEmitterInterface } from '../../event-emitter.d';

export interface EditableAreaInterface extends EventEmitterInterface {
    id: string;
    children: KnockoutObservableArray<any>;
    stage: StageInterface;
    title: string;

    addChild(child: Structural, index?: number): void
    removeChild(child: any) :void
}