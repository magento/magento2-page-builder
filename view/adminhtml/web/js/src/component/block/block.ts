import { AbstractStructural } from '../stage/structural/abstract';
import { EditableAreaInterface } from '../stage/structural/editable-area.d'
import { StageInterface } from '../stage.d';
import { Block as BlockInterface } from './block.d';

/**
 * AbstractBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Block extends AbstractStructural implements BlockInterface {
    title: string;
    config: object;
    editOnInsert: boolean = true;
    preview: any; // @todo
    childEntityKeys: Array<string> = [];

    /**
     * AbstractBlock constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param formData
     */
    constructor(parent: EditableAreaInterface, stage: StageInterface, config: any, formData: any) {
        super(parent, stage);
    }
}