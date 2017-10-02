import Structural from '../stage/structural/abstract';
import EditableArea from '../stage/structural/editable-area'
import Stage from '../stage';
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
export default class Block extends Structural implements BlockInterface {
    title: string;
    editOnInsert: boolean = true;
    preview: PreviewBlock;
    childEntityKeys: Array<string> = [];
    template: string = 'Gene_BlueFoot/component/block/abstract.html';
    config: any;

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
    constructor(parent: EditableArea, stage: Stage, config: any, formData: any) {
        super(parent, stage, config);

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