import { Structural } from 'stage/structural/abstract.d';
import PreviewBlock from "./preview/block";

export interface Block extends Structural {
    title: string;
    editOnInsert: boolean;
    preview: PreviewBlock;
    childEntityKeys: Array<string>;
}