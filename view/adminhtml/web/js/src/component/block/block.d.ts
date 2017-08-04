import { Structural } from 'stage/structural/abstract.d';
import { Block } from 'block';

export interface Block extends Structural {
    title: string;
    config: object;
    editOnInsert: boolean;
    preview: any; // @todo
    childEntityKeys: Array<string>;
}