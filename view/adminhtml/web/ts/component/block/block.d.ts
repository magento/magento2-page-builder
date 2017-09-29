import { Structural } from 'stage/structural/abstract.d';

export interface Block extends Structural {
    title: string;
    editOnInsert: boolean;
    preview: any; // @todo
    childEntityKeys: Array<string>;
}