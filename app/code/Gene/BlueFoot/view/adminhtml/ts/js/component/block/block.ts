/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Structural from '../stage/structural/abstract';
import EditableArea from '../stage/structural/editable-area'
import Stage from '../stage';
import { Block as BlockInterface } from './block.d';
import getPreviewInstance from "../stage/previews";
import PreviewBlock from "./preview/block";
import $t from "mage/translate";
import _ from "underscore";
import {ConfigContentBlock, ConfigFieldConfig} from "../config";
import Appearance from "../../component/appearance/appearance";

interface FieldDefaults {
    [key: string]: any;
}

export default class Block extends Structural implements BlockInterface {
    title: string;
    editOnInsert: boolean = true;
    preview: PreviewBlock;
    childEntityKeys: Array<string> = [];

    /**
     * Block constructor
     *
     * @param {EditableArea} parent
     * @param {Stage} stage
     * @param {ConfigContentBlock} config
     * @param formData
     * @param {Appearance} appearance
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, appearance);

        this.preview = getPreviewInstance(this, config);

        let defaults: FieldDefaults = {};
        if (config.fields) {
            _.each(config.fields, (field: ConfigFieldConfig, key: string | number) => {
                defaults[key] = field.default;
            })
        }

        this.stage.store.update(
            this.id,
            _.extend(defaults, formData)
        );
    }

    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */
    get previewTemplate(): string {
        if (this.config.preview_template) {
            return this.config.preview_template;
        }
        return 'Gene_BlueFoot/component/block/preview/abstract.html';
    }

    /**
     * Retrieve the render template
     *
     * @returns {string}
     */
    get renderTemplate(): string {
        if (this.config.render_template) {
            return this.config.render_template;
        }
        return 'Gene_BlueFoot/component/block/render/abstract.html';
    }
}
