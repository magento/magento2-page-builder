import Structural from '../stage/structural/abstract';
import EditableArea from '../stage/structural/editable-area'
import Stage from '../stage';
import { Block as BlockInterface } from './block.d';
import getPreviewInstance from "../stage/previews";
import PreviewBlock from "./preview/block";
import $t from "mage/translate";
import _ from "underscore";

interface FieldDefaults {
    [key: string]: any;
}
interface FieldConfig {
    default: null | string | number;
}

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

        let defaults: FieldDefaults = {};
        if (config.fields) {
            _.each(config.fields, (field: FieldConfig, key: string | number) => {
                defaults[key] = field.default;
            })
        }

        this.stage.store.update(
            this.id,
            _.extend(defaults, formData)
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