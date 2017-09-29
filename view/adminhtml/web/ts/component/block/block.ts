import { AbstractStructural } from '../stage/structural/abstract';
import { EditableAreaInterface } from '../stage/structural/editable-area.d'
import { StageInterface } from '../stage.d';
import { Block as BlockInterface } from './block.d';
import getPreviewInstance from "../stage/previews";
import PreviewBlock from "./preview/block";
import $t from "mage/translate";
import _ from "underscore";

/**
 * AbstractBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Block extends AbstractStructural implements BlockInterface {
    title: string;
    config: any;
    editOnInsert: boolean = true;
    preview: PreviewBlock;
    childEntityKeys: Array<string> = [];
    template: string = 'Gene_BlueFoot/component/block/abstract.html';

    // @todo temp for testing, remove after building edit capabilities
    defaults: object = {
        heading_type: 'h2',
        title: $t('Type heading content here...')
    };

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

        this.config = config;
        this.preview = getPreviewInstance(this, config);

        this.stage.store.update(
            this.id,
            _.extend(this.defaults, formData)
        );
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