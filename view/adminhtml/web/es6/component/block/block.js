import { AbstractStructural } from '../stage/structural/abstract';
import getPreviewInstance from "../stage/previews";
import $t from "mage/translate";
import _ from "underscore";
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
        // @todo temp for testing, remove after building edit capabilities
        this.defaults = {
            heading_type: 'h2',
            title: $t('Type heading content here...')
        };
        this.config = config;
        this.preview = getPreviewInstance(this, config);
        this.stage.store.update(this.id, _.extend(this.defaults, formData));
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
