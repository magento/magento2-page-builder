import { AbstractStructural } from '../stage/structural/abstract';
import getPreviewInstance from "../stage/previews";
/**
 * AbstractBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Block extends AbstractStructural {
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
        this.template = 'Gene_BlueFoot/component/block/abstract.html';
        this.config = config;
        this.preview = getPreviewInstance(this, config);
    }
    /**
     * Retrieve the template from the preview or super
     *
     * @returns {string}
     */
    getTemplate() {
        if (this.preview.template) {
            return this.preview.template;
        }
        // Implement preview template system here
        return super.getTemplate();
    }
}
