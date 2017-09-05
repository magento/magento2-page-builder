import { AbstractStructural } from '../stage/structural/abstract';
/**
 * AbstractBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Block extends AbstractStructural {
    /**
     * AbstractBlock constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param formData
     */
    constructor(parent, stage, config, formData) {
        super(parent, stage);
        this.editOnInsert = true;
        this.childEntityKeys = [];
    }
}
